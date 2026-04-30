-- ============================================================
-- DB MIGRATION SCRIPT for db_formation_isi
-- Run this ONCE before starting the Spring Boot application
-- ============================================================

USE db_formation_isi;

-- ------------------------------------------------------------
-- STEP 1: Drop the duplicate/orphan tables
-- "domaines" is a duplicate of "domaine" — drop it
-- "tableau_de_bord" stores computed data — not needed with the
--   /api/stats/dashboard endpoint. Drop it.
-- ------------------------------------------------------------
DROP TABLE IF EXISTS domaines;
DROP TABLE IF EXISTS tableau_de_bord;

-- ------------------------------------------------------------
-- STEP 2: Fix formation_participant
-- The table currently has 4 columns (two duplicate pairs).
-- We keep only (formation_id, participant_id).
-- ------------------------------------------------------------
DROP TABLE IF EXISTS formation_participant;
CREATE TABLE formation_participant (
    formation_id   BIGINT NOT NULL,
    participant_id INT    NOT NULL,
    PRIMARY KEY (formation_id, participant_id),
    CONSTRAINT fk_fp_formation   FOREIGN KEY (formation_id)   REFERENCES formation(Id)    ON DELETE CASCADE,
    CONSTRAINT fk_fp_participant FOREIGN KEY (participant_id) REFERENCES participant(Id)  ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- STEP 3: Fix formateur
-- Drop the redundant "employeur_id" column (bigint duplicate).
-- Keep only "IdEmployeur" (int) which matches the FK.
-- Also fix Tel from INT to VARCHAR(20).
-- ------------------------------------------------------------
ALTER TABLE formateur DROP FOREIGN KEY IF EXISTS fk_formateur_employeur_id;
ALTER TABLE formateur DROP COLUMN IF EXISTS employeur_id;
ALTER TABLE formateur MODIFY COLUMN Tel VARCHAR(20) NULL;

-- ------------------------------------------------------------
-- STEP 4: Fix participant.Tel from INT to VARCHAR(20)
-- ------------------------------------------------------------
ALTER TABLE participant MODIFY COLUMN Tel VARCHAR(20) NULL;

-- ------------------------------------------------------------
-- STEP 5: Add idFormateur FK column to formation (if not exists)
-- The Spring model has a @ManyToOne formateur on formation.
-- ------------------------------------------------------------
ALTER TABLE formation ADD COLUMN IF NOT EXISTS idFormateur INT NULL;
ALTER TABLE formation ADD CONSTRAINT fk_formation_formateur
    FOREIGN KEY (idFormateur) REFERENCES formateur(id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- STEP 6: Normalize domaine.Id to match formation.idDomaine type
-- formation.idDomaine is INT, domaine.Id is INT — already OK.
-- Just make sure the FK exists.
-- ------------------------------------------------------------
ALTER TABLE formation ADD CONSTRAINT IF NOT EXISTS fk_formation_domaine
    FOREIGN KEY (idDomaine) REFERENCES domaine(Id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- STEP 7: Ensure all other FKs are clean
-- ------------------------------------------------------------
-- participant -> structure
ALTER TABLE participant ADD CONSTRAINT IF NOT EXISTS fk_participant_structure
    FOREIGN KEY (IdStructure) REFERENCES structure(Id) ON DELETE SET NULL;

-- participant -> profil
ALTER TABLE participant ADD CONSTRAINT IF NOT EXISTS fk_participant_profil
    FOREIGN KEY (idProfil) REFERENCES profil(Id) ON DELETE SET NULL;

-- formateur -> employeur
ALTER TABLE formateur ADD CONSTRAINT IF NOT EXISTS fk_formateur_employeur
    FOREIGN KEY (IdEmployeur) REFERENCES employeur(Id) ON DELETE SET NULL;

-- utilisateur -> role
ALTER TABLE utilisateur ADD CONSTRAINT IF NOT EXISTS fk_utilisateur_role
    FOREIGN KEY (idRole) REFERENCES role(Id) ON DELETE SET NULL;

-- ------------------------------------------------------------
-- DONE — the schema is now clean and consistent.
-- ============================================================
