import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { HYDRATE } from 'next-redux-wrapper'
import sessionReducer from './session'
// import hydrateReducer from './hydration'
import logger from 'redux-logger'
import { User } from './session'

export interface State {
  user: User | null
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const isProduction = process.env.NODE_ENV === 'production'

// const reducer = {
//   session: sessionReducer,
//   // hydrate: hydrateReducer
// }

const rootReducer = combineReducers({
  session: sessionReducer
})

const store = configureStore({
  reducer: (state, action) => {
    switch(action.type) {
      case HYDRATE:
        return action.payload
      default:
        return rootReducer(state, action)
    }
  },
  devTools: !isProduction,
  middleware: (getDefaultMiddleware) => isProduction ? getDefaultMiddleware() : getDefaultMiddleware().concat(logger)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const wrapper = createWrapper(() => store, {debug: !isProduction})
export default store
