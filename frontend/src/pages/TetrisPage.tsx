import { useState, useEffect, useRef, useCallback } from 'react'
import { navigate } from '../App'
import '../styles/TetrisPage.css'

// Import trained weights
import GREEDY_WEIGHTS from '../data/greedy_weights.json'
import TREE_WEIGHTS from '../data/tree_weights.json'
import PERFECT_CLEAR_WEIGHTS from '../data/perfect_clear_weights.json'

// ═══════════════════════════════════════════════════════════════════════════════
// TETRIS ENGINE — ported from Python
// ═══════════════════════════════════════════════════════════════════════════════

const COLS = 10
const ROWS = 20

const TETROMINOES: Record<string, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
}

// Piece colors matched to site's warm palette
const PIECE_COLORS: Record<string, string> = {
  I: '#7ab8b8', // muted teal
  O: '#d9c4aa', // tan (var --c-tan)
  T: '#b8937a', // brown (var --c-brown)
  S: '#8a9a6b', // olive green
  Z: '#c47a6b', // terracotta
  J: '#6b7f9a', // slate blue
  L: '#c4a46b', // amber
}

const GHOST_ALPHA = 0.25
const KINDS = Object.keys(TETROMINOES)
type Weights = Record<string, number>

const BOT_WEIGHTS: Record<string, Weights> = {
  greedy: GREEDY_WEIGHTS,
  tree: TREE_WEIGHTS,
  perfect_clear: PERFECT_CLEAR_WEIGHTS,
}

// ─── Matrix helpers ──────────────────────────────────────────────────────────

function rotateMatrix(m: number[][]): number[][] {
  const rows = m.length, cols = m[0].length
  const out: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = m[r][c]
  return out
}

function uniqueRotations(kind: string): number[][][] {
  const rots: number[][][] = []
  const seen = new Set<string>()
  let cur = TETROMINOES[kind].map(r => [...r])
  for (let i = 0; i < 4; i++) {
    const key = JSON.stringify(cur)
    if (!seen.has(key)) { seen.add(key); rots.push(cur.map(r => [...r])) }
    cur = rotateMatrix(cur)
  }
  return rots
}

// ─── Grid helpers ────────────────────────────────────────────────────────────

type Grid = (string | null)[][]

function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function cloneGrid(g: Grid): Grid { return g.map(r => [...r]) }

function validPos(grid: Grid, mat: number[][], col: number, row: number): boolean {
  for (let r = 0; r < mat.length; r++)
    for (let c = 0; c < mat[0].length; c++) {
      if (!mat[r][c]) continue
      const nx = col + c, ny = row + r
      if (nx < 0 || nx >= COLS || ny >= ROWS) return false
      if (ny >= 0 && grid[ny][nx]) return false
    }
  return true
}

function dropRow(grid: Grid, mat: number[][], col: number): number | null {
  if (!validPos(grid, mat, col, 0)) return null
  let row = 0
  while (validPos(grid, mat, col, row + 1)) row++
  return row
}

function placeMatrix(grid: Grid, mat: number[][], col: number, row: number, color: string): Grid {
  const g = cloneGrid(grid)
  for (let r = 0; r < mat.length; r++)
    for (let c = 0; c < mat[0].length; c++)
      if (mat[r][c]) {
        const ny = row + r, nx = col + c
        if (ny >= 0 && ny < ROWS) g[ny][nx] = color
      }
  return g
}

function clearLines(grid: Grid): [Grid, number] {
  const full: number[] = []
  for (let i = 0; i < ROWS; i++) if (grid[i].every(c => c)) full.push(i)
  if (!full.length) return [grid, 0]
  const ng = grid.filter((_, i) => !full.includes(i))
  while (ng.length < ROWS) ng.unshift(Array(COLS).fill(null))
  return [ng, full.length]
}

// ─── Board analysis ──────────────────────────────────────────────────────────

function boardHeights(grid: Grid): number[] {
  const h: number[] = []
  for (let c = 0; c < COLS; c++) {
    let found = 0
    for (let r = 0; r < ROWS; r++) if (grid[r][c]) { found = ROWS - r; break }
    h.push(found)
  }
  return h
}

function holeCount(grid: Grid): number {
  let holes = 0
  for (let c = 0; c < COLS; c++) {
    let seen = false
    for (let r = 0; r < ROWS; r++) { if (grid[r][c]) seen = true; else if (seen) holes++ }
  }
  return holes
}

