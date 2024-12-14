<template>
  <div class="header">
    <router-link to="/"><div class="logo">LOGO</div></router-link>

    <div class="menu">
      <router-link to="/">Главная</router-link>
      <router-link to="trips">Найти</router-link>
      <router-link to="/create">Предложить</router-link>
      <router-link to="/yourTrips">Мои поездки</router-link>
    </div>
    <div class="additional">
      <router-link v-if="isAuthenticated" to="/account">
        <q-icon size="sm" name="person">
          <q-tooltip class="text-body3">Ваш аккаунт</q-tooltip>
        </q-icon>
      </router-link>
      <router-link
        class="logout"
        v-if="isAuthenticated"
        to="/auth"
        @click="logout"
      >
        <q-icon size="sm" name="logout">
          <q-tooltip class="text-body3">Выйти</q-tooltip>
        </q-icon>
      </router-link>
      <router-link v-else to="/auth">
        <q-icon size="sm" name="login">
          <q-tooltip class="text-body3">Войти</q-tooltip>
        </q-icon>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const isAuthenticated = ref(!!localStorage.getItem('authToken'));

watch(
  () => localStorage.getItem('authToken'),
  (newValue) => {
    isAuthenticated.value = !!newValue;
  }
);

const logout = () => {
  localStorage.removeItem('authToken');
  isAuthenticated.value = false;
};
</script>

<style scoped>
.header {
  display: flex;
  padding: 0 45px;
  background-color: #f2fdff4d;
  border-radius: 0 0 13px 13px;
}
.logo {
  margin: auto 0;
  font-size: 32px;
  width: 10%;
}
.menu {
  display: flex;
  margin: auto 0;
  width: 80%;
  justify-content: center;
  gap: 20px;
}
.additional {
  display: flex;
  width: 10%;
  gap: 5px;
  margin: auto 0;
}
</style>
