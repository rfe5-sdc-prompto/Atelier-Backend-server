
CREATE DATABASE rating_reviews;

\c rating_reviews;

CREATE TABLE IF NOT EXISTS reviews (
  review_id serial,
  product_id int not null,
  rating int,
  date text,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name varchar(100),
  reviewer_email text,
  response text,
  helpfulness int,
  PRIMARY KEY(review_id)
);


CREATE TABLE IF NOT EXISTS photos (
  id serial,
  review_id int not null,
  url text,
  PRIMARY KEY(id),
  CONSTRAINT fk_reviews
   FOREIGN KEY(review_id)
      REFERENCES reviews(review_id)
);


CREATE TABLE IF NOT EXISTS characteristic (
  id serial,
  product_id int not null,
  names varchar(100),
  PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS characteristic_reivews (
  id serial,
  characteristic_id int not null,
  review_id int not null,
  value int,
  PRIMARY KEY(id)
);


/*Execute this file from the command line by typing:
 *sudo -i -u postgres psql < schema.sql
 *to create the database and the tables.*/

