<script setup lang="ts" generic="T extends any, O extends any">
import {GameState} from "~/composables/GameState";
import {TileType} from "~/types/game";
import {onMounted, useTemplateRef} from "vue";
import Block from "~/components/Block.vue";
import Demon from "~/components/Demon.vue";
import {grid, blocks, demonPos, destinationPos} from "~/maps/map1-10"

defineOptions({
  name: 'IndexPage',
})

const state = new GameState(
  grid,
  blocks,
  demonPos,
  destinationPos,
)

const container = useTemplateRef('container')

onMounted(() => {
  gridWidth.value = container.value?.getBoundingClientRect()?.width ?? 0
})

const gridWidth = ref(0)
const start = computed(() => {
  return (gridWidth.value - grid[0].length * 15 * 4) / 2
})

</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl />

    <div py-4 />

    <div ref="container" relative>
      <Grid
        :grid="state.grid.value"
        :blocks="state.blocks.value"
        :demon="state.demon.value"
        :destinationPos="state.destinationPos"
      />

      <Block
        v-for="block in state.blocks.value"
        :block="block"
        :startX="start"
      />

      <Demon
        :demon="state.demon.value"
        :startX="start"
      />

    </div>

  </div>
</template>
