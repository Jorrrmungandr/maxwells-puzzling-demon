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

  getTileType(pos: Position) {
    if (pos.x < 0
      || pos.x >= this.grid.value.length
      || pos.y < 0
      || pos.y >= this.grid.value[0].length
    ) return TileType.Wall

    return this.grid.value[pos.x]?.[pos.y]
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
    // 新位置有砖块且能推动
    if (blockId !== null && this.canMove(direction, blockId)) {
      this.pushBlock(direction, blockId)
      this.demonPos.value = newPos
    } else if (this.getTileType(newPos) === TileType.Empty) {
      this.demonPos.value = newPos
    }
  }

  // 朝指定方向递归推动砖块
  pushBlock(direction: Position, blockId: number) {
    const block = this.blocks.value.find(block => block.id === blockId)!

    for (const item of block.items) {
      const newPos = {
        x: item.position.x + direction.x,
        y: item.position.y + direction.y
      }

      const newBlockId = this.findBlock(newPos)
      if (newBlockId !== null && newBlockId) {
        this.pushBlock(direction, newBlockId)
      }

      item.position.x += direction.x
      item.position.y += direction.y
    }

    return true
  }

  // 判断砖块能否在某个方向上移动
  canMove(direction: Position, blockId: number) {
    const block = this.blocks.value.find(block => block.id === blockId)!

    for (const item of block.items) {
      const newPos = {
        x: item.position.x + direction.x,
        y: item.position.y + direction.y
      }
      // 如果移动路径上有墙，就不能移动
      if (this.getTileType(newPos) === TileType.Wall) return false

      // 如果移动路径上有砖块，判断该砖块是否可以移动 (注意还要判断这个砖块是不是本身)
      const newBlockId = this.findBlock(newPos)
      // block id可能为0, 因此要判断是否为null, 不能直接转为boolean
      if (newBlockId !== null && newBlockId !== blockId) {
        // 移动路径上有其他block, 判断该block是否可以移动
        console.log(newPos, newBlockId)
        if (!this.canMove(direction, newBlockId)) return false
      }

    }
    return true
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

