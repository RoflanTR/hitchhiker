<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialog" backdrop-filter="brightness(60%)">
      <q-card class="card">
        <q-card-actions align="right">
          <q-btn flat icon="close" v-close-popup />
        </q-card-actions>
        <div class="info_driver">
          <div class="photo">
            <img v-if="user.img" :src="'/src/assets/img/' + user.img" />
            <img v-else src="../assets/img/User.svg" alt="ticket image" />
          </div>
          <AccountForm v-if="user" :user="user" />
        </div>
        <hr />
        <Rewiev
          v-model:textReview="textReview"
          @sendReview="sendReview"
          :review="review"
          @deleteReview="deleteReview"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { alarm } from '../components/AlarmScript';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AccountForm from '../components/AccountForm.vue';
import Rewiev from '../components/RewievCopmonent.vue';
const store = useStore();
const dialog = ref(false);
const route = useRoute();
const router = useRouter();
const user = ref();
const textReview = ref('');
const review = ref();

import { useNotify } from '../../src/utils/Alarm';
const { notify } = useNotify();

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      review.value = await store.dispatch(
        'review/getReviewById',
        route.query.id
      );

      user.value = await store.dispatch('user/getUserById', route.query.id);
      dialog.value = true;
    }
  }
);

watch(dialog, (newVal) => {
  if (!newVal && route.query.id) {
    router.push({ path: route.path, query: { ...route.query, id: undefined } });
  }
});

async function sendReview(stars: number) {
  const response = await store.dispatch('review/addReview', {
    text: textReview.value,
    idDriver: route.query.id,
    stars: stars,
  });
  alarm(response, notify);
  if (response.success) {
    review.value = await store.dispatch('review/getReviewById', route.query.id);
  }
}

async function deleteReview(id: string) {
  const res = await store.dispatch('review/deleteReview', id);
  alarm(res, notify);
  if (res.success) {
    review.value = await store.dispatch('review/getReviewById', route.query.id);
  }
}
</script>

<style scoped>
.q-dialog__inner--minimized > div {
  max-width: 70%;
  width: 60%;
}
.card {
  padding: 20px 40px;
}
.info_driver {
  margin-top: auto 0 !important;
  display: flex;
  justify-content: space-between;
}
.info {
  width: 50%;
  margin: 0;
}
.photo {
  width: 30%;
  justify-content: center;
  display: flex;
  align-self: baseline;
}
.photo img {
  width: 100px;
}
hr {
  margin-top: 40px;
  height: 1px;
  border: none;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgb(41, 104, 167, 1),
    rgba(0, 0, 0, 0)
  );
  filter: blur(4px);
}
</style>
