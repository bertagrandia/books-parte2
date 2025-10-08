DROP SCHEMA IF EXISTS books CASCADE;
CREATE SCHEMA IF NOT EXISTS books;

CREATE DOMAIN books.dom_ISBN AS TEXT
    CHECK (length(trim(BOTH FROM value)) > 0 AND length(trim(BOTH FROM value)) <= 20);
	  
CREATE DOMAIN books.dom_year AS INT
      CHECK(VALUE >=0 AND VALUE <= 3000); 
	  
CREATE DOMAIN books.dom_age AS INT
      CHECK (VALUE >= 0 AND VALUE <= 300 OR VALUE IS NULL);
	  
CREATE DOMAIN books.dom_rating AS INT
     CHECK (VALUE >= 0 AND VALUE <= 10);

CREATE TABLE books.book(
    ISBN books.dom_ISBN PRIMARY KEY,
    Book_Title VARCHAR (350),
    Book_Author VARCHAR (150),
    Year_Of_Publication books.dom_year,
    Publisher VARCHAR (150),
    Image_URL_S TEXT,
    Image_URL_M TEXT,
    Image_URL_L TEXT
);

CREATE TABLE books.users(
    User_ID INT PRIMARY KEY,
    Location VARCHAR(255),
    Age books.dom_age
	);

CREATE TABLE books.ratings(
    User_ID INT,
	ISBN books.dom_ISBN,
    book_rating books.dom_rating
);