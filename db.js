const Database = require('better-sqlite3')
const path = require('path')

// Create or open the database file
const db = new Database(path.join(__dirname, 'my-database.db'), { verbose: console.log })

console.log('Database instance:', db)
// Create a table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
  )
`
).run()

// Insert some initial data if the table is empty
const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count

if (userCount === 0) {
  const insert = db.prepare('INSERT INTO users (name, age) VALUES (?, ?)')
  insert.run('Alice', 25)
  insert.run('Bob', 30)
  insert.run('Charlie', 35)
}

module.exports = db // Export using CommonJS
