var JSZip = require("jszip");
var JSZipUtils = require("jszip-utils");
var FileSaver = require("file-saver");
var fs = require("fs");
const CryptoJS = require("crypto-js");
const secretKey = "test";
const translationDB = require("./KeyTranslation");
const path = require("path");
const { ipcRenderer } = require("electron");
var promise = null;

/**
 * Asynchronously imports and processes zip files containing encrypted translation data.
 *
 * This function reads a zip file from the provided path, extracts the encrypted 'data.lls' file,
 * decrypts its content, processes the decrypted data, and updates the translations in the database
 * for the specified country.
 *
 * @param {string} sPath - The file path of the zip file to be read.
 * @param {string} sCountry - The country code or language identifier used to update translations in the database.
 *
 * @returns {Promise<Array>} - A promise that resolves with the decrypted data (an array) after processing.
 *
 * @throws {Error} - Throws an error if there is an issue reading the file, extracting its content, or decrypting the data.
 */
const importzipfiles = async (sPath, sCountry, passowrd) => {
  // Wrap fs.readFile in a Promise to use async/await
  const readFilePromise = new Promise((resolve, reject) => {
    fs.readFile(sPath, (err, data) => {
      if (err) {
        reject("Error reading file:", err);
      } else {
        resolve(data);
      }
    });
  });

  try {
    // Wait for the file to be read
    const data = await readFilePromise;

    // Step 2: Load the zip file using JSZip
    const zip = await JSZip.loadAsync(data);

    // Step 3: Extract the 'data.lls' file from the zip
    const encryptedText = await zip.file("data.lls").async("string");
    // console.log('encryptedText =>', encryptedText);

    // Step 4: Decrypt the content of 'data.lls' using the decryption function
    const decryptedData = await decryptData(encryptedText, passowrd);

    // Step 5: Process the decrypted data

    // Update translation in the database (replace with actual update logic)
    for (let i = 0; i < decryptedData.length; i++) {
      const element = decryptedData[i];
      // console.log('element =>', element);

      translationDB?.updateKeyTranslationByKey(
        element["key"],
        sCountry,
        element[sCountry]
      );
    }

    // Return the parsed decrypted data
    return decryptedData;
  } catch (err) {
    console.error("Error extracting or decrypting data:", err);
    throw err;
  }
};

/**
 * Imports and decrypts a `.lls` file, processes its content, and updates translations in the database.
 *
 * @param {string} sPath - The path to the `.lls` file to be read and decrypted.
 * @param {string} sCountry - The country code used for updating translations.
 * @param {string} password - The password used to decrypt the contents of the `.lls` file.
 *
 * @returns {Promise<Array>} - A promise that resolves to the decrypted data after processing and updating translations.
 *
 * @throws {Error} - Will throw an error if reading the file, decrypting the data, or updating translations fails.
 */
const importLLSfiles = async (sPath, sCountry, passowrd) => {
  // Wrap fs.readFile in a Promise to use async/await
  const readFilePromise = new Promise((resolve, reject) => {
    fs.readFile(sPath, "utf8", (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      } else {
        resolve(data);
      }
    });
  });

  try {
    // Wait for the file to be read
    // const data = await readFilePromise;

    // Step 2: Load the zip file using JSZip
    // const zip = await JSZip.loadAsync(data);

    // Step 3: Extract the 'data.lls' file from the zip
    // const encryptedText = await zip.file("data.lls").async("string");
    const encryptedText = await readFilePromise;
    // console.log('encryptedText =>', encryptedText);

    // Step 4: Decrypt the content of 'data.lls' using the decryption function
    const decryptedData = await decryptData(encryptedText, passowrd);

    console.log("decryptedData =>", decryptedData);

    // Step 5: Process the decrypted data

    // Update translation in the database (replace with actual update logic)
    for (let i = 0; i < decryptedData.length; i++) {
      const element = decryptedData[i];
      console.log("element =>", element[sCountry]);

      translationDB?.updateKeyTranslationByKey(
        element["key"],
        sCountry,
        element[sCountry]
      );
    }

    // Return the parsed decrypted data
    return decryptedData;
  } catch (err) {
    console.error("Error extracting or decrypting data:", err);
    throw err;
  }
};

