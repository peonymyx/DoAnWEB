import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import commentSlice from "./commentSlice";
import cartSlice from "./cartSlice";
import otherSlice from "./otherSlice";
import messengerSlice from "./messengerSlice";
import categoryPostSlice from "./categoryPostSlice";
import statisticalSlice from "./statisticalSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    user: userSlice,
    category: categorySlice,
    comment: commentSlice,
    cart: cartSlice,
    other: otherSlice,
    messenger: messengerSlice,
    categoryPost: categoryPostSlice,
    statistical: statisticalSlice,
  },
});

export default store;
