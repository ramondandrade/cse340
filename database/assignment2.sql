

INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- SELECT * FROM account;

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1;

-- SELECT * FROM inventory WHERE inv_id = 10;

UPDATE inventory SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') WHERE inv_id = 10;

SELECT inv_make, inv_model, classification.classification_name FROM inventory 
	LEFT JOIN classification ON classification.classification_id = inventory.classification_id
	WHERE classification.classification_id = 2;


UPDATE inventory
    SET
        inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
        inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- SELECT * FROM inventory;


