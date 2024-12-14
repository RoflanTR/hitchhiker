<template>
  <div class="list">
    <Trip v-if="list.length > 0" :list="list" :page="page" />
    <div class="not" v-else>
      <h5>Нет поездок</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
import Trip from '../components/ItemTrip.vue';

import { ListInterface } from './models';

defineProps<{
  list: ListInterface[];
  page: string;
}>();
</script>

<style scoped>
.list {
  background-color: rgb(247, 247, 247);
  padding: 40px;
  border-radius: 20px;
  display: grid;
  row-gap: 20px;
}
.not {
  text-align: center;
}
.not h5 {
  font-weight: 600;
}
</style>
