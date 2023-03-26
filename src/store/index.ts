import { configureStore } from '@reduxjs/toolkit'

import postReducer from './reducers/post'
import publicPostReducer from './reducers/publicPost'

import userReducer from './reducers/user'
import channelReducer from './reducers/channel'

export const store = configureStore({
  reducer: {
    post: postReducer,
    publicPost: publicPostReducer,
    user: userReducer,
    channel: channelReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
