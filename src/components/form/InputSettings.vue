<template>
  <div v-if="type == 'Price'">
    <q-input
      outlined
      v-model="model"
      v-bind="$attrs"
      :rules="[
        (val) => (val !== null && val !== '') || 'Введите значение',
        (val) => /^\d+$/.test(val) || 'Только цифры',
      ]"
    />
  </div>
  <div v-if="type == 'Count'">
    <q-input
      outlined
      v-model="model"
      v-bind="$attrs"
      :rules="[
        (val) => (val !== null && val !== '') || 'Введите значение',
        (val) => /^\d+$/.test(val) || 'Только цифры',
        (val) => (val > 0 && val < 9) || 'Максимальное значение 8',
      ]"
    />
  </div>

  <div v-if="type == 'text'">
    <p class="label">{{ label }}</p>
    <q-input
      outlined
      v-model="model"
      :rules="[
        (val) => (val !== null && val !== '') || 'Введите значение',
        (val) =>
          (val.length > 0 && val.length < 20) || 'Максимальное значение 8',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  type: string;
  modelValue: string;
  label?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const model = ref(props.modelValue);

watch(model, (newV) => {
  emit('update:modelValue', newV);
});
</script>

<style scoped>
.label {
  margin: 0 0 10px 0;
}
::v-deep .q-field__control {
  height: 40px !important;
}
::v-deep .items-center {
  height: 40px !important;
}
</style>
