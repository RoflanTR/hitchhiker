<template>
  <div>
    <q-input
      outlined
      v-model="date"
      mask="##.##.####"
      :dense="dense"
      :rules="dateRules"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer" color="primary">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="DD.MM.YYYY" :rules="dateRules">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string; dense: boolean }>();
const date = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

watch(date, (newV) => {
  emit('update:modelValue', newV);
});

const dateRules = [
  (val: string | null) => (val !== null && val !== '') || 'Введите значение',
];
</script>
