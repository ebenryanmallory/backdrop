import sqlite3 from "sqlite3";

const DB_PATH = `${process.cwd()}/database.sqlite`;

let db = null;

function createUsersTable() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      count INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, [], (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Users table created successfully!');
      }
    });
    db.close();
  }
  
  function addField() {
    db = db ?? new sqlite3.Database(DB_PATH);
    db.run('ALTER TABLE user_images ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP', [], (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Added');
      }
    });
    db.close();
  }
  
  // addField();

  // createUsersTable();

function printTableNames() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        rows.forEach((row) => {
          console.log("Table: " + row.name);
        });
      }
    });
    db.close();
  }
  
function printUserIds() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.all('SELECT id FROM users', [], (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      rows.forEach((row) => {
        console.log("User ID: " + row.id);
      });
    }
  });
  db.close();
}

// printUserIds();
function createUserImagesTable() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.run(`CREATE TABLE user_images (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
)`, [], (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Created user images table');
    }
  });
  db.close();
}
// createUserImagesTable();
printTableNames();
