<template>
  <div class="block" v-if="user">
    <div class="header__block">
      <div class="photo">
        <img v-if="user.img" :src="'/src/assets/img/' + user.img" />
        <img v-else src="../assets/img/User.svg" alt="ticket image" />
      </div>
      <div class="btn__block">
        <Button color="red" text="Delete photo"></Button>
        <Button color="green" text="Select Photo"></Button>
      </div>
      <q-icon
        :color="color"
        class="setting"
        name="manage_accounts"
        size="lg"
        @mouseenter="color = 'blue'"
        @mouseleave="color = 'black'"
        @click="isEdit = !isEdit"
      ></q-icon>
    </div>
    <AccountForm v-if="!isEdit && user" :user="user" />
    <AccountFormEdit @edit="edit" v-else :user="user" />
  </div>
</template>

<script setup lang="ts">
import AccountForm from '../components/AccountForm.vue';
import AccountFormEdit from '../components/AccountFormEdit.vue';
import Button from '../components/shared/BtnComponents.vue';

import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const color = ref('');
const isEdit = ref(false);

const user = ref();
onMounted(async () => {
  const id = localStorage.getItem('authToken');
  user.value = await store.dispatch('user/getUserById', id);

  delete user.value.img;
});
async function edit(edit: boolean) {
  isEdit.value = edit;
  const id = localStorage.getItem('authToken');
  user.value = await store.dispatch('user/getUserById', id);
  delete user.value.img;
}
</script>

<style scoped>
.block {
  background-color: rgb(247, 247, 247);
  width: 90%;
  height: 30%;
  margin: 20px auto 0 auto;
  border-radius: 20px;
  padding: 40px 60px;
}
.header__block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.photo {
  width: 20%;
}
.btn__block {
  width: 70%;
  display: flex;
  gap: 30px;
}
.body__block {
  display: grid;
  gap: 10px;
}
.setting {
  width: 3%;
  justify-content: end;
}
img {
  border-radius: 50%;
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: center;
}
</style>
