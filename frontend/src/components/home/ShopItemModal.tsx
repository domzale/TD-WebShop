import {
  message,
  Modal,
  Descriptions,
  Col,
  Row,
  Image,
  Form,
  Input,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import { Item } from "../Types";

const ShopItemModal = ({
  modalVisible,
  setModalVisible,
  itemId,
  trigger,
  setTrigger,
}: any) => {
  const [item, setItem] = useState<Item>();
  const [price, setPrice] = useState<string>("0kn");
  const [clickable, setClickable] = useState(true);
  const [form] = Form.useForm();
  const handleButton = () => {
    setModalVisible(false);
    form.resetFields();
    setPrice("0kn");
  };
  useEffect(() => {
    axiosInstance
      .get(`/api/shop/item?itemId=${itemId}`)
      .then((result) => setItem(result.data.item))
      .catch(() => message.error("Something went wrong!"));
  }, [itemId]);
  const onFinish = (values: any) => {
    if (!clickable) return;
    axiosInstance
      .get("/api/user/test/auth")
      .then(() => {
        let obj = {
          itemId: item?.item_id,
          amount: values.amount,
        };
        axiosInstance
          .post("/api/shop/user/cart/add", obj)
          .then((result) => {
            const { success } = result.data;
            if (success && success === true) {
              message.success("Item added to cart!");
              setTrigger(parseInt(trigger) + 1);
              setClickable(false);
              setTimeout(() => {
                setClickable(true);
              }, 2000);
            } else {
              message.error("Failed to add the item to cart!");
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
          });
        form.resetFields();
      })
      .catch(() => {
        message.error("You must be logged in to be able to use the cart!");
        return;
      });
  };
  const onChange = (e: any) => {
    if (
      !isNaN(parseInt(e.target.value)) &&
      parseInt(e.target.value) >= 1 &&
      parseInt(e.target.value) <= 1000
    ) {
      let price: string =
        (parseFloat(item?.cost || "0") -
          (parseFloat(item?.cost || "0") *
            parseFloat(item?.discount || "0.0")) /
            100) *
          parseInt(e.target.value) +
        "kn";
      setPrice(price);
    }
  };
  const calculate = (item: any) => {
    let price =
      parseFloat(item?.cost || "0") -
      (parseFloat(item?.cost || "0") * parseFloat(item?.discount || "0.0")) /
        100;
    return price.toFixed(2);
  };
  return (
    <Modal
      visible={modalVisible}
      onCancel={handleButton}
      width={"100%"}
      footer={null}
    >
      <Row>
        <Col span={12}>
          <Descriptions
            title="Item Info"
            bordered
            labelStyle={{ backgroundColor: "#e6f7ff" }}
            contentStyle={{ backgroundColor: "white" }}
          >
            <Descriptions.Item label="Identifier" span={3}>
              {item?.item_id}
            </Descriptions.Item>
            <Descriptions.Item label="Name" span={3}>
              {item?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              {item?.description}
            </Descriptions.Item>
            <Descriptions.Item label="Cost" span={3}>
              {item?.cost}kn
            </Descriptions.Item>
            <Descriptions.Item label="Discount" span={3}>
              {parseFloat(item?.discount || "0.0").toFixed(2)}%
            </Descriptions.Item>
            <Descriptions.Item label="Cost with discount" span={3}>
              {calculate(item)} kn
            </Descriptions.Item>
            <Descriptions.Item label="Available items" span={3}>
              {item?.amount}
            </Descriptions.Item>
          </Descriptions>
          <Form onFinish={onFinish} form={form}>
            <Row>
              <Col span={9}>
                <Form.Item
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: "Please input an amount!",
                    },
                    {
                      pattern: /^([1-9][0-9]{0,2}|1000)$/,
                      message: "Please select between 1 and 1000 items!",
                    },
                  ]}
                >
                  <Input
                    style={{ borderRadius: "35px" }}
                    placeholder="Amount"
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <p
                    style={{
                      textAlign: "center",
                      paddingTop: "7px",
                      border: "1px solid black",
                      borderRadius: "35px",
                    }}
                  >
                    {price}
                  </p>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item>
                  <Button
                    style={{ borderRadius: "35px" }}
                    block={true}
                    type="primary"
                    htmlType="submit"
                  >
                    Add to cart
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col
          span={12}
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <Image
            width={"75%"}
            height={400}
            src={
              item?.amount === 0
                ? "https://easy-groceries.de/wp-content/uploads/2020/03/69079050-out-of-stock-grunge-rubber-stamp-on-white-background-vector-illustration.jpg"
                : item && item.image
                ? item.image
                : "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-1200x1200.png"
            }
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ShopItemModal;
