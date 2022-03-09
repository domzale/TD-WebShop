import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ErrorMessages } from "../Errors";
import { axiosInstance } from "../Axios";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountRegister = ({ setActiveTabKey }: any) => {
  const onFinish = async (values: any) => {
    const { password, confirmPassword } = values;
    if (password.toString() !== confirmPassword.toString()) {
      message.error("Passwords must match!");
      return;
    }
    axiosInstance
      .post("/api/shop/register", values)
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success("Registration successful!");
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
            message.error("Registration failed! Please try again.");
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
            <Row>
              <Col span={12}>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                    { min: 2, message: "Please input at least 2 characters!" },
                    { max: 16, message: "Please input at max 16 characters!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    style={{ borderRadius: "35px" }}
                    placeholder="Name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="surname"
                  rules={[
                    { required: true, message: "Please input your surname!" },
                    { min: 2, message: "Please input at least 2 characters!" },
                    { max: 32, message: "Please input at max 32 characters!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    style={{ borderRadius: "35px" }}
                    placeholder="Surname"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              style={{ borderRadius: "35px" }}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 6, message: "Please input at least 6 characters!" },
                { max: 18, message: "Please input at max 18 characters!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                style={{ borderRadius: "35px" }}
                placeholder="Username"
              />
            </Form.Item>
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
                style={{ borderRadius: "35px" }}
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
                style={{ borderRadius: "35px" }}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { min: 6, message: "Please input at least 6 characters!" },
                { max: 64, message: "Please input at max 64 characters!" },
                {
                  pattern:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid format!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                style={{ borderRadius: "35px" }}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="completeAddress"
              rules={[
                {
                  required: true,
                  message: "Please input your complete address!",
                },
                {
                  min: 32,
                  message: "Please input at least 32 characters!",
                },
                {
                  max: 128,
                  message: "Please input at max 128 characters!",
                },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                style={{ borderRadius: "35px" }}
                placeholder="Complete address"
              />
            </Form.Item>
            <br />
            <Form.Item>
              <Button
                block={true}
                style={{ borderRadius: "35px" }}
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type={"link"}
                onClick={() =>
                  setActiveTabKey(ShopAccountComponents.LOGIN.valueOf())
                }
              >
                Back to log in!
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Col>
      <Col span={8} />
    </Row>
  );
};

export default AccountRegister;
