import "antd/dist/antd.css";

import { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import ShopHeader from "./components/ShopHeader";
import ShopFooter from "./components/ShopFooter";
import {
  getAuthHeader,
  axiosInstance,
  deleteAuthHeader,
} from "./components/Axios";

function App() {
  const [activeTabComponent, setActiveTabComponent] = useState(
    <Spin size={"large"} tip={"Loading..."} />
  );
  useEffect(() => {
    const callback = () => {
      if (getAuthHeader() !== undefined) {
        axiosInstance
          .get("/api/user/test/auth")
          .then(() => {})
          .catch(() => {
            deleteAuthHeader();
            window.location.reload();
          });
      }
      setTimeout(callback, 5000);
    };
    callback();
  }, []);
  return (
    <Layout>
      <ShopHeader setActiveTabComponent={setActiveTabComponent} />
      {activeTabComponent}
      <ShopFooter />
    </Layout>
  );
}

export default App;
