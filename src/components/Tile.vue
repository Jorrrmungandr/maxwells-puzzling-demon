<script setup lang="ts">
import {TileType} from "~/types/game";

const { type } = defineProps<{
  type: TileType
  isDestination: boolean
}>()

const tileStyle = computed(() => {
  return {
    'bg-gray-300': type === TileType.Wall,
    'bg-gray-50': type === TileType.Empty,
    // 'bg-gray-100 border-4 border-gray-400 z-1': type === TileType.Block,
  }
})

</script>

<template>
  <div relative flex justify-center items-center>
    <div
      w-15
      h-15
      :class="tileStyle"
    />

    <!-- point that represents a tile -->
    <div
      v-if="type === TileType.Empty"
      absolute
      w-2
      h-2
      rounded-full
      bg-gray-200
    />

    <!-- draw a hexagon to represent destination -->
    <div
      v-if="isDestination"
      absolute
      h-10
      w-12
      bg-blue
      style="clip-path: polygon(50% -50%,100% 50%,50% 150%,0 50%);"
    />

  </div>


</template>

<style scoped>

</style>
