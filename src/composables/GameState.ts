import {IBlock, DIRECTIONS, Position, TileType} from "~/types/game";
import {getBlockItemEdges} from "~/utils";

export class GameState {
  grid: Ref<TileType[][]>;
  blocks: Ref<IBlock[]>;
  demonPos: Ref<Position>;
  destinationPos: Position;

  constructor(
    grid: TileType[][],
    blocks: number[][][],
    demonPos: Position,
    destinationPos: Position
  ) {
    this.grid = ref(grid);
    this.demonPos = ref(demonPos);
    this.destinationPos = destinationPos

    // 由block的坐标创建blocks
    this.blocks = ref([] as IBlock[])

    blocks.forEach((block, index) => {
      const blockObj: IBlock= {
        id: index,
        property: 'NORMAL',
        items: block.map(([x, y]) => {
          return {
            position: { x, y },
            edges: getBlockItemEdges(block, { x, y }),
            insulation: []
          }
        })
      }
      this.blocks.value.push(blockObj)
    })

    document.addEventListener('keydown', (event) => {
      this.handleKeyPress(event.key)
    })

  }

  handleKeyPress(key: string) {
    switch (key) {
      case 'w':
      case 'ArrowUp':
        this.moveDemon(DIRECTIONS.UP);
        break;
      case 's':
      case 'ArrowDown':
        this.moveDemon(DIRECTIONS.DOWN);
        break;
      case 'a':
      case 'ArrowLeft':
        this.moveDemon(DIRECTIONS.LEFT);
        break;
      case 'd':
      case 'ArrowRight':
        this.moveDemon(DIRECTIONS.RIGHT);
        break;
      default:
        return
    }

    this.checkWin()

  }

  moveDemon(direction: Position) {
    const newPos = {
      x: this.demonPos.value.x + direction.x,
      y: this.demonPos.value.y + direction.y
    }

    let blockId = this.findBlock(newPos)
    if (blockId !== null) {
      this.pushBlock(direction, blockId)
    } else if (this.grid.value[newPos.x]?.[newPos.y] === TileType.Empty) {
      this.demonPos.value = newPos
    }
  }

  pushBlock(direction: Position, blockId: number) {
    const block = this.blocks.value.find(block => block.id === blockId)!

    for (const item of block.items) {
      const newPos = {
        x: item.position.x + direction.x,
        y: item.position.y + direction.y
      }
      // 如果移动路径上有墙，就不能移动
      if (this.grid.value[newPos.x]?.[newPos.y] === TileType.Wall) {
        return
      }
    }
    // 可以移动
    for (const item of block.items) {
      item.position.x += direction.x
      item.position.y += direction.y
    }

    this.moveDemon(direction)
  }

  checkWin() {
    if (this.grid.value[this.destinationPos.x]?.[this.destinationPos.y] === TileType.Block) {
      setTimeout(() => {
        alert('You win!')
      }, 100)
    }
  }

  findBlock(pos: Position) {
    for (const block of this.blocks.value) {
      for (const item of block.items) {
        if (item.position.x === pos.x && item.position.y === pos.y) {
          return block.id
        }
      }
    }
    return null
  }
}