/**
 * Generates a zip file containing encrypted data with base64-encoded images and triggers a download.
 *
 * This function processes an array of data by converting image file paths to base64-encoded images,
 * encrypts the modified data, and then creates a zip file with the encrypted data stored as "data.lls".
 * The zip file is then generated and the download is triggered.
 *
 * @param {Array<Object>} data - An array of objects where each object contains image paths and other data to be processed.
 * Each object in the array must have an `image_path` property containing the path to the image file.
 *
 * @throws {Error} - Throws an error if the image conversion, encryption, or zip file generation fails.
 */

const downloadzipfiles = (data, password, result) => {
  var zip = new JSZip();

  try {
    // Map through the data and create the modified data with base64 images
    const modifiedData = data.map((element) => {
      // Construct the path to the image file (base64 conversion is assumed to be handled)
      const imagePath =
        __dirname.replace("database", "").replace("app.asar", "") +
        "uploads/" +
        element["image_path"];

      // Convert image to base64 (assuming imageToBlob is a utility function defined elsewhere)
      const base64Image = imageToBlob(imagePath);

      // Return the modified element with base64 image
      return {
        ...element,
        image_path: base64Image, // Store the image as base64
      };
    });

    // Encrypt the modified data using the provided password
    const encryptedData = encryptData(modifiedData, password);
    // Add the encrypted data as "data.lls" in the zip file
    zip.file("data.lls", JSON.stringify(encryptedData));

    // Generate the zip file asynchronously and trigger the download
    zip
      .generateAsync({ type: "blob" })
      .then(async (blob) => {
        try {
          //  const result = await window.electronAPI.openFile()
          // const result = await window.electronZipAPI.openZipFile();

          const arrayBuffer = await blob?.arrayBuffer();
          const buffer = Buffer?.from(arrayBuffer);

          if (result) {
            fs.writeFile(result, buffer, (err) => {
              if (err) {
                console.error("Failed to save the file:", err);
              } else {
                console.log("File saved successfully:", buffer);
              }
            });
          }
        } catch (error) {
          console.error("Error showing save dialog:", error);
        }
      })
      .catch((error) => {
        console.error("Error generating zip:", error);
      });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Downloads `.lls` files by processing the provided data, converting images to base64, encrypting the data,
 * and saving it as a `.lls` file.
 *
 * @param {Array} data - The data to be processed, with each element potentially containing an image path.
 * @param {string} password - The password used for encrypting the data.
 * @param {string} result - The file path where the `.lls` file will be saved.
 *
 * @throws {Error} Will throw an error if file writing fails or if an issue occurs during data processing or encryption.
 */
const downloadLLSfiles = async (data, password, result) => {
  try {
    // Map through the data and create the modified data with base64 images
    const modifiedData = data.map((element) => {
      // Construct the path to the image file (base64 conversion is assumed to be handled)
      const imagePath =
        __dirname.replace("database", "").replace("app.asar", "") +
        "uploads/" +
        element["image_path"];

      // Convert image to base64 (assuming imageToBlob is a utility function defined elsewhere)
      const base64Image = imageToBlob(imagePath);

      // Return the modified element with base64 image
      return {
        ...element,
        image_path: base64Image, // Store the image as base64
      };
    });

    // Encrypt the modified data using the provided password
    const encryptedData = encryptData(modifiedData, password);

    // Convert the encrypted data to a string and save it as a `.lls` file
    const fileContent = JSON.stringify(encryptedData);

    if (result) {
      // Write the file to the specified path
      fs.writeFile(result, fileContent, (err) => {
        if (err) {
          console.error("Failed to save the file:", err);
        } else {
          console.log("File saved successfully:", result);
        }
      });
    } else {
      console.error("File path not provided.");
    }
  } catch (err) {
    console.error("Error processing data:", err);
    throw err;
  }
};

/**
 * Converts an image file to a base64-encoded string (blob).
 *
 * This function reads an image from the given file path, converts the binary data into a base64 string,
 * and returns the base64-encoded representation of the image.
 *
 * @param {string} imagePath - The path to the image file to be converted.
 *
 * @returns {string} - A base64-encoded string representing the image file.
 *
 * @throws {Error} - Throws an error if there is an issue reading the image file or converting it to base64.
 */
const imageToBlob = (imagePath) => {
  try {
    // Read the image as a binary buffer (blob)

    const imageData = fs.readFileSync(imagePath);

    // Convert the binary data to a base64 string
    const base64Image = imageData.toString("base64");

    return base64Image;
  } catch (error) {
    console.error("Error converting image to blob:", error);
    throw error;
  }
};

/**
 * Encrypts the provided data using AES encryption with a secret key.
 *
 * This function first converts the data into a JSON string and then encrypts it using AES encryption
 * with the provided secret key. The resulting encrypted data is returned as a string.
 *
 * @param {Object} data - The data to be encrypted. It can be any JavaScript object that can be serialized into JSON.
 *
 * @returns {string} - The AES-encrypted data as a string.
 *
 * @throws {Error} - Throws an error if the encryption process fails, for example, due to an invalid secret key or an issue with the CryptoJS library.
 */

function encryptData(data, passowrd) {
  // Convert the data into a JSON string
  let jsonData = JSON.stringify(data);

  // Encrypt the JSON string with AES and the secret key
  const encryptedData = CryptoJS.AES.encrypt(jsonData, passowrd).toString();

  return encryptedData;
}

// Function to decrypt data
/**
 * Decrypts the provided AES-encrypted data using a secret key.
 *
 * This function first removes any leading and trailing quotes from the encrypted data, then decrypts it
 * using AES encryption with the provided secret key. The decrypted bytes are then converted back into a UTF-8
 * string and parsed as a JSON object.
 *
 * @param {string} encryptedData - The encrypted data as a string, which is expected to be in AES-encrypted form.
 *
 * @returns {Object} - The decrypted data parsed as a JavaScript object.
 *
 * @throws {Error} - Throws an error if the decryption process fails, for example, due to an invalid encrypted data format,
 *                   an incorrect secret key, or issues with the CryptoJS library.
 */

function decryptData(encryptedData, password) {
  // console.log("encryptedData =>", encryptedData);

  let finalEncryptData = encryptedData.replace(/^"|"$/g, "");

  // Decrypt the data with AES and the secret key
  const decryptedBytes = CryptoJS.AES.decrypt(finalEncryptData, password);

  // Convert the decrypted bytes back to a UTF-8 string and parse the JSON
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
}

// function decryptData(encryptedData) {
//   let finalEncryptData = encryptedData.replace(/^"|"$/g, '');

//     // Decrypt the data with AES and the secret key
//     const decryptedBytes = CryptoJS.AES.decrypt(finalEncryptData, secretKey);

//     // Convert the decrypted bytes back to a UTF-8 string and parse the JSON
//     const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

//     return decryptedData;
// }

/**
 * Asynchronously imports a zip file, decrypts its content, and processes any base64-encoded images.
 *
 * This function reads the zip file from the specified file path, extracts and decrypts the content of the 'data.lls' file,
 * then processes any base64-encoded images found in the data by saving them as image files and replacing the base64 string with
 * the image file path in the decrypted data.
 *
 * @param {string} filePath - The path to the zip file to be read and processed.
 *
 * @returns {Promise<Array<Object>>} - A promise that resolves to the decrypted data with base64 images replaced by file paths.
 *
 * @throws {Error} - Throws an error if there is an issue reading the zip file, extracting the data, decrypting the content,
 *                   or saving images (e.g., invalid base64 data or incorrect file paths).
 */
const importzipfilesandencryptdata = async (filePath, passowrd) => {
  // Wrap the fs.readFile method in a promise to make it work with async/await
  const readFilePromise = new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject("Error reading file:", err);
      } else {
        resolve(data);
      }
    });
  });

  try {
    // Wait for the file to be read
    const data = await readFilePromise;

    // Step 2: Load the zip file using JSZip
    const zip = await JSZip.loadAsync(data);

    // Step 3: Extract the 'data.lls' file from the zip
    const encryptedText = await zip.file("data.lls").async("string");

    // // Step 4: Decrypt the content of 'data.lls' using the decryption function
    // const decryptedData = decryptData(encryptedText);

    const decryptedData = JSON.parse(decryptData(encryptedText, passowrd));

    // Step 5: Log the decrypted data (or use it as needed)

    for (let i = 0; i < decryptedData.length; i++) {
      const item = decryptedData[i];

      // Check if image_path exists in the object
      if (item.image_path) {
        const base64Image = item.image_path; // Get the base64 string
        const imageName = `image_${i + 1}.png`; // Set a unique image name for each
        const imagePath = path.join(
          __dirname.replace("database", "").replace("app.asar", "") +
            "uploads/",
          imageName
        ); // Set the image path

        // Call saveBase64Image to save the image
        const savedImagePath = await saveBase64Image(base64Image, imagePath);
        // console.log(`Image ${i + 1} saved successfully at: ${savedImagePath}`);

        // Replace the base64 string with the image file path in the decryptedData
        decryptedData[i].image_path = savedImagePath;
      }
    }

    // Return the decrypted data
    return decryptedData;
  } catch (err) {
    console.error("Error extracting or decrypting data:", err);
  }
};

