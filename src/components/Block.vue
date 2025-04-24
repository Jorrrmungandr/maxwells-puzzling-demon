<script setup lang="ts">
import {IBlockItem, IBlock} from "~/types/game";

const {block} = defineProps<{
  block: IBlock
  startX: number
}>()

function calcBlockItemStyle(item: IBlockItem) {
  let res = ''
  res += item.edges.includes('UP') ? '4px ' : '0 '
  res += item.edges.includes('RIGHT') ? '4px ' : '0 '
  res += item.edges.includes('DOWN') ? '4px ' : '0 '
  res += item.edges.includes('LEFT') ? '4px ' : '0 '
  return res
}

</script>

<template>
  <div
    v-for="item in block.items"
    w-15 h-15
    absolute top-0
    bg-gray-100 border-gray-400
    :class="
      block.property === 'normal' ? 'bg-gray-100 border-gray-400'
      : block.property === 'hot' ? 'bg-red-200 border-red-300'
      : block.property === 'cold' ? 'bg-sky-200 border-sky-300'
      : ''
    "
    :style="{
      left: `${startX}px`,
      transform: `translate(${item.position.y * 60}px, ${item.position.x * 60}px)`,
      borderWidth: calcBlockItemStyle(item)
    }"
  />
</template>

<style scoped>

</style>
