import { Card, Row, Col, message, Button } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { CardType } from "../Types";
import ShopCartSelectCardCvcModal from "./ShopCartSelectCardCvcModal";

const { Meta } = Card;

const ShopCartSelectCard = ({ setActiveComponent, setActiveTabKey }: any) => {
  const [cards, setCards] = useState<CardType[]>();
  useEffect(() => {
    axiosInstance
      .get("/api/shop/user/billing")
      .then((result) => setCards(result.data.cards))
      .catch(() => message.error("Something went wrong!"));
  }, []);
  const description = (card: any) => {
    return (
      <div>
        <Row>
          <Col span="24">
            <strong>Card Number</strong>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <i>{card.card_number}</i>
          </Col>
        </Row>
      </div>
    );
  };
  const SubComponent = ({ card }: any) => {
    const [modalVisible, setModalVisible] = useState(false);
    const onSelect = () => {
      setModalVisible(true);
    };
    return (
      <div>
        <Card
          hoverable
          key={card.card_id}
          style={{
            width: 240,
            float: "left",
            marginRight: "1%",
            textAlign: "center",
            height: "375px",
            maxHeight: "375px",
            marginBottom: "10px",
            borderRadius: "35px",
          }}
          cover={
            <img
              alt="example"
              src={card.image}
              style={{ height: "200px", width: "100%" }}
            />
          }
          extra={
            <Button
              style={{ borderRadius: "35px" }}
              type="primary"
              onClick={onSelect}
              block
            >
              Select
            </Button>
          }
        >
          <Meta description={description(card)} />
        </Card>
        <ShopCartSelectCardCvcModal
          card={card}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setActiveComponent={setActiveComponent}
          setActiveTabKey={setActiveTabKey}
        />
      </div>
    );
  };
  return (
    <div>
      {cards?.map((card: any) => {
        return <SubComponent card={card} />;
      })}
    </div>
  );
};

export default ShopCartSelectCard;
