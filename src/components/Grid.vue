<script setup lang="ts">
import {TileType} from "~/types/tile";
import {Position} from "~/types/demon";

const { grid, demonPos, destinationPos } = defineProps<{
  grid: TileType[][]
  demonPos: Position
  destinationPos: Position
}>()


</script>

<template>
  <div flex flex-col justify-center items-center>
    <div v-for="(row, i) in grid" flex flex-row>
      <div v-for="(tile, j) in row">
        <Tile
          :type="tile"
          :isDemon="demonPos.x === i && demonPos.y === j"
          :isDestination="destinationPos.x === i && destinationPos.y === j"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
