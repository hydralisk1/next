import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { State } from './store'

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const BASE_URL = process.env.BASE_URL
const initialState: State = { user: null, status: 'idle', error: null }

export const authUser = createAsyncThunk<
  User,
  {email: string, password: string},
  { rejectValue: {message: string} }
>
(
  'session/login',
  async ({email, password}, { rejectWithValue }) => {
    const url = '/api/auth'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }

    try{
      const response = await fetch(url, options)
      const data = await response.json()

      return response.ok ? data : rejectWithValue(data)
    }catch(err: unknown){
      return rejectWithValue({ message: 'Something went wrong' })
    }
  }
)

export const restoreUser = createAsyncThunk<
  User,
  void,
  { rejectValue: {message: string} }
>(
  'session/restore',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth')
      const user = await response.json()

      return response.ok ? user : rejectWithValue(user)
    }catch(err: unknown){
      return rejectWithValue({ message: 'Something went wrong' })
    }
  }
)

export const logoutUser = createAsyncThunk<
  null,
  void,
  { rejectValue: {message: string} }
>(
  'session/logout',
  async (_, { rejectWithValue }) => {
    const options = { method: 'DELETE' }
    try {
      const response = await fetch('/api/auth', options)

      return response.ok ? null : rejectWithValue({ message: 'Something went wrong' })
    }catch(err: unknown){
      return rejectWithValue({ message: 'Something went wrong' })
    }
  }
)


export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state: State) => {
        state.status = 'loading'
      })
      .addCase(authUser.fulfilled, (state: State, action) => {
        state.status = 'idle'
        state.user = action.payload
        state.error = null
      })
      .addCase(authUser.rejected, (state: State, action) => {
        state.status = 'failed'
        state.user = null
        if(action.payload) state.error = action.payload.message
      })

    builder
      .addCase(restoreUser.pending, (state: State) => {
        state.status = 'loading'
      })
      .addCase(restoreUser.fulfilled, (state: State, action) => {
        state.status = 'idle'
        state.user = action.payload
        state.error = null
      })
      .addCase(restoreUser.rejected, (state: State, action) => {
        state.status = 'failed'
        state.user = null
        if(action.payload) state.error = action.payload.message
      })

    builder
      .addCase(logoutUser.fulfilled, (state: State) => {
        state.status = 'idle'
        state.user = null
      })
      .addCase(logoutUser.rejected, (state: State, action) => {
        state.status = 'failed'
        if(action.payload) state.error = action.payload.message
      })
  }
})

export default sessionSlice.reducer
