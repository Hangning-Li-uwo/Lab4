// state.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  orders: [],
  localStock: [],
  items: [], // Cart items array
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload.themeMode;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload.profile;
    },
    updateRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload.role; // Update the role in the Redux store
      }
    },
    logOut: (state, action) => {
      state.user = null;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user.address = action.payload.address;
        state.user.paymentMethod = action.payload.paymentMethod;
      }
    },
    setCartItem: (state, action) => {
      // Check if the item already exists in the cart
      const existingItem = state.items.find(
        (item) => item.name === action.payload.name
      );

      if (existingItem) {
        // Increment the quantity if the item exists
        existingItem.quantity += 1;
      } else {
        // Add the item to the cart with an initial quantity of 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeCartItem: (state, action) => {
      // Remove the item at the specified index
      state.items = state.items.filter((_, index) => index !== action.payload);
    },
    setOrderItem: (state, action) => {
      state.user?.ordersRef.push(action.payload);
      // Clear cart items
      state.items = [];
    },
    deleteOrderItem: (state, action) => {
      if(state.user.ordersRef){
        state.user.ordersRef = state.user.ordersRef.filter(
          (_, index) => index !== action.payload
        );
      }
    },
    setLocalStock: (state, action) => {
      state.localStock = action.payload.map(item => ({
        name: item.name,
        quantity: item.quantity,
      }));
    },
  },
});

export const {
  setMode,
  setUserProfile,
  updateProfile,
  updateRole,
  logOut,
  setCartItem,
  removeCartItem,
  clearCartItem,
  setOrderItem,
  deleteOrderItem,
  setLocalStock
} = authSlice.actions;
export default authSlice.reducer;
