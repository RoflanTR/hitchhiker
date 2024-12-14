<template>
  <q-form @submit.prevent="editInfo" class="body__block">
    <div v-for="(value, key) in userData" :key="key">
      <Input type="text" :label="User[key]" v-model="userData[key]" />
    </div>

    <Button color="green" text="Save" type="submit"></Button>
  </q-form>
</template>

<script lang="ts" setup>
import Input from '../components/form/InputSettings.vue';
import { UserInfo } from '../components/models';
import Button from '../components/shared/BtnComponents.vue';
import { reactive } from 'vue';
import { User } from '../components/enum';
import { useStore } from 'vuex';
import { useNotify } from '../../src/utils/Alarm';
const { notify } = useNotify();

const store = useStore();

const props = defineProps<{ user: UserInfo }>();
const emit = defineEmits(['edit']);
const userData = reactive({ ...props.user });

async function editInfo() {
  try {
    const res = await store.dispatch('user/editUserData', userData);
    if (res.success) {
      emit('edit', false);
    } else {
      notify({
        message: res.message,
        color: 'negative',
        icon: 'cross',
        textColor: 'white',
      });
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
}
</script>

<style scoped>
.body__block {
  margin-top: 50px;
}
</style>
