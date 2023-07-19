import sqlite3 from "sqlite3";

import { DB_PATH } from "./db_path.js";

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
    const sql = `ALTER TABLE users ADD COLUMN plan_id TEXT`;

    db.run(sql, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Added');
      }
    });
    db.close();
  }

  function updateField() {
    db = db ?? new sqlite3.Database(DB_PATH);
    const sql = `ALTER TABLE users
    ALTER COLUMN plan_id SET DEFAULT 'none';
    `;

    db.run(sql, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('ok');
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

function printTableInfo() {
  db = db ?? new sqlite3.Database(DB_PATH);
  db.all("SELECT * FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        rows.forEach((row) => {
          console.log("Table: " + row.name);
          console.log(row)
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
  db.all('SELECT * FROM users;', (err, rows) => {
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

async function getAll(userId) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      const { id, created_at, free_count, plan_type, plan_id, compression, use_compression, bg_color, use_transparency } = row;
      const responseObject = {
        id: id,
        created_at: created_at,
        plan: plan_type,
        plan_id: plan_id,
        free: free_count,
        compression: compression,
        use_compression: use_compression,
        bg_color: bg_color,
        use_transparency: use_transparency
      };
      console.log(responseObject)
    }
  });
  db.close();
}

async function getAllImages() {
  db = db ?? new sqlite3.Database(DB_PATH);
  const countSQL = 'SELECT COUNT(*) FROM user_images';
  const selectSQL = 'SELECT * FROM user_images';
  db.get(countSQL, (err, row) => {
      console.log(row)
  });
  db.all(selectSQL, function(err, rows) {
    rows.forEach((row) => {
      console.log(row)
    });
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

async function deleteUser(userId) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = 'DELETE FROM users WHERE user_id = ?';
  db.run(sql, [userId] , function() {
    console.log(this.changes)
  });
  db.close();
}

async function updatePreferences(userId, compression, use_compression, bg_color, use_transparency) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = `Update users SET compression = $compression, use_compression = $use_compression, bg_color = $bg_color, use_transparency = $use_transparency WHERE user_id = $userID`;
  const updateParams = {
    $compression: compression,
    $use_compression: use_compression,
    $bg_color: bg_color,
    $use_transparency: use_transparency,
    $userID: userId
  };
  db.run(sql, updateParams, function(err) {
    console.log(this.changes)
  });
  db.close();
}

async function getPreferences(userId) {
  db = db ?? new sqlite3.Database(DB_PATH);
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  db.get(sql, [userId], (err, row) => {
    const { compression, use_compression, bg_color, use_transparency } = row;
    const responseObject = {
      compression: compression,
      use_compression: use_compression,
      bg_color: bg_color,
      use_transparency: use_transparency
    };
    console.log(responseObject)
  });
  db.close();
}

async function addImageUrl(userId, imageUrl, timestamp) {
  let db = null;
  try {
    db = new sqlite3.Database(DB_PATH)
    const query = `INSERT INTO user_images (user_id, image_url, created_at) VALUES (?, ?, ?)`;
    db.run(query, [userId, imageUrl, timestamp], function() {
      console.log(this.changes)
    });
  } catch (err) {
    console.error(err);
  } finally {
    if (db) {
      db.close();
    }
  }
}
// createUserImagesTable();
// printTableInfo();
// addField();
// updateField();
// printUserIds();
// deleteField()
// printUserInfo()
getAll('offline_motionstoryline-dev.myshopify.com')
// getAllImages()
// deleteUserImages('offline_motionstoryline-dev.myshopify.com', '')
// getUserImages('offline_motionstoryline-dev.myshopify.com')
// deleteUser('offline_motionstoryline-dev.myshopify.com')
// updatePreferences('offline_motionstoryline-dev.myshopify.com', 80, false, '#FFFFFF', false)
// getPreferences('offline_motionstoryline-dev.myshopify.com')
// addImageUrl('offline_motionstoryline-dev.myshopify.com', '', new Date().toISOString())