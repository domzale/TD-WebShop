import { Layout, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "./Axios";
import ShopItemCard from "./home/ShopItemCard";
import ShopItemCategory from "./home/ShopItemCategory";
import { ItemType, Item } from "./Types";

const { Content } = Layout;

function ShopHome({ setActiveTabKey }: any) {
  const [types, setTypes] = useState<ItemType[]>([]);
  const [type, setType] = useState<string>();
  const [items, setItems] = useState<Item[]>();
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    axiosInstance
      .get("/api/shop/item/type")
      .then((result) => {
        setTypes(result.data.types);
      })
      .catch(() => message.error("Something went wrong!"));
  }, []);

  useEffect(() => {
    if (type) {
      axiosInstance
        .get(`/api/shop/item?typeId=${type}`)
        .then((result) => setItems(result.data.items))
        .catch(() => message.error("Something went wrong!"));
    }
  }, [type]);

  const onSelect = (e: any) => {
    setType(e.key);
    window.scrollTo(0, 0);
  };

  return (
    <Row>
      <Col span={24}>
        <Content style={{ padding: "0 50px" }}>
          <Layout style={{ padding: "24px 0" }}>
            <ShopItemCategory
              type={type}
              types={types}
              onSelect={onSelect}
              setActiveTabKey={setActiveTabKey}
              trigger={trigger}
            />
            <Content style={{ padding: "0 24px" }}>
              {type && items ? (
                items.map((item: Item) => {
                  return (
                    <ShopItemCard
                      item={item}
                      key={item.item_id}
                      trigger={trigger}
                      setTrigger={setTrigger}
                      amount={item.amount}
                    />
                  );
                })
              ) : (
                <h2 style={{ paddingLeft: "33%", paddingTop: "10%" }}>
                  Please select a category!
                </h2>
              )}
            </Content>
          </Layout>
        </Content>
      </Col>
    </Row>
  );
}

export default ShopHome;
