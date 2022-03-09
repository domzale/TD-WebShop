import { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";

const ShopCartTableItemAmount = ({
  item,
  isEditing,
  setIsEditing,
  refreshPriceTrigger,
  setRefreshPriceTrigger,
}: any) => {
  const [amount, setAmount] = useState(parseInt(item.amount));
  const [edit, setEdit] = useState<boolean>();
  const [activeIcon, setActiveIcon] = useState(<></>);
  useEffect(() => {
    setAmount(item.amount);
    setEdit(false);
    setActiveIcon(<EditOutlined />);
  }, [item.amount]);
  return (
    <div>
      <span>{amount}</span>
      <Button
        icon={activeIcon}
        style={{ color: "blue", borderColor: "blue", float: "right" }}
        onClick={() => {
          if (edit === false) {
            if (isEditing === true) {
              message.warn("You can edit only one item at a time!");
              return;
            }
            setEdit(true);
            setIsEditing(true);
            setActiveIcon(<SaveOutlined />);
          } else {
            if (amount === 0) {
              message.warn(
                "You can't set item amount to 0, you must delete it from cart!"
              );
              return;
            }
            let obj = {
              itemId: item.id,
              amount: amount,
            };
            axiosInstance
              .post("/api/shop/user/cart/save", obj)
              .then((result) => {
                const { success } = result.data;
                if (success && success === true) {
                  message.success("Item amount successfully updated!");
                  setRefreshPriceTrigger(parseInt(refreshPriceTrigger) + 1);
                }
              })
              .catch((err) => {
                const { success, error } = err.response.data;
                if (success === false) {
                  let msg: string | undefined = ErrorMessages.find(
                    (v) => v.code === error.toString()
                  )?.message;
                  if (msg) {
                    message.error(msg);
                  } else {
                    message.error("Item adding failed!");
                  }
                }
                setAmount(item.amount);
              });
            setEdit(false);
            setIsEditing(false);
            setActiveIcon(<EditOutlined />);
          }
        }}
      />
      {edit ? (
        <Button
          icon={<CloseOutlined />}
          style={{
            color: "orange",
            borderColor: "orange",
            float: "right",
          }}
          onClick={() => {
            setEdit(false);
            setIsEditing(false);
            setActiveIcon(<EditOutlined />);
            axiosInstance
              .get(`/api/shop/user/cart/item/amount?itemId=${item.id}`)
              .then((result) => {
                const { success, amount } = result.data;
                if (success && success === true && amount) {
                  setAmount(amount);
                }
              })
              .catch(() => {});
            setRefreshPriceTrigger(parseInt(refreshPriceTrigger) + 1);
          }}
        />
      ) : undefined}
      {edit ? (
        <Button
          icon={<PlusOutlined />}
          style={{ color: "green", borderColor: "green", float: "right" }}
          onClick={() => {
            if (amount >= 1000) {
              setAmount(1000);
            } else {
              setAmount(amount + 1);
            }
          }}
        />
      ) : undefined}
      {edit ? (
        <Button
          icon={<MinusOutlined />}
          danger
          style={{ float: "right" }}
          onClick={() => {
            if (amount === 1 || amount < 1) {
              setAmount(1);
            } else {
              setAmount(amount - 1);
            }
          }}
        />
      ) : undefined}
    </div>
  );
};

export default ShopCartTableItemAmount;
