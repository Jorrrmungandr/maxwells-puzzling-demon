<script setup lang="ts" generic="T extends any, O extends any">
import {GameState} from "~/GameState";
import {TileType} from "~/types/demon";

defineOptions({
  name: 'IndexPage',
})

const grid = [
  [0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0],
  [1,1,1,1,1,1,1],
  [1,1,1,1,1,2,1],
  [1,1,1,1,1,1,1],
] as TileType[][]

const state = new GameState(
  grid,
  {x: 3, y: 1},
  {x: 0, y: 3}
)

</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl />

    <div py-4 />

    <div>
      <Grid
        :grid="state.grid.value"
        :demonPos="state.demonPos.value"
        :destinationPos="state.destinationPos"
      />

    </div>

  </div>
</template>
