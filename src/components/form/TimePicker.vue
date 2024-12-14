<template>
  <div>
    <div>
      <q-input outlined v-model="time" mask="time" :rules="['time']">
        <template v-slot:append>
          <q-icon color="primary" name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="time" format24h />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string; dense: boolean }>();
const time = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

watch(time, (newV) => {
  emit('update:modelValue', newV);
});
</script>

<style scoped>
::v-deep .q-field__control {
  height: 40px !important;
}
::v-deep .items-center {
  height: 40px !important;
}
</style>
