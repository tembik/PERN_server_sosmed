buka terminal login ke user postgres:
sudo su - postgres

ketik 'psql'
ketik '\conninfo' untuk info


for help \?

list database \l

list table \d

list detail table \d nama_table

connect to database = \c database_name

CREATE DATABASE database_name

DROP DATABASE database_name

CREATE TABLE products (
    id INTEGER,
    name VARCHAR(50),
    price INTEGER
)

CREATE TABLE products (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL
)

DROP TABLE products

ALTER TABLE products ADD COLUMN featured BOOLEAN

ALTER TABLE products DROP COLUMN featured

INSERT INTO products(id, name, price) VALUES(1, 'coba coba', 20)

INSERT INTO products(name, price) VALUES('coba coba2', 40)

UPDATE products SET name = 'test', price = 30 WHERE id = 1 RETURNING *
UPDATE users SET username = 'test' WHERE id = 2

SELECT * FROM products

SELECT * FROM products WHERE id = 1

SELECT name, price FROM products

DELETE FROM products WHERE id = 1

/*
 one to many: user has many post
*/

CREATE TABLE users (
  id serial NOT NULL PRIMARY KEY,
  username VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
SELECT * FROM users ORDER BY created_at DESC
UPDATE users SET username = 'kimbet_updated' WHERE id = 4

INSERT INTO users(username, password) VALUES('kimbet', 'kimbet123')

CREATE TABLE post (
  id serial NOT NULL PRIMARY KEY,
  isi TEXT NOT NULL,
  gambar VARCHAR(250),
  cloudinary_id VARCHAR(250),
  users_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO post(isi, gambar, users_id) VALUES('isi post 1', 'gambar post', 1)
ALTER TABLE post ADD COLUMN cloudinary_id VARCHAR(250)

CREATE TABLE komentar (
  id serial NOT NULL PRIMARY KEY,
  isi TEXT NOT NULL,
  users_id int NOT NULL,
  post_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);
INSERT INTO komentar(isi, users_id, post_id) VALUES('isi post 1', 1, 1)


SELECT * FROM post FULL JOIN users ON post.users_id = users.id
SELECT judul, isi, username FROM post LEFT OUTER JOIN users ON post.users_id = users.id ORDER BY post.created_at DESC