export interface Position {
  x: number
  y: number
}

export enum TileType {
  Wall = 0,
  Empty = 1,
  Block = 2
}

export interface Demon {
  position: Position
  direction: Position
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export const DIRECTIONS: Record<Direction, Position> = {
  UP: {x: -1, y: 0},
  DOWN: {x: 1, y: 0},
  LEFT: {x: 0, y: -1},
  RIGHT: {x: 0, y: 1},
}

export type BlockProperty = 'HOT' | 'COLD' | 'NORMAL'

export interface BlockItem {
  position: Position
  insulation: Direction[]
  edges: Direction[]
}

export interface IBlock {
  id: number
  property: BlockProperty
  items: BlockItem[]
}
