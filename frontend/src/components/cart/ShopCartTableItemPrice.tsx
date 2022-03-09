import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";

const ShopCartTableItemPrice = ({ item, refreshPriceTrigger }: any) => {
  const [price, setPrice] = useState(item.total);
  useEffect(() => {
    axiosInstance
      .get(`/api/shop/user/cart/item/price?itemId=${item.id}`)
      .then((result) => {
        const { success, total } = result.data;
        if (success && success === true && total) {
          setPrice(total);
        }
      })
      .catch(() => {});
  }, [refreshPriceTrigger, item.id]);
  return <div>{price}</div>;
};

export default ShopCartTableItemPrice;
