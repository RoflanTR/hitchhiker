<template>
  <q-layout view="lHh Lpr lFf">
    <div class="header"><Menu /></div>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import Menu from '../components/menu/HeaderComponent.vue';
</script>

<style scoped>
.menu {
  margin-top: 50px;
}
.container {
  padding: 40px 45px;
}
.header {
  height: 60px;
}
</style>
