// import { createReducer, createAction } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
// import { State } from "./store";

// const initialState: State = {
//   user: null,
//   status: "idle",
//   error: null,
// }

// const hydrate = createAction<State>(HYDRATE);

// const hydrateReducer = createReducer(initialState, (builder) => {
//   builder
//     .addCase(hydrate, (state, action) => ({ ...state, ...action.payload }))
// })

// export default hydrateReducer;

import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { State } from "./store";

const initialState: State = {
  user: null,
  status: "idle",
  error: null,
}

export const hydrate = createSlice({
  name: 'hydrate',
  initialState,
  reducers: {
    [HYDRATE]: (state: State, action) => ({ ...state, ...action.payload })
  }
})

export default hydrate.reducer
