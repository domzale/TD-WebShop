import { Modal, Collapse, message, Popconfirm, Button, Empty } from "antd";
import { ExclamationOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { axiosInstance } from "./Axios";
import { NotificationType } from "./Types";

const { Panel } = Collapse;

const ShopNotificationsModal = ({ isModalVisible, setIsModalVisible }: any) => {
  const [notifications, setNotifications] = useState<NotificationType[]>();
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [numberTrigger, setNumberTrigger] = useState(0);
  useEffect(() => {
    if (isModalVisible === true) {
      axiosInstance
        .get("/api/shop/user/notification")
        .then((result) => setNotifications(result.data.notifications))
        .catch(() => message.error("Something went wrong!"));
    }
  }, [isModalVisible, numberTrigger]);
  const onChange = (e: any) => {
    if (e && e > 0) {
      axiosInstance
        .post("/api/shop/user/notification/read", { notificationId: e })
        .then((result) => {
          const { success } = result.data;
          if (success && success === true) {
            setReadNotifications((arr: any) => [...arr, parseInt(e)]);
          }
        })
        .catch(() => message.error("Something went wrong!"));
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        title="My Notifications"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"700px"}
      >
        <Collapse accordion onChange={onChange}>
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: NotificationType) => {
              const split = notification.created.split("T");
              const dateStr = split[0];
              const dateSplitStr = dateStr.split("-");
              const formattedDateStr =
                dateSplitStr[2] + "." + dateSplitStr[1] + "." + dateSplitStr[0];
              const timeStr = split[1].substring(0, split[1].indexOf("."));
              const header = () => {
                return (
                  <div>
                    <p style={{ float: "left" }}>
                      {notification.title} - {formattedDateStr} {timeStr}
                    </p>
                  </div>
                );
              };
              const extra = () => {
                return !notification.read &&
                  !readNotifications?.find(
                    (n: any) =>
                      parseInt(n) === parseInt(notification.notification_id)
                  ) ? (
                  <div style={{ color: "red", fontSize: "8px" }}>
                    <ExclamationOutlined />
                    <p>NEW</p>
                  </div>
                ) : (
                  <Popconfirm
                    key={notification.notification_id}
                    title="Are you sure？"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => {
                      axiosInstance
                        .delete(
                          `/api/shop/user/notification?notificationId=${notification.notification_id}`
                        )
                        .then((result) => {
                          const { success } = result.data;
                          if (success && success === true) {
                            message.success(
                              "Notification successfully deleted!"
                            );
                            setNumberTrigger(numberTrigger + 1);
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
                      icon={<DeleteOutlined />}
                    ></Button>
                  </Popconfirm>
                );
              };
              return (
                <Panel
                  header={header()}
                  extra={extra()}
                  key={notification.notification_id}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: notification.content }}
                  />
                </Panel>
              );
            })
          ) : (
            <Empty style={{ textAlign: "center" }} />
          )}
        </Collapse>
      </Modal>
    </>
  );
};

export default ShopNotificationsModal;
