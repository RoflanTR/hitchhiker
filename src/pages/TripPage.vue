<template>
  <div :class="{ block: true, moveUp: movedUp }">
    <SelectSetting :options="options" page="isTripPage" @actions="search" />
  </div>
  <transition name="slide-up">
    <List v-if="viewList" class="list" :list="searchTrips" page="search"></List>
  </transition>
</template>

<script setup lang="ts">
import SelectSetting from '../components/SelectSettings.vue';
import List from '../components/TripsList.vue';
import { ref } from 'vue';
import { Options } from '../components/models';
import { useStore } from 'vuex';
import { alarm } from '../components/AlarmScript';
import { useNotify } from '../../src/utils/Alarm';
const { notify } = useNotify();
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
    name: 'Дата',
    type: 'Calendar',
    body: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
  },
]);

const viewList = ref(false);
const searchTrips = ref();
const store = useStore();
async function search(formValues: Options) {
  const res = await store.dispatch('trips/getTrips', formValues);
  if (res.success) {
    movedUp.value = true;
    viewList.value = true;
    searchTrips.value = res.data;
  } else {
    alarm(res, notify);
  }
}

/*Анимация */
const movedUp = ref(false);
</script>

<style scoped>
.block {
  background-color: rgb(247, 247, 247);
  width: 90%;
  height: 30%;
  margin: auto 0;
  border-radius: 20px;
  padding: 40px 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.8s ease;
}

.moveUp {
  top: 6.9%;
  height: 15%;
  transform: translate(-50%, 0);
  padding: 40px;
}

.list {
  width: 90%;
  position: absolute;
  left: 50%;
  top: 23%;
  transform: translate(-50%, 0);
}

/* Определение анимации для появления списка */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 10%); /* Стартовая позиция: ниже экрана */
  top: 100%;
  opacity: 0;
}

.slide-up-enter-to {
  transform: translate(-50%, 0); /* Конечная позиция: на середине экрана */
  top: 23%;
  opacity: 1;
}

.slide-up-leave-from {
  transform: translate(-50%, -50%); /* Начало ухода: из видимой области */

  opacity: 1;
}

.slide-up-leave-to {
  transform: translate(-50%, 10%); /* Уход вниз, за пределы экрана */
  top: 100%;
  opacity: 0;
}
</style>
