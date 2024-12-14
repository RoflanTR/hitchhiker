<template>
  <div class="">
    <q-dialog v-model="dialog" backdrop-filter="brightness(60%)">
      <q-card>
        <q-card-actions align="right">
          <q-btn flat icon="close" v-close-popup @click="closeDialog" />
        </q-card-actions>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ messageDialog }}
        </q-card-section>

        <div class="block_btn">
          <Button color="positive" text="Да" @click="confirmBooking" />
          <Button color="negative" text="Нет" @click="closeDialog" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from '../components/shared/BtnComponents.vue';

const props = defineProps<{
  modelValue: boolean;
  id: string;
  messageDialog: string;
}>();

const emit = defineEmits(['update:modelValue', 'action']);

const dialog = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newV) => {
    dialog.value = newV;
  }
);

watch(dialog, (newV) => {
  emit('update:modelValue', newV);
});

function closeDialog() {
  dialog.value = false;
}

function confirmBooking() {
  emit('action', { id: props.id, message: props.messageDialog });
}
</script>

<style scoped>
.q-card {
  width: 50%;
  padding: 10px 40px 30px 40px;
  border-radius: 14px;
}
.q-card__section--vert {
  padding: 0;
  width: 100%;
  text-align: center;
}
.text-h6 {
  justify-content: center;
}
.block_btn {
  margin-top: 50px;
  display: flex;
  justify-content: space-evenly;
}
</style>
