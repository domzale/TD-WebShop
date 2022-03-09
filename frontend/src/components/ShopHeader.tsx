import { Dropdown, Layout, Menu, message, Button } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  PoweroffOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteAuthHeader, getAuthHeader, getUsername } from "./Axios";
import ShopHome from "./ShopHome";
import ShopAccount from "./ShopAccount";
import ShopCart from "./ShopCart";
import { ShopHeaderComponents } from "./Enums";
import ShopNotificationsModal from "./ShopNotificationsModal";

const { Header } = Layout;

function ShopHeader({ setActiveTabComponent }: any) {
  const [activeTabKey, setActiveTabKey] = useState(
    ShopHeaderComponents.HOME.valueOf()
  );
  const [username, setUsername] = useState<string | undefined>(getUsername());
  const [name, setName] = useState(username);
  const [header, setHeader] = useState<string | undefined>(getAuthHeader());
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (activeTabKey === ShopHeaderComponents.HOME.valueOf()) {
      setActiveTabComponent(<ShopHome setActiveTabKey={setActiveTabKey} />);
    } else if (activeTabKey === ShopHeaderComponents.ACCOUNT.valueOf()) {
      setActiveTabComponent(
        <ShopAccount setHeader={setHeader} setUsername={setUsername} />
      );
    } else if (activeTabKey === ShopHeaderComponents.CART.valueOf()) {
      setActiveTabComponent(<ShopCart setActiveTabKey={setActiveTabKey} />);
    }
    setName(username);
  }, [username, activeTabKey, setActiveTabComponent]);
  const handleMenuClick = (e: any) => {
    if (e.key.toString() === "1") {
      setIsModalVisible(true);
    }
    if (e.key.toString() === "2") {
      deleteAuthHeader();
      setHeader(undefined);
      setUsername(undefined);
      message.success("Logout successful!");
      window.location.reload();
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="1"
        icon={<NotificationOutlined style={{ color: "orange" }} />}
      >
        Notifications
      </Menu.Item>
      <Menu.Item key="2" icon={<PoweroffOutlined style={{ color: "red" }} />}>
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="header">
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ display: "fixed" }}
        defaultSelectedKeys={[activeTabKey]}
        selectedKeys={[activeTabKey]}
      >
        <Menu.Item
          key={ShopHeaderComponents.HOME.valueOf()}
          icon={<HomeOutlined />}
          onClick={() => setActiveTabKey(ShopHeaderComponents.HOME.valueOf())}
        >
          Home
        </Menu.Item>
        <Menu.Item
          key={ShopHeaderComponents.ACCOUNT.valueOf()}
          icon={<UserOutlined />}
          onClick={() =>
            setActiveTabKey(ShopHeaderComponents.ACCOUNT.valueOf())
          }
        >
          Account
        </Menu.Item>
        <Menu.Item
          key={ShopHeaderComponents.CART.valueOf()}
          icon={<ShoppingCartOutlined />}
          onClick={() => setActiveTabKey(ShopHeaderComponents.CART.valueOf())}
        >
          Cart
        </Menu.Item>
        {name && header ? (
          <div style={{ float: "right" }}>
            <Dropdown overlay={menu} placement="topRight">
              <Button
                style={{ borderRadius: "35px" }}
                icon={<UserOutlined />}
                type="primary"
              >
                {name}
              </Button>
            </Dropdown>
          </div>
        ) : undefined}
      </Menu>
      <ShopNotificationsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </Header>
  );
}

export default ShopHeader;
