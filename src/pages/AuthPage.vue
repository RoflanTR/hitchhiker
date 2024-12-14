<template>
  <div class="content">
    <div class="banner">
      <img
        src="../assets/img/connor-mcsheffrey-MIspM6HIit8-unsplash.jpg"
        alt="hitchhiker"
      />
    </div>
    <div class="block">
      <div class="form">
        <Auth />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Auth from '../components/auth/AuthComponent.vue';
</script>

<style scoped>
.q-card__actions--horiz > .q-btn-item + .q-btn-item {
  margin: 0;
}
.switch__active {
  border-bottom: 1px solid #183f72;
  background-color: #183f72;
  color: aliceblue;
}

.content {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  overflow: hidden;
}

.block {
  width: 40%;
  overflow: hidden;
  height: auto;
  margin: auto;
}

.banner {
  width: 55%;
  height: 100vh;
  border-radius: 0 10px 10px 0;
}

.banner img {
  width: 100%;
  height: 100%;
  border-radius: 0 20px 20px 0;
  object-fit: cover;
}
.form {
  width: 80%;
  margin: 0 auto;
}
</style>
