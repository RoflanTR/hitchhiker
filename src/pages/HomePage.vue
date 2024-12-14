<template>
  <div class="block">
    <div class="info__block">
      <div>
        <h4 class="title">Lorem, ipsum dolor.</h4>
        <p class="description">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. A nisi iste
          hic quos culpa esse?
        </p>
        <div class="btn_block">
          <router-link to="trips"
            ><Btn color="primary" text="Посмотреть"
          /></router-link>
          <router-link to="create"
            ><Btn class="btn" color="" text="Создать"
          /></router-link>
        </div>
      </div>
    </div>
    <div class="image__block">
      <img src="../assets/img/Mask (1).svg" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Btn from '../components/shared/BtnComponents.vue';
</script>

<style scoped>
.block {
  display: flex !important;
  justify-content: end;
  position: relative;
  width: 80%;
  margin: auto;
  padding: 62px 0;
  border-radius: 20px;
  margin-top: 30px;
  box-shadow: 5px 5px 6px 3px #c5c5c5a3;
  background-color: #eeeeeed8;
}
.info__block {
  width: 50%;
  display: flex;
  align-items: end;
  margin-bottom: 20px;
}
.image__block {
  width: 40%;
}
.image__block img {
  object-fit: cover;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  left: 50%;
  position: relative;
  transform: translate(-50%, 0);
}
.btn {
  background-color: rgb(255, 99, 71);
}
.title {
  font-size: 54px;
  font-weight: 600;
  margin: 0 0 40px 0;
}
.description {
  margin-bottom: 40px;
}
.btn_block {
  width: 71%;
  display: flex;
  justify-content: space-between;
}
.ticket {
  width: 100px;
}
</style>
