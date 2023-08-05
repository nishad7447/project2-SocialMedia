import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  message:null,
  admin: null,
  adminToken: null,
  online:false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminLogin:(state,action)=>{
      state.admin=action.payload.admin
      state.adminToken=action.payload.adminToken
    },
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      console.log(action.payload,"setLogin actionPay")
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.online=false
    },
   
    setMessage:(state,action)=>{
      state.message=action.payload
    },
    setOnline:(state,action) =>{
      state.online = action.payload
    }
  },
});

export const { setMode, setLogin, setLogout, setMessage, setAdminLogin, setOnline } =
  authSlice.actions;
export default authSlice.reducer;





































// setFriends: (state, action) => {
//   if (state.user) {
//     state.user.friends = action.payload.friends;
//   } else {
//     console.error("user friends non-existent :(");
//   }
// },
// setPosts: (state, action) => {
//   state.posts = action.payload.posts;
// },
// setPost: (state, action) => {
//   const updatedPosts = state.posts.map((post) => {
//     if (post._id === action.payload.post._id) return action.payload.post;
//     return post;
//   });
//   state.posts = updatedPosts;
// },