function bumpiness(h: number[]): number {
  let s = 0; for (let i = 0; i < h.length - 1; i++) s += Math.abs(h[i] - h[i + 1]); return s
}

function rightWellFeatures(grid: Grid, heights: number[]) {
  const right = COLS - 1
  let depth = 0, blocked = 0, openOk = 1
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][right]) { blocked++; if (depth === 0) openOk = 0 }
    else {
      const leftFilled = right - 1 >= 0 && !!grid[r][right - 1]
      if (leftFilled) depth++; else if (depth > 0) break
    }
  }
  return { open: openOk ? 1 : 0, depth, blocked }
}

function perfectClear(grid: Grid): boolean { return grid.every(row => row.every(c => !c)) }

function perfectClearSetup(grid: Grid, heights: number[]): number {
  const holes = holeCount(grid), agg = heights.reduce((a, b) => a + b, 0)
  const flat = -bumpiness(heights)
  const empty = grid.flat().filter(c => !c).length
  return Math.max(0, (empty / (ROWS * COLS)) * 6 + flat * 0.05 - holes * 1.5 - agg * 0.03)
}

// ─── Heuristic scoring ───────────────────────────────────────────────────────

function heuristicScore(
  grid: Grid, lines: number, w: Weights,
  nextQueue: string[], holdKind: string | null, bot: string
): number {
  const heights = boardHeights(grid)
  const holes = holeCount(grid)
  const agg = heights.reduce((a, b) => a + b, 0)
  const bump = bumpiness(heights)
  const mxh = Math.max(...heights)
  const well = rightWellFeatures(grid, heights)
  const pc = perfectClear(grid) ? 1 : 0
  const pcSetup = perfectClearSetup(grid, heights)
  const danger = Math.max(0, mxh - (ROWS - 6))
  const iBonus = (nextQueue[0] === 'I' || holdKind === 'I') ? 1 : 0

  let score = w.completed_lines * lines + w.holes * holes + w.aggregate_height * agg +
    w.bumpiness * bump + w.max_height * mxh + w.right_well_open * well.open +
    w.right_well_depth * well.depth + w.right_well_blocked * well.blocked +
    w.i_ready_bonus * iBonus + w.perfect_clear_bonus * pc +
    w.perfect_clear_setup * pcSetup + w.danger * danger

  if (bot !== 'greedy' && well.open <= 0 && well.depth < 3) score += w.well_lock_penalty
  if (bot === 'perfect_clear') { score += pcSetup * 4; score -= well.depth * 0.2 }
  return score
}

// ─── Action types ────────────────────────────────────────────────────────────

interface Action {
  kind: string
  matrix: number[][]
  col: number
  row: number
  useHold: boolean
}

interface SearchState {
  grid: Grid
  currentKind: string
  nextQueue: string[]
  holdKind: string | null
  canHold: boolean
}

// ─── Search ──────────────────────────────────────────────────────────────────

function enumerateActions(grid: Grid, kind: string, holdKind: string | null, canHold: boolean, nextQueue: string[]): Action[] {
  const actions: Action[] = []
  const addFor = (k: string, useHold: boolean) => {
    for (const mat of uniqueRotations(k)) {
      const pw = mat[0].length
      for (let col = 0; col <= COLS - pw; col++) {
        const row = dropRow(grid, mat, col)
        if (row === null) continue
        actions.push({ kind: k, matrix: mat, col, row, useHold })
      }
    }
  }
  addFor(kind, false)
  if (canHold) {
    const held = holdKind ?? nextQueue[0]
    if (held) addFor(held, true)
  }
  return actions
}

function advanceState(state: SearchState, action: Action, newGrid: Grid): SearchState {
  const nq = [...state.nextQueue]
  let holdKind = state.holdKind
  let currentKind: string
  if (action.useHold) {
    if (!state.holdKind) { holdKind = state.currentKind; currentKind = nq.shift()! }
    else { holdKind = state.currentKind; currentKind = state.holdKind }
  } else { currentKind = nq.shift()! }
  return { grid: newGrid, currentKind, nextQueue: nq, holdKind, canHold: true }
}

