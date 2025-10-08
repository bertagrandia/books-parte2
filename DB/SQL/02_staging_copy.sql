COPY books.book FROM '/backups/books.csv' DELIMITER ';' CSV HEADER ESCAPE '\' QUOTE '"';

COPY books.users 
FROM '/backups/users.csv' 
DELIMITER ';' 
CSV HEADER 
ESCAPE '\' 
QUOTE '"'
NULL 'NULL';

COPY books.ratings(User_ID, ISBN, book_rating)
FROM '/backups/ratings.csv'
DELIMITER ';'
CSV HEADER
ESCAPE '\'
QUOTE '"';


ALTER TABLE books.ratings 
    ADD CONSTRAINT fk_user_id FOREIGN KEY (User_ID) REFERENCES books.users(User_ID),
    ADD CONSTRAINT fk_isbn FOREIGN KEY (ISBN) REFERENCES books.book(ISBN)
    NOT VALID;

-- (AGREGAR COLUMNA DE FECHA DE VALORACIÓN)
ALTER TABLE books.ratings
 ADD COLUMN rating_date DATE;

--SELECT count(*) FROM books.book;
--SELECT * FROM books.book LIMIT 5;
--SELECT * FROM books.ratings LIMIT 5;