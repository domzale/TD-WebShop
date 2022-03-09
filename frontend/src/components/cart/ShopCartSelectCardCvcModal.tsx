import { Modal, Row, Form, Input, Button, message } from "antd";
import { axiosInstance } from "../Axios";
import ShopCartPaymentProcess from "./ShopCartPaymentProcess";

const ShopCartSelectCardCvcModal = ({
  card,
  modalVisible,
  setModalVisible,
  setActiveComponent,
  setActiveTabKey,
}: any) => {
  const [form] = Form.useForm();
  const handleButton = () => {
    setModalVisible(false);
    form.resetFields();
  };
  const onFinish = (values: any) => {
    const { cvc } = values;
    let obj = {
      cardId: card.card_id,
      cvc: cvc,
    };
    axiosInstance
      .post("/api/shop/user/billing/check", obj)
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          form.resetFields();
          setModalVisible(false);
          setActiveComponent(
            <ShopCartPaymentProcess
              setActiveTabKey={setActiveTabKey}
              cardId={card.card_id}
            />
          );
        } else {
          message.error("CVC does not match!");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Modal
      title={"Input CVC to confirm the selected card"}
      visible={modalVisible}
      onCancel={handleButton}
      width={"33%"}
      footer={null}
    >
      <Row style={{ width: "100%" }}>
        <Form style={{ width: "100%" }} onFinish={onFinish} form={form}>
          <Form.Item
            style={{ width: "100%" }}
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
          >
            <Input style={{ borderRadius: "35px" }} placeholder="CVC" />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ borderRadius: "35px" }}
              block={true}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </Modal>
  );
};

export default ShopCartSelectCardCvcModal;