/**
 * Imports a `.lls` file, decrypts its contents, and processes the data, including saving any base64-encoded images.
 *
 * @param {string} filePath - The path to the `.lls` file that needs to be decrypted.
 * @param {string} password - The password used to decrypt the content of the `.lls` file.
 *
 * @returns {Promise<Array>} - A promise that resolves to the decrypted data, where each item may have its image path replaced by the saved image file path.
 *
 * @throws {Error} - Will throw an error if the file reading, decryption, or image saving fails.
 */
const importLLSFileAndDecryptData = async (filePath, password) => {
  // Wrap the fs.readFile method in a promise to make it work with async/await
  const readFilePromise = new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`Error reading file: ${err}`);
      } else {
        resolve(data);
      }
    });
  });

  try {
    // Step 1: Wait for the file to be read
    const encryptedText = await readFilePromise;

    // Step 2: Decrypt the content of the `.lls` file
    const decryptedData = decryptData(encryptedText, password);

    // Step 3: Process the decrypted data
    for (let i = 0; i < decryptedData.length; i++) {
      const item = decryptedData[i];

      // Check if image_path exists in the object
      if (item.image_path) {
        const base64Image = item.image_path; // Get the base64 string
        const imageName = `image_${i + 1}.png`; // Set a unique image name for each
        const imagePath = path.join(
          __dirname.replace("database", "").replace("app.asar", "") +
            "uploads/",
          imageName
        ); // Set the image path

        // Call saveBase64Image to save the image
        const savedImagePath = await saveBase64Image(base64Image, imagePath);

        // Replace the base64 string with the image file path in the decryptedData
        decryptedData[i].image_path = savedImagePath;
      }
    }

    // Step 4: Return the decrypted data
    return decryptedData;
  } catch (err) {
    console.error("Error processing .lls file:", err);
    throw err; // Re-throw error for further handling
  }
};

/**
 * Saves a base64 encoded image to a specified file path.
 *
 * @param {string} base64Data - The base64 encoded image data (without any data URI scheme).
 * @param {string} imagePath - The file path where the image should be saved.
 * @returns {Promise<string>} A promise that resolves with the image file path if the image is saved successfully, or rejects with an error message if there is an issue.
 *   });
 */
function saveBase64Image(base64Data, imagePath) {
  return new Promise((resolve, reject) => {
    // Remove base64 header if it exists (e.g., 'data:image/png;base64,')
    // const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 string to binary buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Save the buffer as an image file
    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        reject("Error saving the image:", err);
      } else {
        resolve(imagePath); // Return the image file path
      }
    });
  });
}

module.exports = {
  downloadzipfiles,
  importzipfiles,
  importzipfilesandencryptdata,
  downloadLLSfiles,
  importLLSFileAndDecryptData,
  importLLSfiles,
};
