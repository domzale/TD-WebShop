type ItemType = {
  item_type_id: string;
  name: string;
  description: string;
};

type Item = {
  item_id: string;
  name: string;
  description: string;
  cost: string;
  discount: string;
  image: string;
  amount: number;
};

type CardType = {
  card_id: string;
  card_number: string;
  expires: string;
  cvc: string;
  image: string;
};

type Order = {
  order_id: string;
  date_of_order: string;
  name: string;
  cost: string;
};

type AdditionalInfo = {
  id: string;
  key: string;
  name: string;
  cost: string;
  discount: string;
  amount: string;
  total: string;
};

type AccountInfo = {
  username: string;
  email: string;
  name: string;
  surname: string;
  address: string;
  orders: number;
};

type NotificationType = {
  notification_id: string;
  template_id: string;
  user_id: string;
  title: string;
  content: string;
  created: string;
  read: string;
};

export type {
  ItemType,
  Item,
  CardType,
  Order,
  AdditionalInfo,
  AccountInfo,
  NotificationType,
};
