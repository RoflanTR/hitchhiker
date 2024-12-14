import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';
import axios from 'axios';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  number: string;
  password: string;
  name: string;
  lastname: string;
  otchestvo: string;
  img: string;
  car: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  type: 'success' | 'error';
  user?: {
    number: string;
    name: string;
  };
}

const BASE_URL = 'https://road-3a99b-default-rtdb.firebaseio.com/user.json';

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<Record<string, User>>(BASE_URL, {
    headers: { 'Content-Type': 'application/json' },
  });

  const requests = Object.keys(data).map((id) => ({ ...data[id], id }));
  return requests;
};

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async auth(
    _,
    credentials: { number: string; password: string }
  ): Promise<AuthResponse> {
    try {
      const users = await fetchUsers();
      const user = Object.values(users).find(
        (user) => user.number === credentials.number
      );

      if (user && (await bcrypt.compare(credentials.password, user.password))) {
        localStorage.setItem('authToken', user.id);
        return {
          success: true,
          message: 'Вход выполнен',
          type: 'success',
          user: { number: user.number, name: user.name },
        };
      }

      return {
        success: false,
        message: 'Не верно введены данные',
        type: 'error',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка авторизации. Попробуйте позже.',
        type: 'error',
      };
    }
  },

  async register(_, newUser: User): Promise<AuthResponse> {
    try {
      const users = await fetchUsers();
      const isExistingUser = Object.values(users).some(
        (user) => user.number === newUser.number
      );

      if (isExistingUser) {
        return {
          success: false,
          message: 'Такой номер уже используется',
          type: 'error',
        };
      }

      const { lastname, name, number, password } = newUser;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userToSave = {
        car: '',
        img: '',
        lastname,
        name,
        number,
        otchestvo: '',
        password: hashedPassword,
      };

      await axios.post(BASE_URL, userToSave, {
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        success: true,
        message: 'Успешно зарегистрировались',
        type: 'success',
        user: { number, name },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка регистрации попробуйте позже.',
        type: 'error',
      };
    }
  },
  async getUserById(_, id: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(
        `${BASE_URL.replace('.json', '')}/${id}.json`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const { ...userData } = response.data;
      delete userData.password;

      return userData;
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при получении данных, попробуйте позже.',
        type: 'error',
      };
    }
  },
  async editUserData({ dispatch }, updatedUser: User): Promise<AuthResponse> {
    try {
      // Retrieve the existing user data from the database
      const existingUser = await dispatch(
        'getUserById',
        localStorage.getItem('authToken')
      );

      if (!existingUser) {
        return {
          success: false,
          message: 'Пользователь не найден',
          type: 'error',
        };
      }

      const userToUpdate = {
        ...existingUser,
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        otchestvo: updatedUser.otchestvo,
        number: updatedUser.number,
        car: updatedUser.car,
      };
      await axios.put(
        `${BASE_URL.replace('.json', '')}/${localStorage.getItem(
          'authToken'
        )}.json`,
        userToUpdate,
        { headers: { 'Content-Type': 'application/json' } }
      );

      return {
        success: true,
        message: 'Данные успешно обновлены',
        type: 'success',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при обновлении данных, попробуйте позже.',
        type: 'error',
      };
    }
  },
};

export default actions;
