import { Spin, Layout } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "./Axios";
import ShopCartMain from "./cart/ShopCartMain";

const { Content } = Layout;

function ShopCart({ setActiveTabKey }: any) {
  const [activeComponent, setActiveComponent] = useState(
    <Spin size={"large"} tip={"Loading..."} />
  );
  useEffect(() => {
    axiosInstance
      .get("/api/user/test/auth")
      .then(() =>
        setActiveComponent(<ShopCartMain setActiveTabKey={setActiveTabKey} />)
      )
      .catch(() =>
        setActiveComponent(
          <h1 style={{ textAlign: "center", paddingTop: "50px" }}>
            Only logged in users can use the shopping cart!
          </h1>
        )
      );
  }, [setActiveTabKey]);
  return (
    <Content style={{ padding: "0 50px" }}>
      <Layout style={{ padding: "24px 0" }}>{activeComponent}</Layout>
    </Content>
  );
}

export default ShopCart;
