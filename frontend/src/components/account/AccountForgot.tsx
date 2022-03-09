import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountForgot = ({ setActiveTabKey }: any) => {
  const onFinish = (values: any) => {
    axiosInstance
      .post("/api/shop/user/forgot", values)
      .then((result) => {
        const { success } = result.data;
        if (success === true) {
          message.success("Code has been sent to the given mail address.");
          setActiveTabKey(ShopAccountComponents.CODE_CONFIRM.valueOf());
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
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your e-mail address!",
                },
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
                placeholder="E-mail"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block={true}
                style={{ borderRadius: "35px" }}
                type="primary"
                htmlType="submit"
              >
                Send code
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type={"link"}
                onClick={() =>
                  setActiveTabKey(ShopAccountComponents.CODE_CONFIRM.valueOf())
                }
              >
                Already have the code?
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

export default AccountForgot;
