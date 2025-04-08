import {Direction, Position} from "~/types/game";

export function getBlockItemEdges(block: number[][], position: Position) {
  let res = ['UP', 'DOWN', 'RIGHT', 'LEFT'] as Direction[]

  if (block.some(item => item[0] === position.x + 1 && item[1] === position.y)) {
    res = res.filter(dir => dir !== 'DOWN')
  }
  if (block.some(item => item[0] === position.x - 1 && item[1] === position.y)) {
    res = res.filter(dir => dir !== 'UP')
  }
  if (block.some(item => item[0] === position.x && item[1] === position.y + 1)) {
    res = res.filter(dir => dir !== 'RIGHT')
  }
  if (block.some(item => item[0] === position.x && item[1] === position.y - 1)) {
    res = res.filter(dir => dir !== 'LEFT')
  }

  return res
}
