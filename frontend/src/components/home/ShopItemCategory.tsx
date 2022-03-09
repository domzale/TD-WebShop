import { Affix, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import ShopHomeSmallCart from "./ShopHomeSmallCart";

const { Sider } = Layout;

const ShopItemCategory = ({
  types,
  type,
  onSelect,
  setActiveTabKey,
  trigger,
}: any) => {
  const [showSmallCart, setShowSmallCart] = useState(false);
  useEffect(() => {
    axiosInstance
      .get("/api/user/test/auth")
      .then(() => setShowSmallCart(true))
      .catch(() => setShowSmallCart(false));
  }, []);
  return (
    <Affix offsetTop={10}>
      <Sider width={200} style={{ maxHeight: "447px", borderRadius: "35px" }}>
        <Menu
          mode="inline"
          selectedKeys={[type ? type : "0"]}
          style={{ height: "100%", borderRadius: "35px" }}
          onSelect={onSelect}
        >
          <Menu.Item disabled={true}>
            <p style={{ color: "black" }}>
              <strong>Categories:</strong>
            </p>
          </Menu.Item>
          {types && types.length > 0
            ? types.map((t: any) => {
                return (
                  <Menu.Item
                    style={{ borderRadius: "35px" }}
                    key={t.item_type_id}
                  >
                    <i>{t.name}</i>
                  </Menu.Item>
                );
              })
            : undefined}
          {showSmallCart ? (
            <Menu.Item
              style={{ height: "150px", paddingTop: "15px" }}
              disabled={true}
            >
              <ShopHomeSmallCart
                setActiveTabKey={setActiveTabKey}
                trigger={trigger}
              />
            </Menu.Item>
          ) : undefined}
        </Menu>
      </Sider>
    </Affix>
  );
};

export default ShopItemCategory;
