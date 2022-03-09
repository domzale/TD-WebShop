import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  axiosInstance,
  deleteAuthHeader,
  getAuthHeader,
  setAuthHeader,
} from "../Axios";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountLogin = ({ setActiveTabKey, setUsername, setHeader }: any) => {
  const onFinish = async (values: any) => {
    axiosInstance
      .post("/api/shop/login", values)
      .then((result) => {
        const { token } = result.data;
        if (token && token.toString().length > 0) {
          setUsername(values["username"]);
          setAuthHeader(values["username"], token.toString());
          setHeader(getAuthHeader());
          message.success("Login successful!");
          axiosInstance
            .get("/api/shop/user/active")
            .then((result) => {
              const { active } = result.data;
              if (!active || active === false) {
                setActiveTabKey(ShopAccountComponents.ACTIVATION.valueOf());
              } else {
                setActiveTabKey(ShopAccountComponents.OVERVIEW.valueOf());
              }
            })
            .catch(() => {
              message.error("Something went wrong!");
              deleteAuthHeader();
              setUsername(undefined);
              setHeader(undefined);
              setActiveTabKey(ShopAccountComponents.LOGIN.valueOf());
            });
        } else {
          message.error("Login failed!");
        }
      })
      .catch(() => {
        message.error("Login failed!");
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
                style={{ borderRadius: "35px" }}
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block={true}
                style={{ borderRadius: "35px" }}
                type="primary"
                htmlType="submit"
              >
                Log in
              </Button>{" "}
            </Form.Item>
            <Form.Item>
              <Button
                type={"link"}
                onClick={() =>
                  setActiveTabKey(ShopAccountComponents.REGISTER.valueOf())
                }
              >
                Register now!
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type={"link"}
                onClick={() =>
                  setActiveTabKey(ShopAccountComponents.FORGOT.valueOf())
                }
              >
                Forgot password?
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Col>
      <Col span={8} />
    </Row>
  );
};

export default AccountLogin;
