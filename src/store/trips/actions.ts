import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';
import axios from 'axios';

type OrderData = {
  client: string;
  idTrip: string;
  count: number;
};

type TripData = {
  count: number;
};

interface DeleteBookingResult {
  success: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Trip {
  date: string;
  time: string;
  price: string;
  count: string;
  arrival_place: string;
  departure_place: string;
  driver: string;
}
const BASE_URL = 'https://road-3a99b-default-rtdb.firebaseio.com/trip.json';
const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async addTrip(_, data) {
    try {
      /*Проверка актуальности даты */
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const [day, month, year] = data.value['Дата'].split('.').map(Number);
      const tripDate = new Date(year, month - 1, day);
      tripDate.setHours(0, 0, 0, 0);
      if (tripDate < currentDate) {
        return {
          success: false,
          message: 'Вы указали неверную дату',
          type: 'warning',
        };
      }

      /*Проверка существует ли такая запись */
      const driverId = localStorage.getItem('authToken');
      const existingTripsResponse = await axios.get(BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      const trips = existingTripsResponse.data;
      console.log(trips);
      const isTripExists = (Object.values(trips || {}) as Trip[]).some(
        (trip) =>
          trip.driver === driverId &&
          trip.time === data.value['Время'] &&
          trip.date === data.value['Дата']
      );

      if (isTripExists) {
        return {
          success: false,
          message: 'Вы уже выкладывали такую запись',
          type: 'warning',
        };
      }

      /*Добавление записи в базу */
      const payload = {
        date: data.value['Дата'],
        departure_place: data.value['Место отправки'],
        arrival_place: data.value['Место прибытия'],
        count: Number(data.value['Количество']),
        price: data.value['Цена'],
        time: data.value['Время'],
        driver: driverId,
      };

      const response = await axios.post(BASE_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        success: true,
        message: 'Информация успешно добавлена!',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при добавлении информации, попробуйте позже.',
        type: 'error',
      };
    }
  },

  async getTrips({ dispatch }, arr) {
    try {
      // Date validation
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const [day, month, year] = arr.value['Дата'].split('.').map(Number);
      const tripDate = new Date(year, month - 1, day);
      tripDate.setHours(0, 0, 0, 0);
      if (tripDate < currentDate) {
        return {
          success: false,
          message: 'Можно смотреть только актуальные поездки',
          type: 'warning',
        };
      }

      // Current time in hours and minutes
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      const currentTime = new Date(Date.now() - tzoffset)
        .toISOString()
        .split('T')[1]
        .split('.')[0]
        .split(':');
      const [currentHour, currentMinute] = currentTime.map(Number);

      // Fetching data
      const { data } = await axios.get(BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });
      const requests = Object.keys(data).map((id) => ({ ...data[id], id }));

      // Filtering trips based on date, place, and time
      const filterTrips = requests.filter((item) => {
        const [itemHour, itemMinute] = item.time.split(':').map(Number);

        return (
          item.date === arr.value['Дата'] &&
          item.departure_place === arr.value['Место отправки'] &&
          item.arrival_place === arr.value['Место прибытия'] &&
          (itemHour > currentHour ||
            (itemHour === currentHour && itemMinute > currentMinute))
        );
      });

      // Fetch driver information for each trip
      for (const trip of filterTrips) {
        if (trip.driver) {
          try {
            const driverData = await dispatch('user/getUserById', trip.driver, {
              root: true,
            });
            const { name, lastname, img } = driverData;
            trip.driver = { id: trip.driver, name, lastname, img };
          } catch (driverError) {
            console.error(
              `Error fetching driver with ID ${trip.driver}:`,
              driverError
            );
            trip.driver = {
              id: trip.driver,
              name: null,
              lastname: null,
              img: null,
            };
          }
        }
      }

      return {
        success: true,
        message: 'Записи успешно получены!',
        data: filterTrips,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при получении данных, попробуйте позже.',
        type: 'error',
      };
    }
  },
  async getTripsProposed({ dispatch }, id) {
    try {
      const { data } = await axios.get(BASE_URL, {
        headers: { 'Content-Type': 'application/json' },
      });

      const requests = Object.keys(data).map((recordId) => ({
        ...data[recordId],
        id: recordId,
      }));

      const filterTrips = requests.filter((item) => item.driver === id);

      for (const trip of filterTrips) {
        if (trip.driver) {
          try {
            const driverData = await dispatch('user/getUserById', trip.driver, {
              root: true,
            });

            const { name, lastname, img } = driverData;
            trip.driver = { id: trip.driver, name, lastname, img };
          } catch (driverError) {
            console.error(
              `Error fetching driver with ID ${trip.driver}:`,
              driverError
            );
            trip.driver = {
              id: trip.driver,
              name: null,
              lastname: null,
              img: null,
            };
          }
        }
      }

      return {
        success: true,
        message: 'Записи успешно получены!',
        data: filterTrips,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка при получении данных, попробуйте позже.',
        type: 'error',
      };
    }
  },

