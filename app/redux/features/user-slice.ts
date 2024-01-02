import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: UserState;
};

type UserState = {
  id: string;
  role: string;
  name: string;
  domain: string;
  email: string;
};

const initialState = {
  value: {
    id: "",
    role: "",
    name: "",
    domain: "",
    email: "",
  } as UserState,
} as InitialState;

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
      const { id, role, name, domain, email } = action.payload;

      return {
        ...state,
        value: {
          id,
          role,
          name,
          domain,
          email,
        },
      };
    },
  },
});

export const { setUserInfo, removeUserInfo } = userSlice.actions;
export default userSlice.reducer;
