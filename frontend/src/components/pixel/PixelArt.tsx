import React from 'react'

// ── Shared palette ────────────────────────────────────────────────────────────
const P = {
  skin: '#C68642',        skinShadow: '#A0522D',
  hair: '#2C1810',        hairMid: '#3D1F0D',
  shirt: '#1e40af',       shirtShadow: '#1e3a8a',
  pants: '#374151',       pantsShadow: '#1f2937',
  shoes: '#111827',
  woodLight: '#C4A265',   woodMid: '#A0784A',
  woodDark: '#7A5C32',    woodPost: '#6B4C2A',
  white: '#f8fafc',
}

// ── Grid renderer ─────────────────────────────────────────────────────────────
type PixelGridProps = {
  grid: string[]
  palette: Record<string, string>
  pixelSize?: number
  x?: number
  y?: number
}

export function PixelGrid({ grid, palette, pixelSize = 4, x = 0, y = 0 }: PixelGridProps) {
  const rects: React.ReactElement[] = []
  grid.forEach((row, ri) => {
    ;[...row].forEach((ch, ci) => {
      const color = palette[ch]
      if (!color || color === 'transparent') return
      rects.push(
        <rect
          key={`${ri}-${ci}`}
          x={x + ci * pixelSize}
          y={y + ri * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={color}
        />
      )
    })
  })
  return <>{rects}</>
}

// ── Julian (back view, looking out at ocean) ──────────────────────────────────
export function PixelJulian({
  x = 0, y = 0, pixelSize = 4,
}: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    H: P.hair,       h: P.hairMid,
    S: P.skin,       s: P.skinShadow,
    B: P.shirt,      b: P.shirtShadow,
    P: P.pants,      p: P.pantsShadow,
    F: P.shoes,
    '.': 'transparent',
  }
  const grid = [
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '..HHHhHHHhHHHH..',
    '..HHHhHHHhHHHH..',
    '..HHHHHHHHHHHHH.',
    '...HHHHHHHHHH...',
    '...SSSSSSSSSS...',
    '..SSSsSSSSsSSS..',
    '..SSSSSSSSSSSS..',
    '..SSSSSSSSSSSS..',
    '...BBBBBBBBBB...',
    '..BBBBbBBbBBBB..',
    '.BBBBBBBBBBBBBb.',
    '.BBBBBBBBBBBBBb.',
    '.BBbBBBBBBBBbBB.',
    '.BBBBBBBBBBBBBb.',
    '.BBBBbBBBBbBBBB.',
    '..BBBBBBBBBBBb..',
    '..PPPPpPPPpPPP..',
    '..PPPPPPPpPPPP..',
    '..PPPPPPPPPPP...',
    '..PPpPPPPPpPP...',
    '..PPPPPPPPPPP...',
    '..PPPPPPPPPPP...',
    '...FFFF..FFFF...',
    '...FFFF..FFFF...',
    '...FFFF..FFFF...',
    '...FFFf..FFFf...',
    '................',
    '................',
    '................',
    '................',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Dock ──────────────────────────────────────────────────────────────────────
export function PixelDock({
  x = 0, y = 0, pixelSize = 4, width = 80,
}: { x?: number; y?: number; pixelSize?: number; width?: number }) {
  const boardH = 3 * pixelSize
  const postW  = 2 * pixelSize
  const postH  = 6 * pixelSize
  const boards = [P.woodLight, P.woodMid, P.woodDark]

  return (
    <g>
      {boards.map((color, i) => (
        <rect key={i} x={x} y={y + i * boardH} width={width * pixelSize} height={boardH} fill={color} />
      ))}
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((pct, i) => (
        <rect
          key={i}
          x={x + pct * width * pixelSize - postW / 2}
          y={y + 3 * boardH}
          width={postW}
          height={postH}
          fill={P.woodPost}
        />
      ))}
    </g>
  )
}

// ── Sea turtle ────────────────────────────────────────────────────────────────
export function PixelTurtle({ x = 0, y = 0, pixelSize = 3 }: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    G: '#4ade80', g: '#22c55e', d: '#166534',
    S: '#86efac', E: '#d1fae5', '.': 'transparent',
  }
  const grid = [
    '....GGGGGGG.....',
    '...GGGgGGGgGG...',
    '..GGGGGGGGGGGg..',
    '.dGGGGGSSGGGGGd.',
    '.dGGSSSSSSSGGGd.',
    'GGgGSSEEESSGGGGG',
    'GGgGSSEEESSGGGGG',
    '.dGGSSSSSSSGGGd.',
    '.dGGGGGSSGGGGGd.',
    '..GGGGGGGGGGGg..',
    '...GGG....GGG...',
    '....GG....GG....',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Jellyfish ─────────────────────────────────────────────────────────────────
export function PixelJellyfish({ x = 0, y = 0, pixelSize = 3 }: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    P: '#e879f9', p: '#a21caf', L: '#f0abfc',
    T: '#fae8ff', l: '#d946ef', '.': 'transparent',
  }
  const grid = [
    '....PPPPPPPP....',
    '...PPpPpPpPPP...',
    '..PPPpPpPpPPPP..',
    '.LLLLLLLLLLLLll.',
    '.TTTTTTTTTTTTll.',
    '..LLLLLLLLLLLL..',
    '...P..PP..PP...',
    '...P..PP..PP...',
    '..lP..lP..lP..l',
    '..l...l....l...',
    '...l...l...l...',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Shark ─────────────────────────────────────────────────────────────────────
export function PixelShark({ x = 0, y = 0, pixelSize = 3 }: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    D: '#64748b', d: '#475569', W: '#f8fafc',
    E: '#0f172a', F: '#334155', '.': 'transparent',
  }
  const grid = [
    '.......DDD......',
    '......DDDD......',
    '.....DDDDD......',
    '....DDDDdDDDDD..',
    '..DDDDDDdDDDDDDW',
    'DDDDDDddddDDDDDW',
    'DDDDDDDDDDDDDdE.',
    '..DDDDddddDDDDD.',
    '....DDDDDDDDD...',
    '......D...D.....',
    '.....DD...DD....',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Anglerfish ────────────────────────────────────────────────────────────────
export function PixelAnglerfish({ x = 0, y = 0, pixelSize = 3 }: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    D: '#1e3a5f', d: '#0f2040', G: '#4ade80', g: '#bbf7d0',
    E: '#fde047', T: '#f472b6', W: '#f8fafc', F: '#06b6d4',
    '.': 'transparent',
  }
  const grid = [
    '.....G..........',
    '....GgG.........',
    '....GG..........',
    '...DDDDDDdDD....',
    '..DDDDDdDDDDDD..',
    '.DDDDDDDddDDDDDd',
    'DDDDTTDDddDDDEED',
    'DDDDTTDDddDDDEED',
    '.DDDDDDDddDDDDDd',
    '..DDDDDdDDDDDD..',
    '...DDDFFDDdDD...',
    '.....FFFF.......',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Giant squid ───────────────────────────────────────────────────────────────
export function PixelSquid({ x = 0, y = 0, pixelSize = 3 }: { x?: number; y?: number; pixelSize?: number }) {
  const palette: Record<string, string> = {
    R: '#dc2626', r: '#991b1b', P: '#fca5a5',
    E: '#fef9c3', T: '#f87171', l: '#450a0a',
    '.': 'transparent',
  }
  const grid = [
    '....RRRRRRR.....',
    '...RRRrRRrRRR...',
    '..RRRRRRRRRRRr..',
    '.RRRRPPRPPRRRRr.',
    '.RRRRPEPEPRRRRr.',
    'RRRRRRRRRRRRRRRr',
    'RRRRRRrRrRRRRRRr',
    '.RRRRRRRRRRRRr..',
    '..RRRR..RRRRR...',
    '..TT.....TT.....',
    '..T.......T.....',
    '.lT.......Tl....',
    '.l.........l....',
  ]
  return <PixelGrid grid={grid} palette={palette} pixelSize={pixelSize} x={x} y={y} />
}

// ── Small fish (ambient decoration) ──────────────────────────────────────────
export function PixelFish({
  x = 0, y = 0, pixelSize = 2, color = '#fbbf24',
}: { x?: number; y?: number; pixelSize?: number; color?: string }) {
  return (
    <g>
      <rect x={x + pixelSize}     y={y}                  width={pixelSize * 3} height={pixelSize} fill={color} />
      <rect x={x}                 y={y + pixelSize}      width={pixelSize * 5} height={pixelSize} fill={color} />
      <rect x={x + pixelSize * 4} y={y + pixelSize}      width={pixelSize}     height={pixelSize} fill="#000" opacity={0.4} />
      <rect x={x + pixelSize}     y={y + pixelSize * 2}  width={pixelSize * 3} height={pixelSize} fill={color} />
      <rect x={x}                 y={y + pixelSize}      width={pixelSize}     height={pixelSize} fill={color} opacity={0.6} />
    </g>
  )
}

// ── Seagull ───────────────────────────────────────────────────────────────────
export function PixelSeagull({ x = 0, y = 0, pixelSize = 2 }: { x?: number; y?: number; pixelSize?: number }) {
  return (
    <g fill={P.white}>
      <rect x={x}                y={y + pixelSize} width={pixelSize} height={pixelSize} />
      <rect x={x + pixelSize}    y={y}             width={pixelSize} height={pixelSize} />
      <rect x={x + pixelSize * 2} y={y + pixelSize} width={pixelSize} height={pixelSize} />
    </g>
  )
}

// ── Creature map (used by OceanScroll) ────────────────────────────────────────
export const SEA_CREATURES = {
  turtle:     PixelTurtle,
  jellyfish:  PixelJellyfish,
  shark:      PixelShark,
  anglerfish: PixelAnglerfish,
  squid:      PixelSquid,
}
