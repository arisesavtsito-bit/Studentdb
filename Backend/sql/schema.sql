CREATE TABLE IF NOT EXISTS utilisateurs (
    id           SERIAL PRIMARY KEY,
    email        VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    cree_le      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etudiants (
    id             SERIAL PRIMARY KEY,
    nom            VARCHAR(100) NOT NULL,
    prenom         VARCHAR(100) NOT NULL,
    email          VARCHAR(255) UNIQUE NOT NULL,
    date_naissance DATE,
    filiere        VARCHAR(100),
    cree_le        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modifie_le     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
