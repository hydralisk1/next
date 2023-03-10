import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './session'

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
})
