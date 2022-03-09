import { Button, message, Statistic } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { ShopHeaderComponents } from "../Enums";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ShopHomeSmallCart = ({ setActiveTabKey, trigger }: any) => {
  const [total, setTotal] = useState("0kn");
  useEffect(() => {
    axiosInstance
      .get("/api/shop/user/cart/total")
      .then((result) => {
        const { success, total } = result.data;
        if (success && total) {
          if (total === "kn") {
            setTotal("0kn");
          } else {
            setTotal(total);
          }
        }
      })
      .catch(() => message.error("Something went wrong!"));
    return () => {};
  }, [trigger]);
  return (
    <div>
      <Statistic title="Total Shopping Cart Price" value={total} />
      <Button
        block
        style={{ borderRadius: "35px", marginTop: 16 }}
        type="primary"
        onClick={() => setActiveTabKey(ShopHeaderComponents.CART.valueOf())}
      >
        {<ShoppingCartOutlined />}
      </Button>
    </div>
  );
};

export default ShopHomeSmallCart;
