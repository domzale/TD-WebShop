import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import ShopCartTable from "./ShopCartTable";

const ShopCartMain = ({ setActiveTabKey }: any) => {
  const [activeComponent, setActiveComponent] = useState(
    <Spin size={"large"} tip={"Loading..."} />
  );
  useEffect(() => {
    setActiveComponent(
      <ShopCartTable
        setActiveComponent={setActiveComponent}
        setActiveTabKey={setActiveTabKey}
      />
    );
  }, [setActiveTabKey]);
  return (
    <Row>
      <Col span={24}>{activeComponent}</Col>
    </Row>
  );
};

export default ShopCartMain;
