import { Form, Input, Button, Layout, Row, Col, message } from "antd";
import { NumberOutlined } from "@ant-design/icons";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import { ShopAccountComponents } from "../Enums";

const { Content } = Layout;

const AccountCodeForPasswordReset = ({ setActiveTabKey, setCode }: any) => {
  const onFinish = (values: any) => {
    axiosInstance
      .post("/api/shop/user/code", values)
      .then((result) => {
        const { success } = result.data;
        if (success) {
          message.success(
            "Code confirmed! Please proceed with resetting your password."
          );
          setCode(values["code"]);
          setActiveTabKey(ShopAccountComponents.PASSWORD_RESET.valueOf());
        } else {
          message.error("Confirmation code not found! Please try again");
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
            message.error("Code confirmation failed! Please try again.");
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
              name="code"
              rules={[
                { required: true, message: "Please input the code!" },
                { len: 6, message: "Please input exactly 6 characters!" },
              ]}
            >
              <Input
                prefix={<NumberOutlined />}
                style={{ borderRadius: "35px" }}
                placeholder="Code"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block={true}
                style={{ borderRadius: "35px" }}
                type="primary"
                htmlType="submit"
              >
                Confirm
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type={"link"} onClick={() => setActiveTabKey("3")}>
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

export default AccountCodeForPasswordReset;
