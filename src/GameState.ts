import {TileType} from "~/types/tile";
import {Direction, Position} from "~/types/demon";

export class GameState {
  grid: Ref<TileType[][]>;
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
      case 'w': this.moveDemon(Direction.UP); break;
      case 's': this.moveDemon(Direction.DOWN); break;
      case 'a': this.moveDemon(Direction.LEFT); break;
      case 'd': this.moveDemon(Direction.RIGHT); break;
    }

    console.log(this.demonPos.value)
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

}

