import ApiService from "../../services/ApiService";


export const fetchProduct = async (dispatch, product) => {
  try {
    dispatch({ type: "FETCH_PRODUCT_SUCCESS", product: product });
  } catch (error) {
    dispatch({ type: "FETCH_PRODUCT_FAILURE", product: error.message });
  }
};

export const getProduct = async (dispatch) => {
  try {
    const res = await ApiService.getAllProduct();
    dispatch({ type: "GET_ALL_PRODUCT", product: res.data });
  } catch (error) {
    dispatch({ type: "FETCH_PRODUCT_FAILURE", product: error.message });
  }
};
