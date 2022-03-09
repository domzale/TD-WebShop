import { Button, Descriptions, message } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { ErrorMessages } from "../Errors";
import { AccountInfo } from "../Types";
import AccountOverviewEdit from "./AccountOverviewEdit";

const AccountOverviewNormal = ({
  setActiveComponent,
  setShowOrderHistory,
}: any) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  useEffect(() => {
    axiosInstance
      .get("/api/shop/user/info")
      .then((result) => {
        const { success } = result.data;
        if (success && success === true) {
          const { info } = result.data;
          if (info) {
            setAccountInfo(info);
          } else {
            setAccountInfo(undefined);
          }
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
            message.error("User info retreival failed!");
          }
        }
      });
  }, []);
  return (
    <Descriptions
      title="Account Info"
      bordered
      labelStyle={{ backgroundColor: "#e6f7ff" }}
      contentStyle={{ backgroundColor: "white" }}
      extra={
        <Button
          style={{ borderRadius: "35px" }}
          type="primary"
          onClick={() =>
            setActiveComponent(
              <AccountOverviewEdit
                setActiveComponent={setActiveComponent}
                setShowOrderHistory={setShowOrderHistory}
                email={accountInfo?.email}
                address={accountInfo?.address}
              />
            )
          }
        >
          Edit
        </Button>
      }
    >
      <Descriptions.Item label="Username" span={3}>
        {accountInfo?.username}
      </Descriptions.Item>
      <Descriptions.Item label="Email" span={3}>
        {accountInfo?.email}
      </Descriptions.Item>
      <Descriptions.Item label="First Name" span={3}>
        {accountInfo?.name}
      </Descriptions.Item>
      <Descriptions.Item label="Last Name" span={3}>
        {accountInfo?.surname}
      </Descriptions.Item>
      <Descriptions.Item label="Complete Address" span={3}>
        {accountInfo?.address}
      </Descriptions.Item>
      <Descriptions.Item label="Total Orders" span={3}>
        {accountInfo && accountInfo?.orders > 0 ? accountInfo?.orders : 0}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default AccountOverviewNormal;
