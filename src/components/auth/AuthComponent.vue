<template>
  <h4>{{ mode === 'auth' ? 'Авторизация' : 'Регистрация' }}</h4>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-if="mode === 'reg'"
      filled
      v-model="name"
      label="Your name *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      :dense="dense"
    />

    <q-input
      v-if="mode === 'reg'"
      filled
      v-model="lastname"
      label="Your lastname *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      :dense="dense"
    />
    <q-input
      filled
      type="tel"
      v-model="phone"
      label="Your phone *"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type your phone',
      ]"
      :dense="dense"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Your password *"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type your password',
      ]"
      :dense="dense"
    />
    <div class="btn__block">
      <q-btn :label="textSelect" type="submit" color="primary" class="btn" />
    </div>
    <p @click="select" class="mode">
      {{ mode === 'auth' ? 'Нет аккаунта?' : 'Есть аккаунт?' }}
    </p>
  </q-form>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { alarm } from '../AlarmScript';
import { useNotify } from '../../../src/utils/Alarm';

const { notify } = useNotify();
const store = useStore();
const router = useRouter();

const name = ref(null);
const lastname = ref(null);
const phone = ref(null);
const password = ref(null);
const dense = ref(true);
const mode = ref('auth');
const textSelect = ref('Авторизация');

function select(): void {
  if (mode.value === 'reg') {
    mode.value = 'auth';
    textSelect.value = 'Войти';
  } else {
    mode.value = 'reg';
    textSelect.value = 'Зарегестрироваться';
  }
}

async function onSubmit() {
  let response = null;
  if (mode.value === 'reg') {
    response = await store.dispatch('user/register', {
      number: phone.value,
      password: password.value,
      name: name.value,
      lastname: lastname.value,
    });

    if (response.success === true) {
      mode.value = 'auth';
      textSelect.value = 'Войти';
      return;
    }
  } else if (mode.value === 'auth') {
    response = await store.dispatch('user/auth', {
      number: phone.value,
      password: password.value,
    });
  }

  if (!response.success) {
    alarm(response, notify);
  } else {
    alarm(response, notify);
    router.push({ path: '/' });
  }
}
</script>

<style scoped>
h4 {
  text-align: center;
}
.mode {
  text-align: center;
}
.btn__block {
  justify-content: center;
  display: flex;
}
.btn {
  padding: 6px 30px;
}
</style>
