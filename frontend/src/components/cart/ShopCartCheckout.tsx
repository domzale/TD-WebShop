import { Button, Col, Row } from "antd";
import ShopCartSelectCard from "./ShopCartSelectCard";
import ShopCartTable from "./ShopCartTable";

const ShopCartCheckout = ({ setActiveComponent, setActiveTabKey }: any) => {
  return (
    <Row>
      <Col span="6" style={{ textAlign: "center" }}>
        <h1>Please select a card that will be used for the payment.</h1>
      </Col>
      <Col span="14">
        <ShopCartSelectCard
          setActiveComponent={setActiveComponent}
          setActiveTabKey={setActiveTabKey}
        />
      </Col>
      <Col span="4">
        <Button
          block
          style={{ borderRadius: "35px" }}
          type="primary"
          onClick={() =>
            setActiveComponent(
              <ShopCartTable setActiveComponent={setActiveComponent} />
            )
          }
        >
          Back to cart!
        </Button>
      </Col>
    </Row>
  );
};

export default ShopCartCheckout;
