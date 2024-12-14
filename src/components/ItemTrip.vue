<template>
  <div class="item__list" v-for="(item, index) in list" :key="index">
    <div
      class="checking"
      :class="item.count >= 1 ? 'checking-success' : 'checking-error'"
    ></div>

    <div class="date">
      <p class="title">{{ item.date }}</p>
      <p class="time title">{{ item.time }}</p>
    </div>

    <div class="driver" @click="profile(item.driver.id)">
      <img v-if="item.driver.img" :src="'/src/assets/img/' + item.driver.img" />
      <img v-else src="../assets/img/User.svg" alt="ticket image" />
      <div class="info__driver">
        <p>{{ item.driver.lastname }}</p>
        <p>{{ item.driver.name }}</p>
      </div>
    </div>

    <div class="info">
      <div>
        <p class="title title__info">Куда:</p>
        <p class="item">{{ item.arrival_place }}</p>
      </div>
      <hr />
      <div>
        <p class="title title__info">Откуда:</p>
        <p class="item">{{ item.departure_place }}</p>
      </div>
    </div>

    <div class="price">
      <p class="title">Цена</p>
      <p>{{ item.price }}</p>
    </div>

    <div class="places">
      <p class="title">
        {{ booking(item.driver.id) ? 'Кол-во мест' : 'Кол-во заказанных мест' }}
      </p>
      <p v-if="booking(item.driver.id) || item.count < 1">{{ item.count }}</p>
      <p>{{ item.count }}</p>
    </div>

    <div v-if="page === 'search'" class="booking">
      <Button
        color="primary"
        :disabled="booking(item.driver.id) || item.count < 1"
        :text="booking(item.driver.id) ? 'Ваша запись' : 'Бронь'"
        @click="buy(item.id)"
      ></Button>
    </div>

    <div v-else-if="['booking', 'proposed'].includes(page)" class="settings">
      <q-icon
        name="delete"
        color="negative"
        @click="deleteTrip(item.orderId)"
        size="sm"
      ></q-icon>
    </div>
  </div>

  <Modal />
  <DialogSuccess
    @action="handleAction"
    v-model="isOpenDialogSuccess"
    :id="idTrip"
    :messageDialog="messageDialog"
  />
</template>

<script setup lang="ts">
import Button from '../components/shared/BtnComponents.vue';
import Modal from '../components/ModalProfile.vue';
import DialogSuccess from '../components/DialogSuccessful.vue';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useNotify } from '../../src/utils/Alarm';
import { ListInterface } from './models';
import { alarm } from '../components/AlarmScript';
import Input from '../components/form/InputSettings.vue';

const count = ref();
const store = useStore();
const router = useRouter();
const isOpenDialogSuccess = ref(false);
const messageDialog = ref<string>('');
const idTrip = ref<string>('');

const MESSAGE_TEXTS = {
  bookingCancel: 'Отменить бронь?',
  tripDelete: 'Удалить предложение?',
  tripBooking: 'Забронировать поездку?',
};

const props = defineProps<{
  list: ListInterface[];
  page: string;
}>();

function profile(id: string) {
  if (id != localStorage.getItem('authToken')) {
    const targetPath = props.page === 'search' ? '/trips' : '/yourTrips';
    router.push({ path: targetPath, query: { id } });
  } else {
    router.push({
      path: 'account',
    });
  }
}

const booking = (id: string) => id === localStorage.getItem('authToken');

const { notify } = useNotify();

function buy(id: string) {
  messageDialog.value = MESSAGE_TEXTS.tripBooking;
  isOpenDialogSuccess.value = true;
  idTrip.value = id;
}

async function handleAction({ id, message }: { id: string; message: string }) {
  let res;

  switch (message) {
    case MESSAGE_TEXTS.bookingCancel:
      res = await store.dispatch('trips/deleteBookingClient', id);
      break;
    case MESSAGE_TEXTS.tripDelete:
      console.log('delete main Trip');
      return;
    case MESSAGE_TEXTS.tripBooking:
      res = await store.dispatch('trips/addTripForOrder', {
        idTrip: id,
        idClient: localStorage.getItem('authToken'),
      });
      if (res?.success) {
        router.push({ path: '/' });
      }
      break;
  }

  if (res) alarm(res, notify);
}

function deleteTrip(id: string) {
  messageDialog.value =
    {
      booking: MESSAGE_TEXTS.bookingCancel,
      proposed: MESSAGE_TEXTS.tripDelete,
      search: MESSAGE_TEXTS.tripBooking,
    }[props.page] || MESSAGE_TEXTS.tripBooking;

  isOpenDialogSuccess.value = true;
  idTrip.value = id;
}
</script>

<style scoped>
.checking {
  position: absolute;
  width: 11px !important;
  height: 100%;
  border-radius: 10px 0 0 10px;
  top: 0;
}
.checking-error {
  background-color: #e36a6a;
}
.checking-success {
  background-color: #2fa32f;
}
.item__list {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 10px 0;
  border-radius: 0 10px 10px 0;
  box-shadow: 7px 4px 15px -10px;
}
.item__list div {
  width: 15%;
  text-align: center;
  display: grid;
  align-items: center;
  align-content: space-evenly;
}
.date {
  text-align: center;
  padding-left: 11px;
  width: 10% !important;
}
.driver {
  width: 20% !important;
  display: flex !important;
  justify-content: space-between;
}
.info__driver {
  width: 60% !important;
}
.info__driver :hover {
  color: #336b99;
  cursor: pointer;
}
img {
  display: flex;
  width: 70px;
}
.info > div {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.title {
  font-weight: 600;
}
p {
  margin: 0;
}
.title__info {
  margin-right: 10px;
  width: 40%;
}
.booking {
  align-items: center;
  justify-content: center;
  display: flex;
}
button {
  font-size: 13px !important;
}
.item {
  width: 45%;
}
hr {
  border-color: #ffffff80;
  width: 100%;
}
.settings {
  display: flex !important;
  justify-content: center;
  gap: 20px;
}
</style>
