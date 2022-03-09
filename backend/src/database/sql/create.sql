CREATE TABLE shop_user (
    user_id bigserial NOT NULL,
    username varchar(32) NOT NULL,
    password varchar(256) NOT NULL,
    salt varchar(32) NOT NULL,
    name varchar(64) NOT NULL,
    surname varchar(64) NOT NULL,
    email varchar(64) NOT NULL,
    complete_address varchar(1024) NOT NULL,
    jwt_hash varchar(32) NOT NULL,
    activation_code integer NOT NULL,
    date_of_register date NOT NULL DEFAULT current_date,

    PRIMARY KEY (user_id)
);

CREATE TABLE shop_item_type (
    item_type_id bigserial NOT NULL,
    name varchar(64) NOT NULL,
    description text NOT NULL,

    PRIMARY KEY (item_type_id)
);

CREATE TABLE shop_item (
    item_id bigserial NOT NULL,
    name varchar(128) NOT NULL,
    description text NOT NULL,
    type bigint NOT NULL,
    amount integer NOT NULL,
    cost decimal NOT NULL,
    discount decimal NOT NULL,
    image varchar(256) NULL,

    PRIMARY KEY (item_id),

    CONSTRAINT item_type_id_fk
    FOREIGN KEY (type)
    REFERENCES shop_item_type (item_type_id)
);

CREATE TABLE shop_order (
    order_id bigserial NOT NULL,
    shop_user_id bigint NOT NULL,
    date_of_order date NOT NULL default current_date,

    PRIMARY KEY (order_id),

    CONSTRAINT shop_user_id_fk
    FOREIGN KEY (shop_user_id)
    REFERENCES shop_user (user_id)
);

CREATE TABLE shop_order_item (
    order_id bigint NOT NULL,
    shop_item_id bigint NOT NULL,
    shop_item_amount integer NOT NULL,

    CONSTRAINT shop_order_id_fk
    FOREIGN KEY (order_id)
    REFERENCES shop_order (order_id),

    CONSTRAINT shop_item_id_fk
    FOREIGN KEY (shop_item_id)
    REFERENCES shop_item (item_id)
);

CREATE TABLE shop_order_status_type (
    status_id bigserial NOT NULL,
    name varchar(64) NOT NULL,
    description varchar(1024) NOT NULL,

    PRIMARY KEY (status_id)
);

CREATE TABLE shop_order_status (
    order_id bigint NOT NULL,
    type_id bigint NOT NULL,
    last_updated timestamp NOT NULL DEFAULT current_timestamp,

    CONSTRAINT order_id_fk
    FOREIGN KEY (order_id)
    REFERENCES shop_order (order_id),

    CONSTRAINT type_id_fk
    FOREIGN KEY (type_id)
    REFERENCES shop_order_status_type (status_id)
);

CREATE TABLE shop_user_card_type (
    type_id bigserial NOT NULL,
    name varchar(24) NOT NULL,
    regex varchar(128) NOT NULL,
    image varchar(512) NOT NULL,

    PRIMARY KEY (type_id)
);

CREATE TABLE shop_user_card (
    card_id bigserial NOT NULL,
    user_id bigint NOT NULL,
    card_number varchar(16) NOT NULL,
    expires date NOT NULL,
    cvc varchar(4) NOT NULL,
    card_type bigint NOT NULL,

    PRIMARY KEY (card_id),
    
    CONSTRAINT user_id_fk
    FOREIGN KEY (user_id)
    REFERENCES shop_user (user_id),

    CONSTRAINT card_type_fk
    FOREIGN KEY (card_type)
    REFERENCES shop_user_card_type (type_id)
);

CREATE TABLE shop_notification_template (
    template_id bigserial NOT NULL,
    title varchar(128) NOT NULL,
    content varchar(1024) NOT NULL,

    PRIMARY KEY (template_id)
);

CREATE TABLE shop_notification_user (
    notification_id bigserial NOT NULL,
    template_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title varchar(128) NOT NULL,
    content varchar(1024) NOT NULL,
    created timestamp NOT NULL DEFAULT current_timestamp,
    read timestamp DEFAULT NULL,

    PRIMARY KEY (notification_id),

    CONSTRAINT template_id_fk
    FOREIGN KEY (template_id)
    REFERENCES shop_notification_template (template_id),

    CONSTRAINT user_id_fk
    FOREIGN KEY (user_id)
    REFERENCES shop_user (user_id)
);