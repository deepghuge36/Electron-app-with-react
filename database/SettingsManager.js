const dbmgr = require("./DBManager");
const db = dbmgr.db;

/**
 * Inserts a new device into the Devices table and associates it with specified projects.
 *
 * @param {string} deviceName - The name of the device to be inserted.
 * @param {string} deviceKey - The unique key for the device.
 * @param {Array} projects - An array of project IDs to associate with the device.
 * @returns {Object} - An object containing the status code and the inserted device ID.
 */
const insertDevice = async (deviceName, deviceKey, projects) => {
  try {
    const currentTimestamp = new Date().toISOString(); // Format as 'YYYY-MM-DDTHH:mm:ss.sssZ'

    // Step 1: Insert into Devices table
    const insertDeviceQuery = db.prepare(
      `INSERT INTO Devices (deviceName, deviceKey, createdAt, updatedAt)
         VALUES (?, ?, ?, ?)`
    );
    const info = insertDeviceQuery.run(
      deviceName,
      deviceKey,
      currentTimestamp,
      currentTimestamp
    );

    const newDeviceId = info.lastInsertRowid; // Retrieve the inserted device ID
    console.log(`Inserted device with ID: ${newDeviceId}`);

    // Step 2: Proceed to insert into deviceProjects table
    await insertDeviceProjects(newDeviceId, projects, currentTimestamp);

    return { status: 200, id: newDeviceId, msg: "Device added succesuly" }; // Optionally return the new device ID
  } catch (err) {
    console.error("Error inserting device:", err);
    return { status: 400, msg: err.message };
  }
};

/**
 * Inserts associated projects for a device into the DeviceProjects table.
 *
 * @param {number} deviceId - The ID of the device to associate with the projects.
 * @param {Array} projects - An array of project IDs to associate with the device.
 * @param {string} timestamp - The current timestamp for createdAt and updatedAt columns.
 * @throws {Error} - Throws an error if any issue occurs while inserting projects.
 */
const insertDeviceProjects = async (deviceId, projects, timestamp) => {
  try {
    const insertProjectQuery = db.prepare(
      `INSERT INTO DeviceProjects (deviceId, projectId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?)`
    );

    console.log("projects =>", projects);

    for (const projectId of projects) {
      insertProjectQuery.run(deviceId, projectId, timestamp, timestamp);
      console.log(`Inserted projectId ${projectId} for deviceId ${deviceId}`);
    }
  } catch (err) {
    console.error("Error inserting projects:", err);
    throw err;
  }
};

/**
 * Retrieves a list of devices along with their associated projects from the database.
 *
 * @returns {Array} - An array of device objects, each containing device details and a list of associated projects.
 * @throws {Error} - Throws an error if there is an issue fetching the device list from the database.
 */
const getDeviceList = () => {
  try {
    // Query to get all devices and their associated projects
    const query = `
        SELECT 
          d.deviceId, 
          d.deviceName, 
          d.deviceKey, 
          dp.projectId, 
          p.projectKey, 
          p.projectName
        FROM Devices d
        LEFT JOIN DeviceProjects dp ON d.deviceId = dp.deviceId
        LEFT JOIN Projects p ON dp.projectId = p.projectId
        ORDER BY dp.id
      `;

    // Execute the query
    const rows = db.prepare(query).all();

    // Transform the flat result into a structured format
    const devices = rows.reduce((acc, row) => {
      // If the device doesn't already exist in the accumulator, add it
      if (!acc[row.deviceId]) {
        acc[row.deviceId] = {
          deviceId: row.deviceId,
          deviceName: row.deviceName,
          deviceKey: row.deviceKey,
          projects: [],
        };
      }

      // Add project information if it exists
      if (row.projectId) {
        acc[row.deviceId].projects.push({
          projectId: row.projectId,
          projectKey: row.projectKey,
          projectName: row.projectName,
        });
      }

      return acc;
    }, {});

    // Convert the object to an array of devices
    return Object.values(devices);
  } catch (err) {
    console.error("Error fetching device list:", err);
    throw err;
  }
};

/**
 * Retrieves a device by its ID along with the associated projects.
 *
 * @param {number} deviceId - The ID of the device to retrieve.
 * @returns {Object} - An object containing device details and an array of associated projects.
 *                     Returns an empty array if the device is not found.
 * @throws {Error} - Throws an error if there is an issue fetching the device data from the database.
 */
