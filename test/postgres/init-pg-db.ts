import { Client } from 'pg';

const AdminClient = new Client({
  host: 'localhost',
  port: 5437,
  user: 'admin',
  password: 'admin',
});

const DBClient = new Client({
  host: 'localhost',
  port: 5437,
  database: 'tests',
  user: 'admin',
  password: 'admin',
});

const init = async () => {
  await AdminClient.connect();

  await AdminClient.query(`DROP DATABASE IF EXISTS tests`);
  await AdminClient.query(`CREATE DATABASE tests`);
  await AdminClient.end();

  await DBClient.connect();

  await DBClient.query(`CREATE TABLE IF NOT EXISTS accounts
                        (
                            user_id    serial PRIMARY KEY,
                            username   VARCHAR(50) UNIQUE  NOT NULL,
                            password   VARCHAR(50)         NOT NULL,
                            email      VARCHAR(255) UNIQUE NOT NULL,
                            created_on TIMESTAMP           NOT NULL,
                            last_login TIMESTAMP
                        );`);


  await DBClient.query(`TRUNCATE TABLE accounts`);


  await DBClient.query(`
      INSERT INTO accounts (username, password, email, created_on, last_login)
      VALUES ('john_doe', 'password123', 'john.doe@example.com', '2023-06-08 10:15:00', '2023-06-08 10:20:00'),
             ('jane_smith', 'p@ssw0rd!', 'jane.smith@example.com', '2023-06-08 11:30:00', '2023-06-08 11:45:00'),
             ('alice_johnson', 'securepass', 'alice.johnson@example.com', '2023-06-08 12:00:00', NULL),
             ('sam_wilson', 'falcon123', 'sam.wilson@example.com', '2023-06-08 13:45:00', NULL),
             ('emily_green', 'password456', 'emily.green@example.com', '2023-06-08 14:30:00', NULL),
             ('michael_jones', 'm1k3y', 'michael.jones@example.com', '2023-06-08 15:15:00', '2023-06-08 15:20:00'),
             ('sarah_adams', 'pa55word', 'sarah.adams@example.com', '2023-06-08 16:00:00', '2023-06-08 16:05:00'),
             ('alex_walker', 'pass1234', 'alex.walker@example.com', '2023-06-08 17:30:00', NULL),
             ('linda_brown', 'securepw', 'linda.brown@example.com', '2023-06-08 18:45:00', '2023-06-08 18:50:00'),
             ('kevin_anderson', 'qwerty', 'kevin.anderson@example.com', '2023-06-08 19:15:00', NULL);
  `);


  await DBClient.end();
};


(init)();
