// src/redux/slices/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: {
    id: string | null;
    userName: string | null;
    role: string | null;
    email:string|null;
    verified:string|null;
  };
  accessToken: string | null;
  persist:boolean
}

const initialState: authState = {
  user: {
    id: null,
    userName: null,
    role: null,
    email:null,
    verified:null,
  },
  accessToken: null,
  persist:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        role: string;
        accessToken: string;
        email:string
        verified:string;
      }>
    ) => {
      const { id, name, role, accessToken,email,verified } = action.payload;
      state.user = { id, userName:name, role,email,verified };
      state.accessToken = accessToken;
    },
    setPersist(state){
      state.persist=!state.persist
    },
    logout: (state) => {
      state.user = {
        id: null,
        userName: null,
        role: null,
        email:null,
        verified:null,
      };
      state.accessToken = null;
    },
  },
});

export const { login, logout,setPersist } = authSlice.actions;
export default authSlice.reducer;
