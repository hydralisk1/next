import { Payload } from '@prisma/client/runtime'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

// import type { RootState } from './index'

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface UserState {
  user: User | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const isError = (payload: User | {message: string}): payload is {message: string} => {
  return (payload as {message: string}).message !== undefined
}

const initialState: UserState = { user: null, status: 'idle' }

const authUser = createAsyncThunk(
  'session/login',
  async ({email, password}: {email: string, password: string}, { rejectWithValue }) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }

    try{
      const response = await fetch('/api/auth', options)
      const data = await response.json()

      return response.ok ? data : rejectWithValue(data)
    }catch(err: unknown){
      return rejectWithValue(err)
    }
  }
)

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    logout: (state: UserState) => {state.user = null}
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(authUser.fulfilled, (state: UserState, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
  }
})

export const { logout } = sessionSlice.actions
export default sessionSlice.reducer
