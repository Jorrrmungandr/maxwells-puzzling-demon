import {IBlock, DIRECTIONS, Position, TileType, TempProperty, Demon, Snapshot} from "~/types/game";
import {getBlockItemEdges} from "~/utils";

export class GameState {
  grid: Ref<TileType[][]>;
  blocks: Ref<IBlock[]>;
  demon: Ref<Demon>;
  destinationPos: Position;
  snapshots: Snapshot[] = [];
  curSnapshotIdx: number;

  constructor(
    grid: TileType[][],
    blocks: {items: number[][], property: TempProperty}[],
    demonPos: Position,
    destinationPos: Position
  ) {
    this.grid = ref(grid);
    this.demon = ref({
      pos: demonPos,
      property: 'normal',
      isAlive: true
    }) as Ref<Demon>;
    this.destinationPos = destinationPos

    // 由传入的blocks坐标和属性创建blocks对象
    this.blocks = ref([] as IBlock[])

    blocks.forEach((block, index) => {
      const blockObj: IBlock= {
        id: index,
        property: block.property,
        items: block.items.map(([x, y]) => {
          return {
            position: { x, y },
            // 由block的item结构生成每个item暴露在外部的边
            edges: getBlockItemEdges(block.items, { x, y }),
            insulation: []
          }
        })
      }
      this.blocks.value.push(blockObj)
    })

    // 初始化快照
    // (vue3的ref是响应式的, 直接push会导致快照也变动, 因此要使用structuredClone)
    // (vue3解构出ref中的对象要先用unref再用toRaw, 前者解构出内部reactive对象, 后者解构出原始对象)
    this.snapshots.push({
      blocks: structuredClone(toRaw(unref(this.blocks))),
      demon: structuredClone(toRaw(unref(this.demon)))
    })
    this.curSnapshotIdx = 0

    // 处理this指向问题, bind会创建一个新的函数实例, 要这样才好移除
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleUndo = this.handleUndo.bind(this)

    document.addEventListener('keydown', this.handleKeyPress)
    document.addEventListener('keydown', this.handleUndo)

    watch(() => this.demon.value.isAlive, (isAlive) => {
      if (!isAlive) {
        // demon死亡, 取消移动的监听
        document.removeEventListener('keydown', this.handleKeyPress)
      }
      if (isAlive) {
        document.addEventListener('keydown', this.handleKeyPress)
      }
    })
  }

  getTileType(pos: Position) {
    if (pos.x < 0
      || pos.x >= this.grid.value.length
      || pos.y < 0
      || pos.y >= this.grid.value[0].length
    ) return TileType.Wall

    if (this.findBlock(pos) !== null) {
      return TileType.Block
    }

    return this.grid.value[pos.x]?.[pos.y]
  }

  handleKeyPress(event: KeyboardEvent) {
    const key = event.key
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

  handleUndo(event: KeyboardEvent) {
    const key = event.key
    if (key === 'u' || key === 'U') {
      // 撤销操作
      if (this.curSnapshotIdx > 0) {
        this.curSnapshotIdx--
        const lastSnapshot = this.snapshots[this.curSnapshotIdx] as Snapshot
        // 使用structuredClone, 否则会导致快照也变动
        // 这是因为给ref的value赋值成一个新对象, 会使该对象也具有响应式
        this.blocks.value = structuredClone(lastSnapshot.blocks)
        this.demon.value = structuredClone(lastSnapshot.demon)
      }
    } else if (key === 'y' || key === 'Y') {
      // 重做操作
      // 当前快照不是最后一个的时候才可以重做
      if (this.curSnapshotIdx < this.snapshots.length - 1) {
        this.curSnapshotIdx++
        const nextSnapshot = this.snapshots[this.curSnapshotIdx] as Snapshot
        this.blocks.value = structuredClone(nextSnapshot.blocks)
        this.demon.value = structuredClone(nextSnapshot.demon)
      }
    }
  }


  moveDemon(direction: Position) {
    let canMove = false
    const newPos = {
      x: this.demon.value.pos.x + direction.x,
      y: this.demon.value.pos.y + direction.y
    }

    let blockId = this.findBlock(newPos)
    if (blockId !== null && this.canMove(direction, blockId)) {
      // 新位置有砖块且能推动
      this.pushBlock(direction, blockId)
      canMove = true
    } else if (this.getTileType(newPos) === TileType.Empty) {
      // 新位置是空格, 直接移动
      canMove = true
    }

    if (canMove) {
      this.demon.value.pos = newPos
      // 移动之后, 更新热力值
      this.updateDemonProperty()
      // 热力值更新之后保存快照
      // 如果当前快照不是最后一个, 说明操作历史出现分叉, 删除之前的分支(即当前快照后面的所有)
      if (this.curSnapshotIdx < this.snapshots.length - 1) {
        this.snapshots.splice(this.curSnapshotIdx + 1)
        // console.log('diverge', this.curSnapshotIdx ,this.snapshots.map(el => el.demon.pos))
      }
      this.snapshots.push({
        blocks: structuredClone(toRaw(unref(this.blocks))),
        demon: structuredClone(toRaw(unref(this.demon)))
      })
      this.curSnapshotIdx++
    }

  }

  // 更新demon的热力属性
  updateDemonProperty() {
    let coldCount = 0
    let hotCount = 0
    const adjacentBlockIds = this.getAdjacentBlocks(this.demon.value.pos)

    // 遍历相邻的砖块, 计算冷热分别的值
    for (const blockId of adjacentBlockIds) {
      const block = this.blocks.value[blockId]
      if (block.property === 'cold') {
        coldCount += block.items.length
      } else if (block.property === 'hot') {
        hotCount += block.items.length
      }
    }

    console.log(`cold: ${coldCount}, hot: ${hotCount}`)

    if (coldCount > hotCount) {
      this.demon.value.property = 'cold'
      this.updateBlocksProperty(adjacentBlockIds, 'cold')
    } else if (hotCount > coldCount) {
      // demon死亡
      this.demon.value.property = 'hot'
      this.updateBlocksProperty(adjacentBlockIds, 'hot')
      this.demon.value.isAlive = false
    } else {
      this.demon.value.property = 'normal'
      this.updateBlocksProperty(adjacentBlockIds, 'normal')
    }
  }

  // 找到指定位置的相邻的砖块 (包括间接相邻)
  getAdjacentBlocks(pos: Position) {
    // 使用了一个辅助函数, 维护一个集合, 防止重复block
    function _getAdjacentBlocks(this: GameState, pos: Position, res: Set<number>) {
      for (let dir of Object.values(DIRECTIONS)) {
        const newPos = {
          x: pos.x + dir.x,
          y: pos.y + dir.y
        }
        let blockId = this.findBlock(newPos)
        if (blockId !== null && !res.has(blockId)) {
          // 将相邻的block id加入集合, 且要避免相同的block
          res.add(blockId)

          const block = this.blocks.value[blockId]
          for (const item of block.items) {
            // 递归计算相邻的砖块
            res = res.union(_getAdjacentBlocks.call(this, item.position, res))
          }
        }
      }

      return res
    }

    return _getAdjacentBlocks.call(this, pos, new Set<number>())
  }

  updateBlocksProperty(blocks: Set<number>, property: TempProperty) {
    blocks.forEach(blockId => {
      const block = this.blocks.value[blockId]
      block.property = property
    })
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
      console.log(newBlockId)
      if (newBlockId !== null && newBlockId !== blockId) {
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
        if (!this.canMove(direction, newBlockId)) return false
      }

    }
    return true
  }

  checkWin() {
    if (this.getTileType(this.destinationPos) === TileType.Block) {
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

