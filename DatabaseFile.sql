/*
create schema project1;

CREATE TABLE userInfo (
    id SERIAL PRIMARY KEY,
    userName VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    status BOOLEAN
); */
SET search_path TO project1;

select * from userInfo;

-- Employee Master:
CREATE TABLE employee (
    employee_id SERIAL PRIMARY KEY, -- Unique identifier for each employee
    first_name VARCHAR(50) NOT NULL, -- Employee's first name
    last_name VARCHAR(50) NOT NULL, -- Employee's last name
    email VARCHAR(100) UNIQUE, -- Employee's email address (must be unique)
    phone_number VARCHAR(20), -- Employee's phone number
    is_active BOOLEAN DEFAULT TRUE -- Flag to indicate if the employee is active or inactive
);

-- Inserting sample data into employee table
INSERT INTO employee (first_name, last_name, email, phone_number, is_active) VALUES
    ('John', 'Doe', 'john.doe@example.com', '+1234567890', TRUE),
    ('Jane', 'Smith', 'jane.smith@example.com', '+1987654321', TRUE),
    ('Michael', 'Johnson', 'michael.johnson@example.com', '+1122334455', FALSE);

select * from employee;

-- Asset Category Master:
CREATE TABLE asset_category (
    category_id SERIAL PRIMARY KEY, -- Unique identifier for each asset category
    category_name VARCHAR(100) NOT NULL -- Name of the asset category
);

INSERT INTO asset_category (category_name) VALUES
    ('Laptop'),
    ('Mobile Phone'),
    ('Screw Driver'),
    ('Drill Machine');

select * from asset_category;

CREATE TABLE asset (
    asset_id SERIAL PRIMARY KEY, -- Unique identifier for each asset
    serial_number VARCHAR(50) UNIQUE NOT NULL, -- Serial number of the asset (must be unique)
    asset_category_id INT REFERENCES asset_category(category_id), -- Foreign key referencing asset category
    make VARCHAR(100), -- Make/Manufacturer of the asset
    model VARCHAR(100), -- Model of the asset
    is_active BOOLEAN DEFAULT TRUE -- Flag to indicate if the asset is active or inactive
);

INSERT INTO asset (serial_number, asset_category_id, make, model, is_active) VALUES
    ('SN123456', 1, 'Dell', 'Latitude', TRUE),
    ('SN789012', 1, 'HP', 'EliteBook', TRUE),
    ('SN345678', 2, 'Samsung', 'Galaxy S21', TRUE),
    ('SN901234', 3, 'Stanley', 'Screwdriver Set', TRUE),
    ('SN567890', 4, 'DeWalt', 'DCD777C2', TRUE);

select * from asset;

-- Stock View: 

SELECT
    asset_category.category_name,
    COUNT(asset.asset_id) AS total_assets,
    SUM(CASE WHEN asset.is_active THEN 1 ELSE 0 END) AS active_assets
FROM
    asset_category
LEFT JOIN
    asset ON asset_category.category_id = asset.asset_category_id
GROUP BY
    asset_category.category_name;
	
	
-- Issue Asset: 
	
	CREATE TABLE asset_issue (
    issue_id SERIAL PRIMARY KEY, -- Unique identifier for each asset issue
    asset_id INT REFERENCES asset(asset_id), -- Foreign key referencing the asset issued
    employee_id INT REFERENCES employee(employee_id), -- Foreign key referencing the employee to whom the asset is issued
    issue_date DATE, -- Date when the asset was issued
    returned BOOLEAN DEFAULT FALSE, -- Flag to indicate if the asset has been returned
    return_date DATE, -- Date when the asset was returned (if returned)
    return_reason TEXT -- Reason for returning the asset
);

INSERT INTO asset_issue (asset_id, employee_id, issue_date, returned, return_date, return_reason) VALUES
    (1, 1, '2024-04-01', FALSE, NULL, NULL),
    (3, 2, '2024-04-05', FALSE, NULL, NULL),
    (4, 3, '2024-04-10', FALSE, NULL, NULL);
	
	select * from asset_issue;

	-- Return Asset: 
CREATE TABLE asset_return (
    return_id SERIAL PRIMARY KEY, -- Unique identifier for each asset return
    issue_id INT REFERENCES asset_issue(issue_id), -- Foreign key referencing the asset issue
    return_date DATE, -- Date when the asset was returned
    return_reason TEXT -- Reason for returning the asset
);
	
	-- Inserting sample data into asset_return table
INSERT INTO asset_return (issue_id, return_date, return_reason) VALUES
    (1, '2024-04-15', 'Resignation'),
    (2, '2024-04-20', 'Upgrade'),
    (3, '2024-04-25', 'Repair');

select * from asset_return;


-- Scrap Asset: 
CREATE TABLE asset_scrap (
    scrap_id SERIAL PRIMARY KEY, -- Unique identifier for each scrapped asset
    asset_id INT REFERENCES asset(asset_id), -- Foreign key referencing the scrapped asset
    scrap_date DATE, -- Date when the asset was scrapped
    scrap_reason TEXT -- Reason for scrapping the asset
);


-- Inserting sample data into asset_scrap table
INSERT INTO asset_scrap (asset_id, scrap_date, scrap_reason) VALUES
    (5, '2024-04-30', 'Obsolete');
	
	
	select * from  asset_scrap;
	
	
	
	ALTER USER pgAdmin4 PASSWORD 'Zan@0987';