const getDeviceById = (deviceId) => {
  try {
    const query = `
        SELECT 
          d.deviceId, 
          d.deviceName, 
          d.deviceKey, 
          dp.projectId, 
          p.projectKey, 
          p.projectName
        FROM Devices d
        LEFT JOIN DeviceProjects dp ON d.deviceId = dp.deviceId
        LEFT JOIN Projects p ON dp.projectId = p.projectId
        WHERE d.deviceId = ?
      `;

    const readQuery = db.prepare(query);
    const rows = readQuery.all(deviceId); // Use parameterized query to prevent SQL injection

    if (!rows.length) return [];

    // Group projects under their respective device
    const deviceData = {
      deviceId: rows[0].deviceId,
      deviceKey: rows[0].deviceKey,
      deviceName: rows[0].deviceName,
      Projects: rows
        .filter((row) => row.projectId) // Exclude rows with no projectId
        .map((row) => ({
          projectId: row.projectId,
          projectKey: row.projectKey,
          projectName: row.projectName,
        })),
    };

    return deviceData;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Retrieves a list of all projects from the database.
 *
 * @returns {Array} - An array of project objects, each containing project details.
 * @throws {Error} - Throws an error if there is an issue fetching the project list from the database.
 */
const getProjectList = () => {
  try {
    const query = `SELECT * FROM Projects`; // Adjust the table name if needed
    const readQuery = db.prepare(query);
    const rowList = readQuery.all(); // Fetch all rows
    return rowList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Updates the details of a device by its ID, including the device name, key, and associated projects.
 *
 * @param {number} deviceId - The ID of the device to be updated.
 * @param {string} deviceName - The new name of the device.
 * @param {string} deviceKey - The new key for the device.
 * @param {Array} projects - An array of project IDs to associate with the device.
 * @returns {Object} - An object indicating the success or failure of the update, with a status code and message.
 * @throws {Error} - Throws an error if there is an issue updating the device details or associated projects.
 */
const updateDeviceByID = async (deviceId, deviceName, deviceKey, projects) => {
  try {
    const currentTimestamp = new Date().toISOString(); // Format as 'YYYY-MM-DDTHH:mm:ss.sssZ'

    await deleteDeviceProjects(deviceId);

    await updateDeviceDetails(deviceId, deviceName, deviceKey);

    await insertDeviceProjects(deviceId, projects, currentTimestamp);

    return { status: 200, msg: "Device successfully updated" };
  } catch (err) {
    return { status: 200, msg: err.message };
  }
};

/**
 * Deletes all projects associated with a device by its ID.
 *
 * @param {number} deviceId - The ID of the device whose associated projects will be deleted.
 * @returns {Object} - An object indicating the status of the delete operation, including a message and status code.
 * @throws {Error} - Throws an error if there is an issue deleting the device projects.
 */
const deleteDeviceProjects = async (deviceId) => {
  try {
    // Prepare the DELETE query using a parameterized statement
    const deleteQuery = db.prepare(
      `DELETE FROM DeviceProjects WHERE deviceId = ?`
    );

    // Start a transaction
    const transaction = db.transaction(() => {
      // Execute the delete query within the transaction
      const info = deleteQuery.run(deviceId);

      console.log(`Deleted ${info.changes} row(s) from DeviceProjects`);

      // You can optionally handle more logic in the transaction if needed
    });

    // Commit the transaction
    transaction();

    return {
      status: 200,
      msg: "Existing device projects deleted successfully",
    };
  } catch (err) {
    console.error("Error deleting device projects:", err);
    return {
      status: 500,
      msg: "Failed to delete device projects",
      error: err.message,
    };
  }
};

/**
 * Updates the details of a device (device name and device key) by its ID.
 *
 * @param {number} deviceId - The ID of the device to be updated.
 * @param {string} deviceName - The new name of the device.
 * @param {string} deviceKey - The new key for the device.
 * @returns {Object} - An object indicating the status of the update operation, including a message and status code.
 * @throws {Error} - Throws an error if there is an issue updating the device details.
 */
const updateDeviceDetails = async (deviceId, deviceName, deviceKey) => {
  try {
    // Prepare the UPDATE query using a parameterized statement
    const updateQuery = db.prepare(
      `UPDATE Devices SET deviceName = ?, deviceKey = ? WHERE deviceId = ?`
    );

    // Start a transaction
    const transaction = db.transaction(() => {
      // Execute the update query within the transaction
      const info = updateQuery.run(deviceName, deviceKey, deviceId);

      console.log(`Updated ${info.changes} row(s) in Devices`);

      // You can optionally handle more logic in the transaction if needed
    });

    // Commit the transaction
    transaction();

    return { status: 200, msg: "Device details updated successfully" };
  } catch (err) {
    console.error("Error updating device details:", err);
    return {
      status: 500,
      msg: "Failed to update device details",
      error: err.message,
    };
  }
};

module.exports = {
  getDeviceById,
  getDeviceList,
  insertDevice,
  getProjectList,
  updateDeviceByID,
};
