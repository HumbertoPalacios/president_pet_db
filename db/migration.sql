DROP TABLE IF EXISTS president;
DROP TABLE IF EXISTS pet;

CREATE TABLE president(
   presidentId SERIAL PRIMARY KEY,
   chronologicalNumber INT,
   fullName TEXT,
   startYear INT,
   endYear INT,
   hadPets BOOLEAN
);

CREATE TABLE pet(
    petId SERIAL PRIMARY KEY,
    fullName TEXT,
    species TEXT,
    presidentId INT,
    FOREIGN KEY (presidentId) REFERENCES president(presidentId)
);