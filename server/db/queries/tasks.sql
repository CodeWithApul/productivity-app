CREATE TABLE
    tasks (
        id serial primary key,
        title varchar(100) not null,
        description text,
        dueDate timestamp,
        createdAt timestamp default CURRENT_TIMESTAMP,
        status varchar(20)
    );