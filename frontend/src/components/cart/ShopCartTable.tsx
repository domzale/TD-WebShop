import { Col, Row, Table, message, Button, Popconfirm, Statistic } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../Axios";
import { AdditionalInfo } from "../Types";
import { DeleteOutlined } from "@ant-design/icons";
import ShopCartTableItemAmount from "./ShopCartTableItemAmount";
import ShopCartTableItemPrice from "./ShopCartTableItemPrice";
import ShopCartCheckout from "./ShopCartCheckout";

const ShopCartTable = ({ setActiveComponent, setActiveTabKey }: any) => {
  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Amount",
      render: (e: AdditionalInfo) => (
        <ShopCartTableItemAmount
          item={e}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          refreshPriceTrigger={refreshPriceTrigger}
          setRefreshPriceTrigger={setRefreshPriceTrigger}
        />
      ),
    },
    {
      title: "Price",
      render: (e: AdditionalInfo) => (
        <ShopCartTableItemPrice
          item={e}
          refreshPriceTrigger={refreshPriceTrigger}
        />
      ),
    },
    {
      title: "Action",
      render: (e: any) => (
        <div>
          <Popconfirm
            key={e.id}
            title="Are you sure？"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              axiosInstance
                .delete(`/api/shop/user/cart/delete?itemId=${e.id}`)
                .then((result) => {
                  const { success } = result.data;
                  if (success && success === true) {
                    message.success("Item successfully deleted from the cart!");
                    refreshList();
                  }
                })
                .catch(() => {
                  message.error("Something went wrong!");
                });
            }}
          >
            <Button
              style={{ borderRadius: "35px" }}
              danger
              block
              icon={<DeleteOutlined />}
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [info, setInfo] = useState<AdditionalInfo[]>();
  const [isEditing, setIsEditing] = useState(false);
  const [refreshPriceTrigger, setRefreshPriceTrigger] = useState(0);
  const [totalValue, setTotalValue] = useState("0kn");
  useEffect(() => refreshList(), [refreshPriceTrigger]);

  const refreshList = () => {
    axiosInstance
      .get(`/api/shop/user/cart/info`)
      .then((result) => setInfo(result.data.info))
      .catch(() =>
        message.error("Something went wrong while fetching cart details!")
      );
    axiosInstance
      .get("/api/shop/user/cart/total")
      .then((result) => {
        const { success, total } = result.data;
        if (success && success === true && total !== "kn") {
          setTotalValue(total);
        } else {
          setTotalValue("0kn");
        }
      })
      .catch(() =>
        message.error(
          "Something went wrong while fetching total price of items in cart!"
        )
      );
  };
  const handleCheckout = () => {
    axiosInstance
      .get("/api/shop/user/billing/count")
      .then((result) => {
        const { success, count } = result.data;
        if (success && success === true && count) {
          if (parseInt(count) === 0) {
            message.warn(
              "You don't have any credit cards added! To be able to checkout the items in your cart, please go to 'Account' tab and add a card."
            );
            return;
          } else {
            setActiveComponent(
              <ShopCartCheckout
                setActiveComponent={setActiveComponent}
                setActiveTabKey={setActiveTabKey}
              />
            );
          }
        }
      })
      .catch(() => message.error("Something went wrong!"));
  };

  return (
    <Row>
      <Col span={24}>
        <Table
          title={() => (
            <div>
              <h1 style={{ float: "left" }}>Your Shopping Cart Details</h1>
              {info && info.length > 0 ? (
                <Button
                  type="primary"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    borderRadius: "35px",
                  }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              ) : undefined}
            </div>
          )}
          columns={columns}
          dataSource={info as any}
          bordered
          pagination={false}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <Statistic
                      title="Total Shopping Cart Price"
                      value={totalValue}
                      style={{
                        float: "right",
                      }}
                    />
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Col>
    </Row>
  );
};

export default ShopCartTable;
