import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import { NumberOutlined } from "@ant-design/icons";
import { axiosInstance } from "../Axios";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountActivation = ({ setActiveTabKey }: any) => {
  const onFinish = (values: any) => {
    axiosInstance
      .post("/api/shop/user/activation", values)
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success("Account activation successful!");
          setActiveTabKey(ShopAccountComponents.OVERVIEW.valueOf());
        } else {
          message.error("Activation failed - account already active!");
        }
      })
      .catch(() => {
        message.error(
          "Something went wrong with account activation! Please try again."
        );
      });
  };

  const resendActivationMail = () => {
    axiosInstance
      .get("/api/shop/user/activation/resend")
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success("Activation mail successfully resent!");
        } else {
          message.error("Activation mail resending failed! Please try again.");
        }
      })
      .catch(() => {
        message.error(
          "Something went wrong with mail activation resending! Please try again."
        );
      });
  };

  return (
    <Row>
      <Col span={8} />
      <Col span={8}>
        <Content
          style={{
            paddingTop: "10%",
            height: "100%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Form initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item
              name="activationCode"
              rules={[
                {
                  required: true,
                  message: "Please input the activation code!",
                  len: 6,
                },
              ]}
            >
              <Input
                prefix={<NumberOutlined />}
                placeholder="Activation code"
                style={{ borderRadius: "35px" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                block={true}
                type="primary"
                style={{ borderRadius: "35px" }}
                htmlType="submit"
              >
                Activate account!
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type={"link"} onClick={resendActivationMail}>
                Resend activation mail
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Col>
      <Col span={8} />
    </Row>
  );
};

export default AccountActivation;
