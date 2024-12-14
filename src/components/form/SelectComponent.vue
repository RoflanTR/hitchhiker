<template>
  <q-select
    :dense="dense"
    outlined
    v-model="model1"
    :options="options"
    :rules="[
      (val) =>
        (val !== null && val !== '' && val !== 'Выберите') ||
        'Введите значение',
    ]"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { SelectItem } from '../models';

const props = defineProps<{
  options: SelectItem;
  modelValue: string;
  dense: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const model1 = ref(props.modelValue);

watch(model1, (newV) => {
  emit('update:modelValue', newV);
});
</script>
