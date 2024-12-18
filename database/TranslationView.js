const dbmgr = require("./DBManager");
const db = dbmgr.db;

/**
 * Fetches all data from the `key_translation_master` table, ordered by `key_id`.
 *
 * @async
 * @function getTranslationList
 * @returns {Promise<Object[]>} A promise that resolves to an array of rows retrieved from the `key_translation_master` table.
 * @throws {Error} If there is an issue executing the query.
 */
const getTranslationList = async () => {
  try {
    // Query to fetch all data from key_translation_master
    const query = `
        SELECT *
        FROM key_translation_master
        ORDER BY key_id
      `;

    // Execute the query
    const rows = db.prepare(query).all();
    return rows;
  } catch (err) {
    console.error("Error fetching translations:", err);
    throw err;
  }
};

module.exports = {
  getTranslationList,
};
