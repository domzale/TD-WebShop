import { Button, Row, Col, Card } from "antd";
import { useState } from "react";
import ShopItemModal from "./ShopItemModal";

const { Meta } = Card;

const ShopItemCard = ({ item, trigger, setTrigger, amount }: any) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const onSelect = () => {
    setModalVisible(true);
  };
  const description = (item: any) => {
    return (
      <div>
        <Row>
          <Col span={24} style={{ textAlign: "center", color: "black" }}>
            <p>
              <strong>
                <i>{item.name}</i>
              </strong>
            </p>
          </Col>
        </Row>
        <Row>
          <Col span="12" style={{ color: "black" }}>
            <i>Price</i>
          </Col>
          <Col span="12" style={{ color: "black" }}>
            <i>Discount</i>
          </Col>
        </Row>
        <Row>
          <Col span="12" style={{ color: "black" }}>
            <p>{item.cost}kn</p>
          </Col>
          <Col span="12" style={{ color: "black" }}>
            <p>{parseInt(item.discount)}%</p>
          </Col>
        </Row>
      </div>
    );
  };
  return (
    <Card
      hoverable
      key={item.item_id}
      style={{
        width: 240,
        float: "left",
        marginRight: "1%",
        textAlign: "center",
        height: "450px",
        maxHeight: "450px",
        marginBottom: "10px",
        borderRadius: "35px",
      }}
      cover={
        <img
          alt="example"
          height="240px"
          src={
            amount === 0
              ? "https://easy-groceries.de/wp-content/uploads/2020/03/69079050-out-of-stock-grunge-rubber-stamp-on-white-background-vector-illustration.jpg"
              : item.image
              ? item.image
              : "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-1200x1200.png"
          }
        />
      }
      extra={
        <Button
          style={{ borderRadius: "35px" }}
          type="primary"
          onClick={onSelect}
          block
        >
          More
        </Button>
      }
    >
      <Meta description={description(item)} />
      <ShopItemModal
        itemId={item.item_id}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </Card>
  );
};

export default ShopItemCard;
