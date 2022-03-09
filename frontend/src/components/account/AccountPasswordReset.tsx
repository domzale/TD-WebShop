import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountPasswordReset = ({ setActiveTabKey, code }: any) => {
  const onFinish = (values: any) => {
    const { password, confirmPassword } = values;
    if (password.toString() !== confirmPassword.toString()) {
      message.error("Passwords must match!");
      return;
    }
    const obj = {
      password: password,
      code: code,
    };
    axiosInstance
      .post("/api/shop/user/reset", obj)
      .then((result) => {
        const { success } = result.data;
        if (success) {
          message.success("Password successfully reset! Please try to log in.");
          setActiveTabKey(ShopAccountComponents.LOGIN.valueOf());
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
            message.error("Password reset failed! Please try again.");
          }
        }
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
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Please input at least 8 characters!" },
                { max: 32, message: "Please input at max 32 characters!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: "Please re-type your password!" },
                { min: 8, message: "Please input at least 8 characters!" },
                { max: 32, message: "Please input at max 32 characters!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Item>
            <Form.Item>
              <Button block={true} type="primary" htmlType="submit">
                Reset password
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type={"link"}
                onClick={() => ShopAccountComponents.CODE_CONFIRM.valueOf()}
              >
                Back to previous screen!
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Col>
      <Col span={8} />
    </Row>
  );
};

export default AccountPasswordReset;
