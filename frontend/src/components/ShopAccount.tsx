import { useEffect, useState } from "react";
import AccountLogin from "./account/AccountLogin";
import AccountRegister from "./account/AccountRegister";
import AccountForgot from "./account/AccountForgot";
import { Spin } from "antd";
import AccountOverview from "./account/AccountOverview";
import { axiosInstance } from "./Axios";
import AccountActivation from "./account/AccountActivation";
import AccountPasswordReset from "./account/AccountPasswordReset";
import AccountCodeForPasswordReset from "./account/AccountCodeForPasswordReset";
import { ShopAccountComponents } from "./Enums";

const ShopAccount = ({ setHeader, setUsername }: any) => {
  const [activeTabKey, setActiveTabKey] = useState("");
  const [activeTabComponent, setActiveTabComponent] = useState(
    <Spin size={"large"} tip={"Loading..."} />
  );
  const [code, setCode] = useState("");
  useEffect(() => {
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
        if (activeTabKey === "") {
          setActiveTabKey(ShopAccountComponents.LOGIN.valueOf());
        }
      });
    if (activeTabKey === ShopAccountComponents.LOGIN.valueOf()) {
      setActiveTabComponent(
        <AccountLogin
          setActiveTabKey={setActiveTabKey}
          setHeader={setHeader}
          setUsername={setUsername}
        />
      );
    } else if (activeTabKey === ShopAccountComponents.REGISTER.valueOf()) {
      setActiveTabComponent(
        <AccountRegister setActiveTabKey={setActiveTabKey} />
      );
    } else if (activeTabKey === ShopAccountComponents.FORGOT.valueOf()) {
      setActiveTabComponent(
        <AccountForgot setActiveTabKey={setActiveTabKey} />
      );
    } else if (activeTabKey === ShopAccountComponents.OVERVIEW.valueOf()) {
      setActiveTabComponent(<AccountOverview />);
    } else if (activeTabKey === ShopAccountComponents.ACTIVATION.valueOf()) {
      setActiveTabComponent(
        <AccountActivation setActiveTabKey={setActiveTabKey} />
      );
    } else if (
      activeTabKey === ShopAccountComponents.PASSWORD_RESET.valueOf()
    ) {
      setActiveTabComponent(
        <AccountPasswordReset setActiveTabKey={setActiveTabKey} code={code} />
      );
    } else if (activeTabKey === ShopAccountComponents.CODE_CONFIRM.valueOf()) {
      setActiveTabComponent(
        <AccountCodeForPasswordReset
          setActiveTabKey={setActiveTabKey}
          setCode={setCode}
        />
      );
    }
  }, [activeTabKey, setHeader, setUsername, code]);
  return activeTabComponent;
};

export default ShopAccount;
