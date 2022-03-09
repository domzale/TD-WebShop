import {
  Button,
  Descriptions,
  Form,
  Layout,
  Input,
  Row,
  Col,
  message,
  DatePicker,
  Popconfirm,
  Image,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import moment from "moment";
import { CardType } from "../Types";

const { Content } = Layout;

const AccountBilling = () => {
  const [addMode, setAddMode] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    axiosInstance
      .post("/api/shop/user/billing", values)
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success("New card successfully added!");
          setAddMode(false);
          form.resetFields();
        } else {
          message.error("Something went wrong!");
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
            message.error("Card adding failed!");
          }
        }
        setAddMode(false);
        form.resetFields();
      });
  };
  useEffect(() => {
    axiosInstance
      .get("/api/shop/user/billing")
      .then((result) => setCards(result.data.cards))
      .catch((err) => console.log(err));
  }, [addMode]);
  return (
    <Content style={{ padding: "0 50px" }}>
      <Layout style={{ padding: "24px 0" }}>
        <Form onFinish={onFinish} form={form}>
          <Descriptions
            title="Billing Information"
            bordered
            labelStyle={{ backgroundColor: "#e6f7ff" }}
            contentStyle={{ backgroundColor: "white" }}
            extra={
              addMode === true ? (
                <div>
                  <Button
                    style={{ borderRadius: "35px" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>{" "}
                  <span>or</span>{" "}
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      borderRadius: "35px",
                    }}
                    onClick={() => {
                      setAddMode(false);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="primary"
                  style={{ borderRadius: "35px" }}
                  onClick={() => {
                    setAddMode(true);
                  }}
                >
                  Add
                </Button>
              )
            }
          >
            {addMode === true ? (
              <Descriptions.Item label="Card Info" span={3}>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      name="cardNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please input your card number!",
                        },
                        {
                          len: 16,
                          message: "Please input at exactly 16 characters!",
                        },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="Card Number" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="cvc"
                      rules={[
                        { required: true, message: "Please input your CVC!" },
                        {
                          min: 3,
                          message: "Please input at least 3 characters!",
                        },
                        {
                          max: 4,
                          message: "Please input at maximum 4 characters!",
                        },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="CVC" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      name="expiration"
                      rules={[
                        {
                          required: true,
                          message: "Please input card's expiration date!",
                        },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="Expiration Date" type="date" />
                    </Form.Item>
                  </Col>
                </Row>
              </Descriptions.Item>
            ) : cards && cards.length > 0 ? (
              cards.map((card) => {
                const name: string = "Card Info (ID: #" + card.card_id + ")";
                const format = "yyyy/MM/DD";
                const outputFormat = "DD.MM.yyyy";
                const date = card.expires
                  .substring(0, card.expires.indexOf("T"))
                  .replaceAll("-", "/");
                return (
                  <Descriptions.Item key={card.card_id} label={name} span={3}>
                    <Row>
                      <Col span={4}>
                        <Image
                          preview={false}
                          src={card.image}
                          style={{ maxHeight: "32px", maxWidth: "32px" }}
                        />
                      </Col>
                      <Col span={10}>{card.card_number}</Col>
                      <Col span={8}>
                        <DatePicker
                          defaultValue={moment(date, format)}
                          format={outputFormat}
                          disabled={true}
                        />
                      </Col>
                      <Col span={2}>
                        <Popconfirm
                          key={card.card_id}
                          title="Are you sure？"
                          okText="Yes"
                          cancelText="No"
                          onConfirm={() => {
                            axiosInstance
                              .delete("/api/shop/user/billing", {
                                data: { cardId: card.card_id },
                              })
                              .then((result) => {
                                const { success } = result.data;
                                if (success && success === true) {
                                  message.success("Card successfully deleted!");
                                  setCards(
                                    cards.filter(
                                      (c) =>
                                        parseInt(c.card_id) !==
                                        parseInt(card.card_id)
                                    )
                                  );
                                }
                              })
                              .catch(() =>
                                message.error("Something went wrong!")
                              );
                          }}
                        >
                          <Button
                            key={card.card_id}
                            type="primary"
                            danger
                            style={{ borderRadius: "35px" }}
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </Col>
                    </Row>
                  </Descriptions.Item>
                );
              })
            ) : (
              <p>No cards found.</p>
            )}
          </Descriptions>
        </Form>
      </Layout>
    </Content>
  );
};

export default AccountBilling;
