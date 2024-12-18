const database = require('better-sqlite3')
const path = require('path')
proddirectory = __dirname.replace('app.asar\\src\\daopackage', '')
//console.log(process.resourcesPath)
const dbPath =
  process.env.NODE_ENV === 'development'
    ? './database/lls.db'
    : path.join(process.resourcesPath, './database/lls.db')

console.log('dipak', dbPath)
const db = new database(dbPath)
db.pragma('journal_mode = WAL')

exports.db = db
