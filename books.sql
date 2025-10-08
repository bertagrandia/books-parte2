
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


COPY books.book FROM '/backups/books.csv' DELIMITER ';' CSV HEADER ESCAPE '\' QUOTE '"';

COPY books.users 
FROM '/backups/users.csv' 
DELIMITER ';' 
CSV HEADER 
ESCAPE '\' 
QUOTE '"'
NULL 'NULL'; -- ¡LA CORRECCIÓN!

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
-- 1. Libros publicados en un año concreto
SELECT
    Book_Title,
    Book_Author,
    Publisher
FROM books.book
WHERE Year_Of_Publication = 2005;

-- 2. Número de valoraciones por libro
SELECT
    ISBN,
    COUNT(*) AS total_valoraciones
FROM books.ratings
GROUP BY ISBN
ORDER BY total_valoraciones DESC;

--3. Media de valoración por autor
SELECT
    b.ISBN,
    b.Book_Title,
    AVG(r.book_rating) AS promedio_rating,
    COUNT(r.book_rating) AS total_valoraciones
FROM books.book b
JOIN books.ratings r ON b.ISBN = r.ISBN
GROUP BY b.ISBN, b.Book_Title
ORDER BY promedio_rating DESC;

-- 4. Top de libros por media con un mínimo de votos
WITH libro_valoraciones AS (
    SELECT
        b.ISBN,
        b.Book_Title,
        AVG(r.book_rating) AS promedio_rating,
        COUNT(r.book_rating) AS total_valoraciones
    FROM books.book b
    JOIN books.ratings r ON b.ISBN = r.ISBN
    GROUP BY b.ISBN, b.Book_Title)
SELECT *
FROM libro_valoraciones 
WHERE total_valoraciones >= 50
ORDER BY promedio_rating DESC;

--5. Perfil básico de un usuario
--1-
SELECT User_Id, book_rating
FROM books.ratings;
--2-
SELECT AVG(book_rating) As promedio_perfil
from books.ratings
WHERE User_Id = 276736;
--3-
SELECT 
  COUNT(*) AS total_valoraciones,
  ROUND(AVG(book_rating), 2) AS promedio_valoraciones,
  MIN(rating_date) AS primera_valoracion,
  MAX(rating_date) AS ultima_valoracion
FROM books.ratings
WHERE User_Id = 276736;

--PRUEBAS 5.3
-- SELECT 
--   COUNT(*) AS total_valoraciones,
--   ROUND(AVG(book_rating), 2) AS promedio_valoraciones
-- FROM books.ratings
-- WHERE User_Id = 276736;

-- ALTER TABLE books.ratings
-- ADD COLUMN rating_date DATE;

-- SELECT 
--   COUNT(*) AS total_valoraciones,
--   ROUND(AVG(book_rating), 2) AS promedio_valoraciones,
--   MIN(rating_date) AS primera_valoracion,
--   MAX(rating_date) AS ultima_valoracion
-- FROM books.ratings
-- WHERE User_Id = 276736;

--6. Autores favoritos de un usuario
SELECT 
    b.Book_Author,
    ROUND(AVG(r.book_rating), 2) AS promedio_rating,
    COUNT(*) AS total_valoraciones
FROM books.ratings r
JOIN books.book b ON r.ISBN = b.ISBN
WHERE r.User_ID = 27845  
GROUP BY b.Book_Author
ORDER BY promedio_rating DESC;

-- 7. Recomendación simple de libros similares
SELECT 
    b2.ISBN,
    b2.Book_Title,
    b2.Year_Of_Publication,
    b2.Book_Author
FROM books.book b1
JOIN books.book b2 
    ON b1.Book_Author = b2.Book_Author
WHERE b1.ISBN = '0451200993'
  AND b2.ISBN != b1.ISBN
  AND b2.Year_Of_Publication BETWEEN b1.Year_Of_Publication - 2 AND b1.Year_Of_Publication + 2;

-- (PARA BUSCAR LA AUTORA CON MAS LIBROS )
 --SELECT
--     Book_Author,
--     ISBN
-- FROM books.book
-- WHERE Book_Author = (
--     SELECT Book_Author
--     FROM books.book
--     GROUP BY Book_Author
--     ORDER BY COUNT(*) DESC
--     LIMIT 1
-- );

--8. Distribución de ratings de un libro
SELECT 
    book_rating,
    COUNT(*) AS total
FROM books.ratings
WHERE ISBN = '0971880107'
GROUP BY book_rating
ORDER BY book_rating;


-- SELECT (PARA BUSCAR EL TITULO I ISBN DEL LIBRO CON MAS VALORACIONES)
--     r.ISBN,
--     b.Book_Title,
--     COUNT(*) AS total_votaciones
-- FROM books.ratings r
-- JOIN books.book b ON r.ISBN = b.ISBN
-- GROUP BY r.ISBN, b.Book_Title
-- ORDER BY total_votaciones DESC
-- LIMIT 1;

--9. Tendencia temporal de ratings de un libro

SELECT 
    DATE_TRUNC('month', rating_date) AS mes,
    ROUND(AVG(book_rating), 2) AS promedio_mensual,
    ROUND(AVG(AVG(book_rating)) OVER (
        ORDER BY DATE_TRUNC('month', rating_date)
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS media_movil_3m
FROM books.ratings
WHERE ISBN = '1234567890' 
GROUP BY DATE_TRUNC('month', rating_date)
ORDER BY mes;

--10 Devuelve los N libros mejor valorados (media y número de votos) en un único campo
--JSON con todos sus datos agregados.

SELECT 
    jsonb_build_object(
        'ISBN', b.ISBN,
        'Title', b.Book_Title,
        'Author', b.Book_Author,
        'Year', b.Year_Of_Publication,
        'Publisher', b.Publisher,
        'Image_S', b.Image_URL_S,
        'Image_M', b.Image_URL_M,
        'Image_L', b.Image_URL_L,
        'Average_Rating', ROUND(AVG(r.book_rating), 2),
        'Votes', COUNT(r.book_rating)
    ) AS libro_json
FROM books.book b
JOIN books.ratings r ON b.ISBN = r.ISBN
GROUP BY b.ISBN, b.Book_Title, b.Book_Author, b.Year_Of_Publication, b.Publisher, b.Image_URL_S, b.Image_URL_M, b.Image_URL_L
HAVING COUNT(r.book_rating) > 0
ORDER BY AVG(r.book_rating) DESC
LIMIT 10;  
