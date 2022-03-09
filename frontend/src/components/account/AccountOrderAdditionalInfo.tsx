import { Collapse, Col, Row, Table, message } from "antd";
import { useState } from "react";
import { axiosInstance } from "../Axios";
import { AdditionalInfo } from "../Types";

const { Panel } = Collapse;

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
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Price",
    dataIndex: "total",
    key: "total",
  },
];

const AccountOrderAdditionalInfo = ({ orderId }: any) => {
  const [info, setInfo] = useState<AdditionalInfo>();
  const onChange = (e: any) => {
    if (e && e.length > 0) {
      axiosInstance
        .get(`/api/shop/user/order/info?orderId=${e}`)
        .then((result) => setInfo(result.data.info))
        .catch(() =>
          message.error("Something went wrong while fetching details!")
        );
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Collapse onChange={onChange}>
          <Panel header="Additional Information" key={orderId}>
            <Table
              columns={columns}
              dataSource={info as any}
              bordered
              pagination={false}
            />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
};

export default AccountOrderAdditionalInfo;
