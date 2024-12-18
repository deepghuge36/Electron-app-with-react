const dbmgr = require('./DBManager');
const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const db = dbmgr.db;

const readAllKeyTranslation = () => {
  try {
    const query = `SELECT * FROM key_translation_master where isactive = 'Y'`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const readKeyTranslationById = (KeyId) => {
  try {
    const query = `SELECT * FROM key_translation_master where key_id = ${KeyId}`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const readKeyTranslationByCountry = (Country) => {
  try {
    const query = `SELECT key, image_path,english_name, ${Country} FROM key_translation_master where isactive = 'Y'  `;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteKeyTranslationById = (KeyId) => {
  try {
    const insertQuery = db.prepare(
      `update key_translation_master set isactive = 'N' where key_id = ${KeyId}`
    );

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      //console.log(
      //   `Inserted ${info.changes} rows with last ID
      //        ${info.lastInsertRowid} into key_translation_master`
      //)
    });
    transaction();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const insertKeyTranslation = (key, catId, eng_name, filePath) => {
  try {
    //alert(filePath);
    const fileName = getCurrentDatetime('') + '_' + path.basename(filePath);
    //alert(getCurrentDatetime()+"_" + fileName);
    //alert(__dirname.replace('database', '').replace('app.asar', '') + "uploads/" + fileName);
    // Copy the chosen file to the application's data path
    fs.copyFile(
      filePath,
      __dirname.replace('database', '').replace('app.asar', '') +
        'uploads/' +
        fileName,
      (err) => {
        if (err) throw err;
        //console.log('Image ' + fileName + ' stored.');

        // At that point, store some information like the file name for later use
      }
    );

    const insertQuery = db.prepare(
      `INSERT INTO key_translation_master (key, category_id, image_path, english_name, isactive, created_by, created_on) VALUES ('${key}' , ${catId}, '${fileName}','${eng_name}','Y',1,'${getCurrentDatetime('YYYY-MM-DD')}')`
    );

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      //console.log(
      //   `Inserted ${info.changes} rows with last ID
      //        ${info.lastInsertRowid} into key_translation_master`
      //)
    });
    transaction();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateKeyTranslationById = (
  keyId,
  key,
  catId,
  eng_name,
  filePath,
  isFileUploaded
) => {
  try {
    if (isFileUploaded) {
      const fileName = getCurrentDatetime('') + '_' + path.basename(filePath);
      //alert(getCurrentDatetime()+"_" + fileName);
      //alert(__dirname.replace('database', '').replace('app.asar', '') + "uploads/" + fileName);
      // Copy the chosen file to the application's data path
      fs.copyFile(
        filePath,
        __dirname.replace('database', '').replace('app.asar', '') +
          'uploads/' +
          fileName,
        (err) => {
          if (err) throw err;
          //console.log('Image ' + fileName + ' stored.');

          // At that point, store some information like the file name for later use
        }
      );

      filePath = fileName;
    }

    const insertQuery = db.prepare(
      `update key_translation_master set key = '${key}', category_id = ${catId}, image_path = '${filePath}', english_name = '${eng_name}' where key_id = ${keyId}`
    );

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      //console.log(
      //   `Inserted ${info.changes} rows with last ID
      //        ${info.lastInsertRowid} into key_translation_master`
      //)
    });
    transaction();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateKeyTranslationByKey = (key, countryname, keyvalue) => {
  try {
    const insertQuery = db.prepare(
      `update key_translation_master set ${countryname} = '${keyvalue}' where key = '${key}'`
    );

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      console.log(
        `Inserted ${info.changes} rows with last ID 
                 ${info.lastInsertRowid} into key_translation_master`
      );
    });
    transaction();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

function getCurrentDatetime(sFormat) {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ('0' + date_ob.getDate()).slice(-2);

  // current month
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  if (sFormat == 'YYYY-MM-DD HH:MM:SS') {
    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    );
  } else if (sFormat == 'YYYY-MM-DD') {
    return year + '-' + month + '-' + date;
  } else {
    return year + month + date + hours + minutes + seconds;
  }

  //// prints date in YYYY-MM-DD format
  //console.log(year + "-" + month + "-" + date);

  //// prints date & time in YYYY-MM-DD HH:MM:SS format
  //console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

  //// prints time in HH:MM format
  //console.log(hours + ":" + minutes);
}

module.exports = {
  readAllKeyTranslation,
  insertKeyTranslation,
  readKeyTranslationById,
  updateKeyTranslationById,
  deleteKeyTranslationById,
  readKeyTranslationByCountry,
  updateKeyTranslationByKey,
};
