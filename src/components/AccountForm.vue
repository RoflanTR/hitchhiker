<template>
  <div class="info">
    <div v-for="(value, key) in user" :key="key">
      <div v-if="value != ''">
        <h5>{{ User[key] }}</h5>
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserInfo } from '../components/models';
import { User } from '../components/enum';
defineProps<{ user: UserInfo }>();
</script>

<style scoped>
h5 {
  margin: 0 0 5px 0;
  font-size: 22px;
}
p {
  font-size: 18px;
}
.info {
  margin-top: 50px;
}
</style>
