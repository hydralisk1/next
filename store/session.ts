import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserState {
  user: User | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}

const initialState: UserState = { user: null, status: 'idle', error: null }

export const authUser = createAsyncThunk<
  User,
  {email: string, password: string},
  { rejectValue: {message: string} }
>
(
  'session/login',
  async ({email, password}, { rejectWithValue }) => {
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
      return rejectWithValue({ message: 'Something went wrong' })
    }
  }
)

export const restoreUser = createAsyncThunk<
  User,
  string,
  { rejectValue: {message: string} }
>(
  'session/restore',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth')
      const user = await response.json()

      return response.ok ? user : rejectWithValue(user)
    }catch(err: unknown){
      return rejectWithValue({ message: 'Something went wrong' })
    }
  }
)


export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    logout: (state: UserState) => {
      state.user = null
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(authUser.fulfilled, (state: UserState, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(authUser.rejected, (state: UserState, action) => {
        state.status = 'failed'
        state.user = null
        if(action.payload) state.error = action.payload.message
      })

    builder
      .addCase(restoreUser.pending, (state: UserState) => {
        state.status = 'loading'
      })
      .addCase(restoreUser.fulfilled, (state: UserState, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        state.error = null
      })
      .addCase(restoreUser.rejected, (state: UserState, action) => {
        state.status = 'failed'
        state.user = null
        if(action.payload) state.error = action.payload.message
      })
  }
})

export const { logout } = sessionSlice.actions
export default sessionSlice.reducer
