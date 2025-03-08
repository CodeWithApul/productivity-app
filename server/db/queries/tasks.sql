CREATE TABLE
    tasks (
        id serial primary key,
        title varchar(100) not null,
        description text,
        duedate timestamp,
        createdAt timestamp default CURRENT_TIMESTAMP,
        status varchar(20)
    );

ALTER TABLE tasks
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);