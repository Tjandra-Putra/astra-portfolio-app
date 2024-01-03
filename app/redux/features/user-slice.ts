import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string;
  role: string;
  name: string;
  domain: string;
  email: string;
  workEmail: string;
};

const initialState = {
  id: "",
  role: "",
  name: "",
  domain: "",
  email: "",
  workEmail: "",
} as UserState;

// define the state interface
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeUserInfo: () => {
      return initialState;
    },

    // this is to get user info for public (domain) visit and auth visit (profile info)
    setUserInfo: (state, action) => {
      const { id, role, name, domain, email, workEmail } = action.payload;

      state.id = id;
      state.role = role;
      state.name = name;
      state.domain = domain;
      state.email = email;
      state.workEmail = workEmail;
    },
  },
});

export const { setUserInfo, removeUserInfo } = userSlice.actions;
export default userSlice.reducer;
