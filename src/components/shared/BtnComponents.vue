<template>
  <q-btn class="btn" :color="color" :label="text" @click="action" />
</template>

<script setup lang="ts">
defineProps<{ color: string; text: string }>();
const emit = defineEmits(['action']);

function action() {
  emit('action');
}
</script>
<style scoped>
.btn {
  width: 150px;

  border-radius: 7px;
  font-size: 15px;
  font-weight: 600;
}
</style>
