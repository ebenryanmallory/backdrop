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
    db.run('ALTER TABLE users ADD COLUMN plan_type TEXT DEFAULT \'free\' CHECK(plan_type IN (\'free\', \'basic\', \'professional\'));', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Added');
      }
    });
    db.close();
  }

  function deleteField() {
    db = db ?? new sqlite3.Database(DB_PATH);
    db.run('ALTER TABLE users DROP COLUMN name', [], (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Deleted');
      }
    });
    db.close();
  }
  
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

function printUserInfo() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.all('SELECT id, user_id, plan_type, free_count FROM users;', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Users:');
      rows.forEach((row) => {
        console.log(`ID: ${row.id}, User ID: ${row.user_id}, Plan Type: ${row.plan_type}, Free Count: ${row.free_count}`);
      });
    }
  });
  db.close();
}

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

function printUsers() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.all('PRAGMA table_info(users);', (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      const columnNames = rows.map(row => row.name);
      console.log(columnNames);
    }
  });
  db.close();
}

async function getCount(userId) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      const { id, free_count, plan_type } = row;
      console.log(id)
      const responseObject = {
        plan: plan_type,
        free: free_count
      };
      console.log(responseObject)
    }
  });
  db.close();
}

async function getUserImages(userId) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = `SELECT image_url FROM user_images WHERE user_id = ?`;
  db.all(sql, [userId], (err, rows) => {
    console.log(rows)
  });
  db.close();
}

async function deleteUserImages(userId, imageURL) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = 'DELETE FROM user_images WHERE user_id = ? AND image_url = ?';
  db.run(sql, [userId, imageURL] , function() {
    console.log(this.changes)
  });
  db.close();
}

// createUserImagesTable();
// printTableNames();
// addField();
// printUserIds();
// deleteField()
// printUserInfo()
// getCount('offline_motionstoryline-dev.myshopify.com')
// deleteUserImages('offline_motionstoryline-dev.myshopify.com', 'https://shopify-staged-uploads.storage.googleapis.com/tmp/73997156649/products/c89d4685-6126-4b3b-bbb6-bd7be6a5066b/test.jpeg')
getUserImages('offline_motionstoryline-dev.myshopify.com')