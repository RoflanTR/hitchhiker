<template>
  <Loader v-if="loaderView" />
  <div class="switch">
    <div
      v-if="bookingTrips.length > 0"
      class="block"
      :class="[
        selected === 'two' ? 'selected' : '',
        bookingTrips.length <= 0 ? 'fullsize' : '',
      ]"
      @click="booking"
    >
      <h5>Забронированные</h5>
    </div>
    <div
      class="block"
      v-if="test.length > 0"
      :class="[
        selected === 'two' ? 'selected' : '',
        bookingTrips.length <= 0 ? 'fullsize' : '',
      ]"
      @click="mainTrips"
    >
      <h5>Предложенные</h5>
    </div>
  </div>

  <List
    v-if="!loaderView"
    class="list"
    :list="selected === 'one' ? bookingTrips : test"
    :page="page"
  ></List>
</template>

<script setup lang="ts">
import List from '../components/TripsList.vue';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Loader from '../components/shared/LoaderComponent.vue';

const bookingTrips = ref([]);
const test = ref([]);
const store = useStore();
const viewList = ref(false);
const selected = ref('one');
const page = ref('booking');
const loaderView = ref(false);
onMounted(async () => {
  loaderView.value = true;

  const resBook = await store.dispatch(
    'trips/getTripsBooking',
    localStorage.getItem('authToken')
  );
  if (resBook.data.length < 1) {
    selected.value = '2';
  }
  const res = await store.dispatch(
    'trips/getTripsProposed',
    localStorage.getItem('authToken')
  );
  bookingTrips.value = resBook.data;
  test.value = res.data;
  loaderView.value = false;
  viewList.value = true;
});

watch(selected, (newV) => {
  if (newV === 'one') {
    page.value = 'booking';
  } else {
    page.value = 'proposed';
  }
});

async function booking() {
  selected.value = 'one';
  loaderView.value = true;
  const res = await store.dispatch(
    'trips/getTripsBooking',
    localStorage.getItem('authToken')
  );

  loaderView.value = false;
  bookingTrips.value = res.data;
}
async function mainTrips() {
  selected.value = 'two';
  loaderView.value = true;
  const res = await store.dispatch(
    'trips/getTripsProposed',
    localStorage.getItem('authToken')
  );
  loaderView.value = false;
  test.value = res.data;
}
</script>

<style scoped>
.switch {
  display: flex;
  justify-content: space-between;
}
.block {
  width: 50%;
  text-align: center;
  padding: 20px 40px;
  background-color: #f3f3f3;
  border-radius: 0 0 10px 10px;
  -webkit-box-shadow: 15px 11px 39px -22px rgba(34, 60, 80, 0.2) inset;
  -moz-box-shadow: 15px 11px 39px -22px rgba(34, 60, 80, 0.2) inset;
  box-shadow: 15px 11px 39px -22px rgba(34, 60, 80, 0.2) inset;
  transition: box-shadow 0.3s ease;
}
.block:hover {
  -webkit-box-shadow: 15px 11px 46px -24px rgba(34, 60, 80, 0.35) inset;
  -moz-box-shadow: 15px 11px 46px -24px rgba(34, 60, 80, 0.35) inset;
  box-shadow: 15px 11px 46px -24px rgba(34, 60, 80, 0.35) inset;
  color: rgb(58, 101, 156);
}
h5 {
  margin: 0;
  font-size: 18px;
}
.selected {
  color: #3a659c;
  background-color: #ebebeb;
  border-bottom: 1px solid #3a659c;
}
.fullsize {
  width: 100%;
}
</style>
