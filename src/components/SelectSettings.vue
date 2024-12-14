<template>
  <div class="content">
    <q-form @submit="actions" :class="{ field: true }">
      <div class="item__block" v-for="(item, idx) in props.options" :key="idx">
        <h5>{{ item.name }}</h5>
        <component
          :is="getComponent(item.type)"
          v-model="formValues[item.name]"
          :options="item.body"
          :dense="true"
          :type="
            item.name === 'Цена'
              ? 'Price'
              : item.name === 'Количество'
              ? 'Count'
              : ''
          "
        />
      </div>

      <div class="item__block item__block_btn">
        <Buttom
          class="btn"
          :text="page === 'createTrip' ? 'Создать' : 'Поиск'"
          color="primary"
          type="submit"
        ></Buttom>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import Select from '../components/form/SelectComponent.vue';
import Calendar from '../components/form/DataPicker.vue';
import Input from '../components/form/InputSettings.vue';
import Buttom from '../components/shared/BtnComponents.vue';
import Time from '../components/form/TimePicker.vue';
import { ref, onBeforeMount } from 'vue';

// Определяем объект для значений всех полей
const formValues = ref<{ [key: string]: string }>({});

const props = defineProps<{
  options: Array<{ type: string; name: string; body?: string[] }>;
  page: string;
}>();
const emit = defineEmits(['actions']);

// Функция для получения компонента по типу
function getComponent(type: string) {
  const components = {
    Select,
    Calendar,
    Input,
    Time,
  };

  //@ts-expect-error ya ebal rot togo ts'a

  return components[type] || null;
}
onBeforeMount(() => {
  const dateNow = new Date().toISOString().split('T')[0].split('-');
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  const time = new Date(Date.now() - tzoffset)
    .toISOString()
    .split('T')[1]
    .split('.')[0]
    .split(':');

  props.options.forEach((option) => {
    if (option.type === 'Select') {
      formValues.value[option.name] = 'Выберите';
    } else if (option.type === 'Input') {
      formValues.value[option.name] = '';
    } else if (option.type === 'Time') {
      formValues.value[option.name] = `${time[0]}:${time[1]}`;
    } else if (option.type === 'Calendar') {
      formValues.value[
        option.name
      ] = `${dateNow[2]}.${dateNow[1]}.${dateNow[0]}`;
    }
  });
});

function actions() {
  emit('actions', formValues);
}
</script>

<style scoped>
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 93%;
  transform: translate(-50%, -50%);
}

.field {
  display: flex;
  gap: 3.5%;
  flex-wrap: wrap;
}

.nowrap {
  flex-wrap: nowrap;
  display: flex;
  align-items: end;
}

.item__block {
  width: 31%;
  margin-bottom: 2%;
}

.item__block_btn {
  width: 100%;
  align-content: end;
  justify-content: center;
  height: 40px;
  border: none;
  margin: 0 auto;
  display: flex;
  margin-top: 20px;
  transition: width 0.8s ease;
}
.moveUp .item__block {
  width: 29%;
}
.moveUp .item__block_btn {
  width: 8%;
  margin: 0;
  align-items: end;
  margin: auto 0;
}
.moveUp .field {
  gap: 1.5%;
}

.item__block_btn button {
  height: 40px;
  border: none;
}

h5 {
  margin: 0;
  font-size: 1.5rem;
  transition: font-size 0.8s ease;
  color: #1c3e5f;
}

.moveUp h5 {
  font-size: 1rem;
}
.btn {
  font-size: 12px;
}
</style>
