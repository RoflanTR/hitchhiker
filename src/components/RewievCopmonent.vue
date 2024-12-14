<template>
  <div class="reviews__block">
    <h5>Отзывы</h5>

    <!-- Новое поле для отзыва -->
    <div class="new__review" v-if="localIsReview">
      <q-input
        v-model="localTextReview"
        filled
        autogrow
        placeholder="Оставьте ваш отзыв"
      />
      <q-rating v-model="ratingModel" size="2em" :max="5" color="yellow" />

      <q-icon name="send" size="sm" color="primary" @click="action"></q-icon>
    </div>
    <div v-else>
      <small>Вы уже оставляли отзыв данному пользователю</small>
    </div>

    <!-- Список отзывов -->
    <div v-if="review.length > 0" class="reviews">
      <div
        class="review"
        v-for="item in review"
        :key="item.id"
        :class="item.idClient === id ? 'your_review' : ''"
      >
        <div class="photo">
          <img
            v-if="item.author.img"
            :src="'/src/assets/img/' + item.author.img"
          />
          <img v-else src="../assets/img/User.svg" alt="ticket image" />
        </div>
        <div class="info">
          <p>{{ item.author.lastname }}</p>
          <p>{{ item.author.name }}</p>
        </div>
        <div class="stars">
          <q-icon
            name="star"
            size="1.5em"
            color="primary"
            v-for="(star, idx) in item.stars"
            :key="idx"
          />
        </div>
        <div
          class="text_review"
          :class="{ text_review_hidden: item.textReview.length > 10 }"
          @click="handleClick"
        >
          <p>{{ item.textReview }}</p>
        </div>

        <div class="delete">
          <q-icon
            @click="deleteReview(item.id)"
            v-if="item.idClient === id"
            name="delete"
            color="negative"
          ></q-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

// Определяем интерфейс для Review
interface Review {
  idClient: string;
  idDriver: string;
  textReview: string;
  id: string;
  stars: number;
  author: {
    car: string;
    img: string;
    lastname: string;
    name: string;
    number: string;
    otchestvo: string;
  };
}

const id = ref(localStorage.getItem('authToken'));
const ratingModel = ref(3);
// Определяем props и их типы
const props = defineProps<{ textReview: string; review: Review[] }>();
const emit = defineEmits(['update:textReview', 'sendReview', 'deleteReview']);

const localTextReview = ref(props.textReview);
const localIsReview = ref(false);

const store = useStore();

// Синхронизируем localTextReview с props.textReview
watch(localTextReview, (newValue) => {
  emit('update:textReview', newValue);
});

watch(
  () => props.textReview,
  (newVal) => {
    localTextReview.value = newVal;
  }
);

// Проверка, оставлял ли пользователь отзыв, при монтировании
onMounted(async () => {
  const hasReview = await store.dispatch('review/isReview');
  localIsReview.value = !hasReview;
});

// Обработка отправки отзыва
function action() {
  emit('sendReview', ratingModel.value);
  if (localTextReview.value.trim() != '') {
    localIsReview.value = false;
  }
}

function handleClick(event: any) {
  const element = event.currentTarget;
  if (element.classList.contains('text_review_hidden')) {
    element.classList.replace('text_review_hidden', 'text_review_view');
  } else if (element.classList.contains('text_review_view')) {
    element.classList.replace('text_review_view', 'text_review_hidden');
  }
}

function deleteReview(id: string) {
  emit('deleteReview', id);
  localIsReview.value = !localIsReview.value;
}
</script>

<style scoped>
.reviews {
  display: grid;
  row-gap: 15px;
  margin-top: 40px;
  max-height: 200px;
  overflow-y: auto;
}
.reviews::-webkit-scrollbar {
  width: 5px;
}
.reviews::-webkit-scrollbar-button {
  display: none;
}
.reviews::-webkit-scrollbar-thumb {
  background-color: #2968a7;

  border-radius: 4px;
}
.your_review {
  border: 1.5px solid #2968a7;
}
.new__review {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
.q-field {
  width: 60%;
}
.q-icon {
  width: 9%;
}
/* .q-icon:hover {
  font-size: 29px !important;
} */
h5 {
  margin: 20px 0 5px 0;
}
small {
  color: #2968a7;
}
.photo {
  width: 5%;
  display: flex;
}
.photo img {
  width: 100%;
}
.review {
  display: flex;
  column-gap: 15px;
  background-color: #f3f3f3;
  border-radius: 4px;
  width: 99%;
  padding: 15px 15px;
}
.info {
  width: 10%;
  text-align: center;
  padding: 0 10px;
  margin: auto 0;
}
.info p {
  margin: 0;
}
.text_review {
  margin: auto 0;
  width: 50%;
  padding: 0 10px;
  cursor: pointer;
}
.text_review_hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.text_review p {
  margin: 0;
}
.stars {
  width: 13%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  margin: auto 0;
}

.stars .q-icon {
  width: auto;
}
.delete {
  margin: auto;
}
.delete .q-icon {
  width: auto;
}
.delete:hover {
  font-size: 19px;
}
</style>
