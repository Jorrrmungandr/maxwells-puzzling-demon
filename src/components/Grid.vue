<script setup lang="ts">
import type {Demon, Position, TileType} from "~/types/game";

const { grid, demon, destinationPos } = defineProps<{
  grid: TileType[][]
  demon: Demon
  destinationPos: Position
}>()


</script>

<template>
  <div flex flex-col justify-center items-center>
    <div v-for="(row, i) in grid" flex flex-row>
      <div v-for="(tile, j) in row">
        <Tile
          :type="tile"
          :isDestination="destinationPos.x === i && destinationPos.y === j"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
