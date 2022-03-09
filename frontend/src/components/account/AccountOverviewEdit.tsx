import { Button, Descriptions, Input, Form, message } from "antd";
import { useEffect } from "react";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import AccountOverviewNormal from "./AccountOverviewNormal";

const AccountOverviewEdit = ({
  setActiveComponent,
  setShowOrderHistory,
  email,
  address,
}: any) => {
  useEffect(() => {
    setShowOrderHistory(false);
  }, [setShowOrderHistory]);
  const onFinish = async (values: any) => {
    axiosInstance
      .post("/api/shop/user/update", values)
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          message.success("Email and complete address successfully updated!");
          setActiveComponent(
            <AccountOverviewNormal
              setActiveComponent={setActiveComponent}
              setShowOrderHistory={setShowOrderHistory}
            />
          );
          setShowOrderHistory(true);
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
            message.error("Account details update failed!");
          }
        }
      });
  };
  return (
    <Form
      initialValues={{ email: email, completeAddress: address }}
      onFinish={onFinish}
    >
      <Descriptions
        title="Account Edit"
        bordered
        labelStyle={{ backgroundColor: "#e3e6e4" }}
        contentStyle={{ backgroundColor: "white" }}
        extra={
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
                setActiveComponent(
                  <AccountOverviewNormal
                    setActiveComponent={setActiveComponent}
                    setShowOrderHistory={setShowOrderHistory}
                  />
                );
                setShowOrderHistory(true);
              }}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <Descriptions.Item label="Email" span={3}>
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
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>
        </Descriptions.Item>
        <Descriptions.Item label="Complete Address" span={3}>
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
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>
        </Descriptions.Item>
      </Descriptions>
    </Form>
  );
};

export default AccountOverviewEdit;
