import { disconnectSocket } from "@/lib/socket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface authState {
  user: {
    id: string | null;
    userName: string | null;
    role: string | null;
    email:string|null;
    verified:string|null;
    goldCoin:number|null;
    profilePicture:string|null
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
    goldCoin:null,
    profilePicture:null
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
        goldCoin:number;
        profilePicture:string
      }>
    ) => {
      const { id, name, role, accessToken,email,verified,goldCoin,profilePicture } = action.payload;
      state.user = { id, userName:name, role,email,verified,goldCoin:goldCoin,profilePicture:profilePicture };
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
        goldCoin:null,
        profilePicture:null
      };
      state.accessToken = null;
      disconnectSocket()
    },
  },
});

export const { login, logout,setPersist } = authSlice.actions;
export default authSlice.reducer;
