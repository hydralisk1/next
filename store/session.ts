import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const initialState: User | {} = {}

const authUser = createAsyncThunk<User, >(
  'session/authUser',
  async ({email, password}: {email: string, password: string}, { rejectWithValue }) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }

    try{
      const response = await fetch('/api/auth', options)
      const data = await response.json()

      return data
    }catch(err){
      return rejectWithValue(err)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(authUser.fulfilled, (state: UserState, action: PayloadAction<UserState>) => {
      state = action.payload
    })
  }
})
