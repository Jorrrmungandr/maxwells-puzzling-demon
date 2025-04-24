<script setup lang="ts">
import {Demon} from "~/types/game";

const {demon, startX} = defineProps<{
  demon: Demon
  startX: number
}>()

</script>

<template>
  <div
    absolute top-0
    h-12
    w-12
    z-10
    rounded-full
    flex justify-center items-center
    text-2xl
    :class="
      demon.property === 'normal' ? 'bg-gray-300'
      : demon.property === 'hot' ? 'bg-red-200'
      : demon.property === 'cold' ? 'bg-sky-200'
      : ''
    "
    :style="{
      left: `${startX}px`,
      transform: `translate(${demon.pos.y * 60 + 6}px, ${demon.pos.x * 60 + 6}px)`,
    }"
  >
    <template v-if="!demon.isAlive">
      ❌
    </template>
  </div>

</template>

<style scoped>

</style>
