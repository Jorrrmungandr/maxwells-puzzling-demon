import {Block, DIRECTIONS, Position, TileType} from "~/types/demon";

export class GameState {
  grid: Ref<TileType[][]>;
  blocks: Ref<Block[]>;
  demonPos: Ref<Position>;
  destinationPos: Position;

  constructor(grid: TileType[][], demonPos: Position, destinationPos: Position) {
    this.grid = ref(grid);
    this.demonPos = ref(demonPos);
    this.destinationPos = destinationPos

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

    if (this.grid.value[newPos.x]?.[newPos.y] === TileType.Empty) {
      this.demonPos.value = newPos
    } else if (this.grid.value[newPos.x]?.[newPos.y] === TileType.Block) {
      this.pushBlock(newPos, direction)
    }

  }

  pushBlock(pos: Position, direction: Position) {
    const newPos = {
      x: pos.x + direction.x,
      y: pos.y + direction.y
    }

    if (this.grid.value[newPos.x]?.[newPos.y] === TileType.Empty) {
      this.grid.value[pos.x][pos.y] = TileType.Empty
      this.grid.value[newPos.x][newPos.y] = TileType.Block
      this.moveDemon(direction)
    }
  }

  checkWin() {
    if (this.grid.value[this.destinationPos.x]?.[this.destinationPos.y] === TileType.Block) {
      setTimeout(() => {
        alert('You win!')
      }, 100)
    }
  }

}

