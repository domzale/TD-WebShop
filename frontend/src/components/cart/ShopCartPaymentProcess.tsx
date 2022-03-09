import { Row, Col, Spin, message } from "antd";
import { useEffect } from "react";
import { axiosInstance } from "../Axios";
import { ShopHeaderComponents } from "../Enums";

const ShopCartPaymentProcess = ({ setActiveTabKey, cardId }: any) => {
  const completeCheckout = () => {
    axiosInstance
      .post("/api/shop/user/cart/checkout", { cardId: cardId })
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success(
            "Cart checked out successfully, order has been placed and processed."
          );
          setActiveTabKey(ShopHeaderComponents.ACCOUNT.valueOf());
        } else {
          message.error("Failed to checkout your cart!");
          setActiveTabKey(ShopHeaderComponents.CART.valueOf());
        }
      })
      .catch(() => {
        message.error("Something went wrong while checking out your cart!");
        setActiveTabKey(ShopHeaderComponents.CART.valueOf());
      });
  };
  useEffect(() => {
    setTimeout(completeCheckout, 10000);
  });
  return (
    <Row style={{ textAlign: "center" }}>
      <Col span="8" />
      <Col span="8">
        <h1>
          Please wait while we process your payment request. Upon success, you
          will be redirected to the 'Account' tab.
        </h1>
        <Spin size="large" />
      </Col>
      <Col span="8" />
    </Row>
  );
};

export default ShopCartPaymentProcess;
