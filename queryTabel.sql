/*
 eksekusi query ini untuk membuat tabel
*/

CREATE TABLE users (
  id serial NOT NULL PRIMARY KEY,
  username VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post (
  id serial NOT NULL PRIMARY KEY,
  isi TEXT NOT NULL,
  gambar VARCHAR(250),
  cloudinary_id VARCHAR(250),
  users_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE komentar (
  id serial NOT NULL PRIMARY KEY,
  isi TEXT NOT NULL,
  users_id int NOT NULL,
  post_id int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);