  async getTripsBooking({ dispatch }, clientId) {
    try {
      const orderUrl =
        'https://road-3a99b-default-rtdb.firebaseio.com/order.json';
      const tripUrl =
        'https://road-3a99b-default-rtdb.firebaseio.com/trip.json';

      // Fetch all orders
      const { data: ordersData } = await axios.get(orderUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Filter orders by clientId
      const filteredOrders = Object.keys(ordersData || {})
        .map((orderId) => ({
          id: orderId,
          ...ordersData[orderId],
        }))
        .filter((order) => order.client === clientId);

      // Fetch all trips
      const { data: tripsData } = await axios.get(tripUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Create a mapping of trips by trip ID
      const tripsMap = Object.keys(tripsData || {}).reduce((map, tripId) => {
        map[tripId] = { id: tripId, ...tripsData[tripId] };
        return map;
      }, {});

      // Combine orders with their corresponding trip details
      const ordersWithTripDetails = await Promise.all(
        filteredOrders.map(async (order) => {
          const trip = tripsMap[order.idTrip];

          if (trip) {
            let driverDetails = {
              id: trip.driver,
              name: null,
              lastname: null,
              img: null,
            };

            // Fetch driver details if a driver is assigned to the trip
            if (trip.driver) {
              try {
                const driverData = await dispatch(
                  'user/getUserById',
                  trip.driver,
                  { root: true }
                );
                driverDetails = {
                  id: trip.driver,
                  name: driverData.name || '',
                  lastname: driverData.lastname || '',
                  img: driverData.img || '',
                };
              } catch (error) {
                console.error(
                  `Error fetching driver with ID ${trip.driver}:`,
                  error
                );
              }
            }

            // Return the combined details for the order and trip
            return {
              id: trip.id,
              date: trip.date,
              time: trip.time,
              price: trip.price,
              count: order.count, // Get count from the order
              orderId: order.id, // Include order ID for reference
              arrival_place: trip.arrival_place,
              departure_place: trip.departure_place,
              driver: driverDetails,
            };
          }
          return null; // Return null if no trip is found
        })
      );

      // Filter out null values in the result data
      const resultData = ordersWithTripDetails.filter(Boolean);

      return {
        success: true,
        message: 'Записи успешно получены!',
        data: resultData,
      };
    } catch (error) {
      console.error('Error fetching booking data:', error);
      return {
        success: false,
        message: 'Ошибка при получении данных, попробуйте позже.',
        type: 'error',
      };
    }
  },
  async addTripForOrder(_, arr) {
    try {
      // Define URLs
      const orderUrl =
        'https://road-3a99b-default-rtdb.firebaseio.com/order.json';
      const tripUrl = `https://road-3a99b-default-rtdb.firebaseio.com/trip/${arr.idTrip}.json`;

      const orderToSave = {
        client: arr.idClient,
        idTrip: arr.idTrip,
        count: 1,
      };

      // Check if an order with the same client and idTrip already exists
      const existingOrdersResponse = await axios.get(orderUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      const existingOrderEntry = Object.entries(
        existingOrdersResponse.data || {}
      ).find(
        ([, order]) =>
          order.client === arr.idClient && order.idTrip === arr.idTrip
      );

      if (existingOrderEntry) {
        const [orderId, existingOrder] = existingOrderEntry;
        const updatedOrderCount = existingOrder.count + 1;

        await axios.patch(
          `https://road-3a99b-default-rtdb.firebaseio.com/order/${orderId}.json`,
          { count: updatedOrderCount },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const tripResponse = await axios.get(tripUrl, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (tripResponse.data && tripResponse.data.count > 0) {
          const updatedTripCount = tripResponse.data.count - 1;

          await axios.patch(
            tripUrl,
            { count: updatedTripCount },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          return {
            success: true,
            message: 'Успешно забронировано',
            type: 'success',
          };
        } else {
          return {
            success: false,
            message: 'Недостаточно мест для регистрации',
            type: 'warning',
          };
        }
      } else {
        await axios.post(orderUrl, orderToSave, {
          headers: { 'Content-Type': 'application/json' },
        });

        const tripResponse = await axios.get(tripUrl, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (tripResponse.data && tripResponse.data.count > 0) {
          const updatedTripCount = tripResponse.data.count - 1;

          await axios.patch(
            tripUrl,
            { count: updatedTripCount },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );

          return {
            success: true,
            message: 'Успешно забронировано',
            type: 'success',
          };
        } else {
          return {
            success: false,
            message: 'Недостаточно мест для регистрации',
            type: 'warning',
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Ошибка заказа попробуйте позже.',
        type: 'error',
      };
    }
  },
  async deleteBookingClient(
    _: unknown,
    id: string
  ): Promise<DeleteBookingResult> {
    try {
      const orderUrl =
        'https://road-3a99b-default-rtdb.firebaseio.com/order.json';
      const tripUrl =
        'https://road-3a99b-default-rtdb.firebaseio.com/trip.json';

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        return {
          success: false,
          message: 'Токен не найден. Пожалуйста, войдите в систему.',
          type: 'error',
        };
      }
      const { data: ordersData } = await axios.get<Record<string, OrderData>>(
        orderUrl,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const orderEntry = Object.entries(ordersData || {}).find(
        ([orderId, orderData]) =>
          orderId === id && orderData.client === authToken
      );

      if (orderEntry) {
        const [orderId, orderData] = orderEntry;
        const deleteUrl = `https://road-3a99b-default-rtdb.firebaseio.com/order/${id}.json`;
        await axios.delete(deleteUrl, {
          headers: { 'Content-Type': 'application/json' },
        });

        const { data: tripsData } = await axios.get<Record<string, TripData>>(
          tripUrl,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const tripEntry = Object.entries(tripsData || {}).find(
          ([tripId, tripData]) => tripId === orderData.idTrip
        );

        if (tripEntry) {
          const [tripId, tripData] = tripEntry;
          const newCount = (tripData?.count || 0) + orderData.count;
          const updateTripUrl = `https://road-3a99b-default-rtdb.firebaseio.com/trip/${tripId}.json`;
          await axios.patch(
            updateTripUrl,
            { count: newCount },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        return {
          success: true,
          message: 'Запись успешно удалена и каунт обновлен',
          type: 'success',
        };
      } else {
        return {
          success: false,
          message: 'Запись не найдена',
          type: 'warning',
        };
      }
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      return {
        success: false,
        message: 'Ошибка при удалении, попробуйте позже.',
        type: 'error',
      };
    }
  },
};

export default actions;
