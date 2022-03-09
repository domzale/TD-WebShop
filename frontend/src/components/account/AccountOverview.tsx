import { useEffect, useState } from "react";
import { Col, Layout, Row } from "antd";
import AccountOverviewNormal from "./AccountOverviewNormal";
import AccountBilling from "./AccountBilling";
import AccountOrders from "./AccountOrders";

const { Content } = Layout;

const AccountOverview = () => {
  const [activeComponent, setActiveComponent] = useState(<></>);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  useEffect(() => {
    setActiveComponent(
      <AccountOverviewNormal
        setActiveComponent={setActiveComponent}
        setShowOrderHistory={setShowOrderHistory}
      />
    );
    setShowOrderHistory(true);
  }, []);
  return (
    <div>
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Content style={{ padding: "0 50px" }}>
            <Layout style={{ padding: "24px 0" }}>{activeComponent}</Layout>
          </Content>
        </Col>
        <Col span={1} />
      </Row>
      <Row>
        <Col span={1} />
        <Col span={22}>{showOrderHistory ? <AccountBilling /> : undefined}</Col>
        <Col span={1} />
      </Row>
      <Row>
        <Col span={1} />
        <Col span={22}>{showOrderHistory ? <AccountOrders /> : undefined}</Col>
        <Col span={1} />
      </Row>
    </div>
  );
};

export default AccountOverview;
