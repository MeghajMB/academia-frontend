// src/redux/slices/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: {
    id: string | null;
    userName: string | null;
    role: string | null;
    email:string|null
  };
  accessToken: string | null;
  persist:boolean
}

const initialState: authState = {
  user: {
    id: null,
    userName: null,
    role: null,
    email:null
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
        userName: string;
        role: string;
        accessToken: string;
        email:string
      }>
    ) => {
      const { id, userName, role, accessToken,email } = action.payload;
      state.user = { id, userName, role,email };
      state.accessToken = accessToken;
    },
    setAccessToken(state,action:PayloadAction<string>){
      state.accessToken=action.payload
    },
    setPersist(state){
      state.persist=!state.persist
    },
    logout: (state) => {
      state.user = {
        id: null,
        userName: null,
        role: null,
        email:null
      };
      state.accessToken = null;
    },
  },
});

export const { login, logout,setAccessToken,setPersist } = authSlice.actions;
export default authSlice.reducer;
