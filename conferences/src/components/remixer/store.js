import { configureStore } from '@reduxjs/toolkit';
// @ts-ignore
// import logger from 'redux-logger';

import remixerSlice from './reducers/remixerSlice';

export const store = configureStore({
  reducer: {
    remixer: remixerSlice,
  },
  devTools: true,
});
