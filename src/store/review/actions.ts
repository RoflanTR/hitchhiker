import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';
import axios from 'axios';

const BASE_URL = 'https://road-3a99b-default-rtdb.firebaseio.com/review.json';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async addReview(_, arr) {
    try {
      if (!arr.text || arr.text.trim() === '') {
        return {
          success: false,
          message: 'Отзыв не может быть пустым.',
          type: 'error',
        };
      }

      const toSave = {
        idClient: localStorage.getItem('authToken'),
        idDriver: arr.idDriver,
        textReview: arr.text,
        stars: arr.stars,
      };

      await axios.post(BASE_URL, toSave, {
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        success: true,
        message: 'Отзыв успешно добавлен.',
        type: 'success',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при отправке отзыва: ',
        type: 'error',
      };
    }
  },
  async isReview() {
    try {
      const idClient = localStorage.getItem('authToken');

      const res = await axios.get(BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      const reviews = Object.values(res.data).filter(
        (review: any) => review.idClient === idClient
      );

      return reviews.length >= 1;
    } catch (error) {
      return false;
    }
  },

  async getReviewById({ dispatch }, id) {
    try {
      const { data } = await axios.get(BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      const requests = Object.keys(data).map((recordId) => ({
        ...data[recordId],
        id: recordId,
      }));

      const filterData = requests.filter((e) => e.idDriver === id);

      for (const review of filterData) {
        const author = await dispatch('user/getUserById', review.idClient, {
          root: true,
        });
        review.author = author;
      }

      return filterData;
    } catch (error) {
      console.error('Error fetching review data:', error);
      return [];
    }
  },

  async deleteReview(_, id) {
    try {
      await axios.delete(`${BASE_URL.replace('.json', '')}/${id}.json`, {
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        success: true,
        message: 'Отзыв успешно удален',
        type: 'success',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при удалении отзыва.',
        type: 'error',
      };
    }
  },
};

export default actions;
