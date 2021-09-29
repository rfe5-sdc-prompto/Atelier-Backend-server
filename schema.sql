DROP TABLE IF EXISTS rating_reviews;
CREATE DATABASE rating_reviews;

\c rating_reviews;

CREATE TABLE IF NOT EXISTS reviews (
  review_id int not null,
  rating int,
  summary text,
  recommend boolean,
  response text,
  body text,
  date date,
  reviewer_name varchar(100),
  helpfulness int,
  PRIMARY KEY(review_id)
);


CREATE TABLE IF NOT EXISTS photos (
  id int not null,
  url text,
  review_id int not null,
  PRIMARY KEY(id),
  CONSTRAINT fk_reviews
   FOREIGN KEY(review_id)
      REFERENCES reviews(review_id)
);


/*Execute this file from the command line by typing:
 *sudo -i -u postgres psql < schema.sql
 *to create the database and the tables.*/

