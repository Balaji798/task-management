import ApiService from "../../services/ApiService";
import axios from "axios";

export const getCart = async (dispatch) => {
  try {
    const res = await ApiService.getCart();
   
    dispatch({ type: "FETCH_CART_SUCCESS", cart: res.data });
  } catch (error) {
    dispatch({ type: "FETCH_CART_FAILURE", cart: error.message });
  }
};

export const removeItemFromCart = async (dispatch, itemId) => {
  try {
    // Make an API request to remove the item from the cart by its ID
    const user = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
        "Content-Type": "application/json", // Set the content type to JSON
      },
    };
    await axios.post(
      "https://drcbd-backend-zgqu.onrender.com/cart/remove_item_from_cart",
      //https://52.77.244.89:8080
      { productId: itemId },
      config
    );
    // Dispatch an action to update the cart state in Redux (you may need to fetch the updated cart)
    // For simplicity, let's assume you're refetching the entire cart after removing an item
    const updatedCartRes = await ApiService.getCart();
    dispatch({ type: "GET_CART", cart: updatedCartRes.data });
  } catch (error) {
    dispatch({ type: "REMOVE_CART_ITEM_FAILURE", error: error.message });
  }
};

export const removeAllItem = async (dispatch, cartId) => {};