function searchValue(
  state: SearchState, w: Weights, depth: number, beam: number,
  discount: number, bot: string, cache: Map<string, number>
): number {
  const gk = JSON.stringify(state.grid) + state.currentKind + (state.holdKind ?? '') + depth
  if (cache.has(gk)) return cache.get(gk)!

  const actions = enumerateActions(state.grid, state.currentKind, state.holdKind, state.canHold, state.nextQueue)
  if (!actions.length) { cache.set(gk, -1e9); return -1e9 }

  const scored = actions.map(a => {
    const placed = placeMatrix(state.grid, a.matrix, a.col, a.row, '#fff')
    const [cg, lines] = clearLines(placed)
    const ns = advanceState(state, a, cg)
    const sc = heuristicScore(cg, lines, w, ns.nextQueue, ns.holdKind, bot)
    return { sc, ns }
  }).sort((a, b) => b.sc - a.sc).slice(0, beam)

  if (depth <= 1) { cache.set(gk, scored[0].sc); return scored[0].sc }

  let best = -1e9
  for (const { sc, ns } of scored) {
    const future = searchValue(ns, w, depth - 1, beam, discount, bot, cache)
    best = Math.max(best, sc + discount * future)
  }
  cache.set(gk, best)
  return best
}

function getBestAction(state: SearchState, bot: string, depth: number, beam: number): Action | null {
  const w = BOT_WEIGHTS[bot]
  const discount = 0.97
  const cache = new Map<string, number>()
  const actions = enumerateActions(state.grid, state.currentKind, state.holdKind, state.canHold, state.nextQueue)
  if (!actions.length) return null

  const d = bot === 'greedy' ? 1 : depth
  let bestAction: Action | null = null
  let bestScore = -Infinity

  for (const a of actions) {
    const placed = placeMatrix(state.grid, a.matrix, a.col, a.row, '#fff')
    const [cg, lines] = clearLines(placed)
    const ns = advanceState(state, a, cg)
    const immediate = heuristicScore(cg, lines, w, ns.nextQueue, ns.holdKind, bot)
    let total = immediate
    if (d > 1) {
      const future = searchValue(ns, w, d - 1, beam, discount, bot, cache)
      total = immediate + discount * future
    }
    if (total > bestScore) { bestScore = total; bestAction = a }
  }
  return bestAction
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════

function newBag(): string[] {
  const b = [...KINDS]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

interface GameState {
  grid: Grid
  currentKind: string
  nextQueue: string[]
  holdKind: string | null
  canHold: boolean
  score: number
  lines: number
  pieces: number
  done: boolean
  queue: string[]
}

function createGame(): GameState {
  const queue = [...newBag(), ...newBag()]
  const pop = () => { if (queue.length < 7) queue.push(...newBag()); return queue.shift()! }
  return {
    grid: emptyGrid(), currentKind: pop(),
    nextQueue: [pop(), pop(), pop(), pop(), pop()],
    holdKind: null, canHold: true, score: 0, lines: 0, pieces: 0, done: false, queue,
  }
}

function popKind(gs: GameState): string {
  if (gs.queue.length < 7) gs.queue.push(...newBag())
  return gs.queue.shift()!
}

const LINE_SCORES: Record<number, number> = { 1: 100, 2: 300, 3: 500, 4: 800 }

function stepGame(gs: GameState, action: Action): GameState {
  if (!action || gs.done) return { ...gs, done: true }
  let { grid, holdKind, canHold, score, lines, pieces, queue } = gs
  let currentKind = gs.currentKind
  const nextQueue = [...gs.nextQueue]

  if (action.useHold) {
    if (!holdKind) {
      holdKind = currentKind
      currentKind = nextQueue.shift()!
      nextQueue.push(popKind(gs))
    } else {
      const tmp = holdKind
      holdKind = currentKind
      currentKind = tmp
    }
    canHold = false
  }

  grid = placeMatrix(grid, action.matrix, action.col, action.row, PIECE_COLORS[action.kind])
  const [cg, cl] = clearLines(grid)
  grid = cg
  const level = Math.floor(lines / 10) + 1
  score += (LINE_SCORES[cl] || 0) * level
  lines += cl
  pieces += 1

  currentKind = nextQueue.shift()!
  nextQueue.push(popKind(gs))
  canHold = true

  const testActions = enumerateActions(grid, currentKind, holdKind, canHold, nextQueue)
  const done = testActions.length === 0

  return { grid, currentKind, nextQueue, holdKind, canHold, score, lines, pieces, done, queue }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

function drawGame(ctx: CanvasRenderingContext2D, gs: GameState, w: number, h: number) {
  const cellW = w / COLS, cellH = h / ROWS

  // Background
  ctx.fillStyle = '#f5ede3'
  ctx.fillRect(0, 0, w, h)

  // Grid lines
  ctx.strokeStyle = 'rgba(168,152,120,0.15)'
  ctx.lineWidth = 0.5
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * cellW, 0); ctx.lineTo(c * cellW, h); ctx.stroke()
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * cellH); ctx.lineTo(w, r * cellH); ctx.stroke()
  }

  // Placed blocks
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const cell = gs.grid[r][c]
      if (!cell) continue
      const color = typeof cell === 'string' ? cell : '#a89878'
      ctx.fillStyle = color
      ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2)
      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, 2)
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(c * cellW + 1, r * cellH + cellH - 3, cellW - 2, 2)
    }
}

