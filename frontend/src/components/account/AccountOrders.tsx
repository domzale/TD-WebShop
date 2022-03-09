import { Descriptions, Layout, Col, Row, message, Button } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { Order } from "../Types";
import AccountOrderAdditionalInfo from "./AccountOrderAdditionalInfo";
import { LoadingOutlined } from "@ant-design/icons";
import AccountOrdersPagination from "./AccountOrdersPagination";

const { Content } = Layout;

const AccountOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  useEffect(() => {
    let idx = (page - 1) * 5;
    if (idx > orders.length) {
      idx = orders.length - 1;
    }
    setCurrentOrders(orders.slice(idx, idx + 5));
  }, [page, orders]);
  useEffect(() => {
    axiosInstance
      .get("/api/shop/user/order/history")
      .then((result) => {
        setOrders(result.data.orders);
        setPage(1);
      })
      .catch(() => message.error("Something went wrong!"));
  }, []);
  return (
    <Content style={{ padding: "0 50px" }}>
      <Layout style={{ padding: "24px 0" }}>
        <Descriptions
          title="Order History"
          bordered
          labelStyle={{ backgroundColor: "#e6f7ff" }}
          contentStyle={{ backgroundColor: "white" }}
        >
          {currentOrders && currentOrders.length > 0 ? (
            currentOrders.map((order) => {
              const name: string = "Order Info (ID: #" + order.order_id + ")";
              const date = order.date_of_order
                .substring(0, order.date_of_order.indexOf("T"))
                .replaceAll("-", "/");
              return (
                <Descriptions.Item label={name} span={3} key={order.order_id}>
                  <Row>
                    <Col span={8}>
                      <p>
                        <strong>Date</strong>
                      </p>
                      <p>
                        <i>{date}</i>
                      </p>
                    </Col>
                    <Col span={8}>
                      <p>
                        <strong>Price</strong>
                      </p>
                      <p>
                        <i>{order.cost}kn</i>
                      </p>
                    </Col>
                    <Col span={8}>
                      <p>
                        <strong>Status</strong>
                      </p>
                      <p>
                        <i>
                          {order.name}
                          <Button
                            style={{
                              color: "#1890ff",
                              borderColor: "white",
                              backgroundColor: "white",
                            }}
                            disabled
                          >
                            <LoadingOutlined />{" "}
                          </Button>
                        </i>
                      </p>
                    </Col>
                  </Row>
                  <AccountOrderAdditionalInfo orderId={order.order_id} />
                </Descriptions.Item>
              );
            })
          ) : (
            <p>No orders found.</p>
          )}
        </Descriptions>
        <AccountOrdersPagination
          totalOrders={orders.length}
          page={page}
          setPage={setPage}
        />
      </Layout>
    </Content>
  );
};

export default AccountOrders;
