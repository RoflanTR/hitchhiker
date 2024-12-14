import { store } from 'quasar/wrappers';
import user from './user/index';
import trips from './trips/index';
import review from './review/index';
import { createStore } from 'vuex';

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  example: unknown;
}

export default store(function (/* { ssrContext } */) {
  const Store = createStore<StateInterface>({
    modules: {
      user,
      trips,
      review,
    },

    strict: !!process.env.DEBUGGING,
  });

  return Store;
});
