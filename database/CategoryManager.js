const dbmgr = require('./DBManager')
console.log('dbmgr', dbmgr)

const db = dbmgr.db

const readAllCategory = () => {
  try {
    const query = `SELECT * FROM category where IsActive = 'Y'`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all()
    return rowList
  } catch (err) {
    console.error(err)
    throw err
  }
}

const readCategoryById = (categoryId) => {
  try {
    const query = `SELECT * FROM category where categoryId = ${categoryId}`
    const readQuery = db.prepare(query)
    const rowList = readQuery.all()
    return rowList
  } catch (err) {
    console.error(err)
    throw err
  }
}

const deleteCategoryById = (categoryId) => {
  try {
    const insertQuery = db.prepare(
      `update category set IsActive = 'N' where categoryId = ${categoryId}`
    )

    const transaction = db.transaction(() => {
      const info = insertQuery.run()
    })
    transaction()
  } catch (err) {
    console.error(err)
    throw err
  }
}

const updateCategoryById = (categoryId, categoryName) => {
  try {
    const insertQuery = db.prepare(
      `update category set CategoryName = '${categoryName}' where categoryId = ${categoryId}`
    )

    const transaction = db.transaction(() => {
      const info = insertQuery.run()
    })
    transaction()
  } catch (err) {
    console.error(err)
    throw err
  }
}

const insertCategory = (categoryName, createdby, createdOn) => {
  try {
    const insertQuery = db.prepare(
      `INSERT INTO category (categoryName, createdBy, createdOn) VALUES ('${categoryName}' , ${createdby}, '${createdOn}')`
    )

    const transaction = db.transaction(() => {
      const info = insertQuery.run()
    })
    transaction()
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  readAllCategory,
  insertCategory,
  readCategoryById,
  updateCategoryById,
  deleteCategoryById
}
