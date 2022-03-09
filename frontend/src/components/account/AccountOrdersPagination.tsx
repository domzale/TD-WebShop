import { Button, Row, Col } from "antd";
import {
  ForwardOutlined,
  BackwardOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const AccountOrdersPagination = ({ totalOrders, page, setPage }: any) => {
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    if (totalOrders % 5 === 0) {
      setTotalPages(Math.floor(totalOrders / 5));
    } else {
      setTotalPages(Math.floor(totalOrders / 5) + 1);
    }
  }, [totalOrders]);
  const onFirst = () => {
    setPage(1);
  };
  const onLast = () => {
    if (totalOrders % 5 === 0) {
      setPage(Math.floor(totalOrders / 5));
    } else {
      setPage(Math.floor(totalOrders / 5) + 1);
    }
  };
  const onLeft = () => {
    if (page - 1 <= 0) {
      setPage(1);
    } else {
      setPage(page - 1);
    }
  };
  const onRight = () => {
    if (page + 1 > totalPages) {
      setPage(totalPages);
    } else {
      setPage(page + 1);
    }
  };
  return (
    <Row>
      <Col span={11} />
      <Col span={8}>
        {totalPages === 0 ? undefined : (
          <Row>
            <Button icon={<BackwardOutlined />} onClick={onFirst}></Button>
            <Button icon={<CaretLeftOutlined />} onClick={onLeft}></Button>
            <p
              style={{
                textAlign: "center",
                paddingTop: "5px",
                paddingLeft: "5px",
                paddingRight: "5px",
                paddingBottom: "5px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
            >
              {page} / {totalPages}
            </p>
            <Button icon={<CaretRightOutlined />} onClick={onRight}></Button>
            <Button icon={<ForwardOutlined />} onClick={onLast}></Button>
          </Row>
        )}
      </Col>
      <Col span={5} />
    </Row>
  );
};

export default AccountOrdersPagination;
