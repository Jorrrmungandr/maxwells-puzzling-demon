export interface Position {
  x: number
  y: number
}

export interface Demon {
  position: Position
}

export const Direction: Record<any, Position> = {
  UP: {x: -1, y: 0},
  DOWN: {x: 1, y: 0},
  LEFT: {x: 0, y: -1},
  RIGHT: {x: 0, y: 1},
}