function drawMiniPiece(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, cellSize = 14) {
  const mat = TETROMINOES[kind]
  ctx.fillStyle = PIECE_COLORS[kind]
  for (let r = 0; r < mat.length; r++)
    for (let c = 0; c < mat[0].length; c++)
      if (mat[r][c]) {
        ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize - 1, cellSize - 1)
      }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const BOT_INFO: Record<string, { label: string; desc: string }> = {
  greedy:        { label: 'Greedy',        desc: 'Best immediate move — fast, short-sighted' },
  tree:          { label: 'Tree Search',   desc: 'Depth-2 beam search — balanced' },
  perfect_clear: { label: 'Perfect Clear', desc: 'Prioritizes clearing the board entirely' },
}

const LIMITS = [0, 100, 500, 1000, 5000]

export default function TetrisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const holdRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<GameState>(createGame())
  const runningRef = useRef(false)

  const [bot, setBot] = useState('tree')
  const [maxPieces, setMaxPieces] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [stats, setStats] = useState({ score: 0, lines: 0, pieces: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(50)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    drawGame(ctx, gameRef.current, canvas.width, canvas.height)

    // Next queue preview
    const pCanvas = previewRef.current
    if (pCanvas) {
      const pCtx = pCanvas.getContext('2d')!
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height)
      const gs = gameRef.current
      for (let i = 0; i < Math.min(gs.nextQueue.length, 5); i++) {
        drawMiniPiece(pCtx, gs.nextQueue[i], 4, i * 36 + 4, 14)
      }
    }

    // Hold piece
    const hCanvas = holdRef.current
    if (hCanvas) {
      const hCtx = hCanvas.getContext('2d')!
      hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height)
      if (gameRef.current.holdKind) {
        drawMiniPiece(hCtx, gameRef.current.holdKind, 4, 4, 14)
      }
    }
  }, [])

  const resetGame = useCallback(() => {
    gameRef.current = createGame()
    setStats({ score: 0, lines: 0, pieces: 0 })
    setGameOver(false)
    setPlaying(false)
    runningRef.current = false
    render()
  }, [render])

  useEffect(() => { resetGame() }, [resetGame])

  useEffect(() => {
    if (!playing || gameOver) { runningRef.current = false; return }
    runningRef.current = true

    let timeout: ReturnType<typeof setTimeout>
    const tick = () => {
      if (!runningRef.current) return
      const gs = gameRef.current
      if (!gs || gs.done) { setGameOver(true); setPlaying(false); runningRef.current = false; return }
      if (maxPieces > 0 && gs.pieces >= maxPieces) { setGameOver(true); setPlaying(false); runningRef.current = false; return }

      const state: SearchState = {
        grid: gs.grid, currentKind: gs.currentKind, nextQueue: gs.nextQueue,
        holdKind: gs.holdKind, canHold: gs.canHold,
      }
      const action = getBestAction(state, bot, 2, 8)
      if (!action) { setGameOver(true); setPlaying(false); runningRef.current = false; return }

      gameRef.current = stepGame(gs, action)
      const ng = gameRef.current
      setStats({ score: ng.score, lines: ng.lines, pieces: ng.pieces })
      render()

      if (ng.done) { setGameOver(true); setPlaying(false); runningRef.current = false; return }
      timeout = setTimeout(tick, speed)
    }

    timeout = setTimeout(tick, 10)
    return () => { runningRef.current = false; clearTimeout(timeout) }
  }, [playing, gameOver, bot, maxPieces, speed, render])

  const togglePlay = () => {
    if (gameOver) { resetGame(); return }
    setPlaying(p => !p)
  }

  const level = Math.floor(stats.lines / 10) + 1

  return (
    <div className="tetris-page">
      {/* ─ Sticky nav ─ */}
      <nav className="tetris-page__nav">
        <a href="/" onClick={e => { e.preventDefault(); navigate('/') }} className="tetris-page__back">
          ← Back
        </a>
        <span className="tetris-page__nav-title">Tetris AI</span>
      </nav>

      {/* ─ Header ─ */}
      <header className="tetris-page__header">
        <span className="tetris-page__eyebrow">Project</span>
        <h1 className="tetris-page__title">Tetris AI</h1>
        <p className="tetris-page__subtitle">
          Heuristic tree-search bot with hold piece support.
          Trained via hill-climbing on hand-crafted board evaluation features.
        </p>
      </header>

      {/* ─ Main content ─ */}
      <div className="tetris-page__body">
        <div className="tetris-page__game-area">
          {/* Hold */}
          <div className="tetris-page__side-panel tetris-page__hold">
            <span className="tetris-page__panel-label">Hold</span>
            <canvas ref={holdRef} width={70} height={40} />
          </div>

          {/* Board */}
          <div className="tetris-page__board-wrap">
            <canvas ref={canvasRef} width={COLS * 28} height={ROWS * 28}
              className="tetris-page__canvas" />
            {gameOver && (
              <div className="tetris-page__overlay">
                <div className="tetris-page__overlay-title">
                  {maxPieces > 0 && stats.pieces >= maxPieces ? 'Limit Reached' : 'Game Over'}
                </div>
                <div className="tetris-page__overlay-score">
                  {stats.score.toLocaleString()} pts
                </div>
              </div>
            )}
          </div>

          {/* Next queue */}
          <div className="tetris-page__side-panel tetris-page__next">
            <span className="tetris-page__panel-label">Next</span>
            <canvas ref={previewRef} width={70} height={190} />
          </div>
        </div>

        {/* ─ Controls ─ */}
        <div className="tetris-page__controls">
          {/* Stats */}
          <div className="tetris-page__card">
            <div className="tetris-page__stats-grid">
              {([['Score', stats.score.toLocaleString()], ['Lines', stats.lines], ['Pieces', stats.pieces], ['Level', level]] as [string, string | number][]).map(([label, val]) => (
                <div key={label} className="tetris-page__stat">
                  <span className="tetris-page__stat-label">{label}</span>
                  <span className="tetris-page__stat-value">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bot selector */}
          <div className="tetris-page__card">
            <span className="tetris-page__card-label">Agent</span>
            <div className="tetris-page__bot-list">
              {Object.entries(BOT_INFO).map(([key, { label, desc }]) => (
                <button key={key}
                  onClick={() => { if (!playing) setBot(key) }}
                  disabled={playing}
                  className={`tetris-page__bot-btn ${bot === key ? 'tetris-page__bot-btn--active' : ''}`}>
                  <span className="tetris-page__bot-name">{label}</span>
                  <span className="tetris-page__bot-desc">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Piece limit */}
          <div className="tetris-page__card">
            <span className="tetris-page__card-label">Piece Limit</span>
            <div className="tetris-page__limit-row">
              {LIMITS.map(n => (
                <button key={n}
                  onClick={() => { if (!playing) setMaxPieces(n) }}
                  disabled={playing}
                  className={`tetris-page__limit-btn ${maxPieces === n ? 'tetris-page__limit-btn--active' : ''}`}>
                  {n === 0 ? '∞' : n}
                </button>
              ))}
            </div>
          </div>

          {/* Speed */}
          <div className="tetris-page__card">
            <span className="tetris-page__card-label">
              Speed: {speed <= 5 ? 'Max' : speed >= 200 ? 'Slow' : `${speed}ms`}
            </span>
            <input type="range" min={0} max={200} value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="tetris-page__slider" />
          </div>

          {/* Actions */}
          <div className="tetris-page__actions">
            <button onClick={togglePlay} className={`tetris-page__play-btn ${gameOver ? 'tetris-page__play-btn--reset' : playing ? 'tetris-page__play-btn--pause' : ''}`}>
              {gameOver ? 'New Game' : playing ? 'Pause' : 'Play'}
            </button>
            <button onClick={resetGame} className="tetris-page__reset-btn">Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}