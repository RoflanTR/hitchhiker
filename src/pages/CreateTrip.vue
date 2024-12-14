<template>
  <div class="block">
    <SelectSetting page="createTrip" :options="options" @actions="create" />
  </div>
</template>

<script setup lang="ts">
/*
Добавить пункты в бд
Добавить возможность брони нескольких мест

регистрация валидация
Лого

нельзя добавлять на время меньше чем есть сейчас
Проверка по времени должна учитывать дату
 */
import SelectSetting from '../components/SelectSettings.vue';
import { ref } from 'vue';
import { Options } from '../components/models';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { alarm } from '../components/AlarmScript';
const router = useRouter();

const store = useStore();

const options = ref<Options[]>([
  {
    name: 'Место отправки',
    type: 'Select',
    body: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  },
  {
    name: 'Место прибытия',
    type: 'Select',
    body: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  },
  {
    name: 'Цена',
    type: 'Input',
  },
  {
    name: 'Дата',
    type: 'Calendar',
  },
  {
    name: 'Время',
    type: 'Time',
  },

  {
    name: 'Количество',
    type: 'Input',
  },
]);

/*Уведомление */

import { useNotify } from '../../src/utils/Alarm';
const { notify } = useNotify();

async function create(formValues: Options) {
  const response = await store.dispatch('trips/addTrip', formValues);
  if (response.success) {
    alarm(response, notify);
    router.push({ path: '/' });
  } else {
    alarm(response, notify);
  }
}
</script>

<style scoped>
.block {
  background-color: rgb(247, 247, 247);
  width: 90%;
  height: 40%;
  margin: auto 0;
  border-radius: 20px;
  padding: 40px 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.8s ease;
}
</style>
