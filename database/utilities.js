const Toastify = require("toastify-js");

const getCurrentDatetime = (sFormat) => {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  if (sFormat == "YYYY-MM-DD HH:MM:SS") {
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  } else if (sFormat == "DD-MM-YYYY HH:MM:SS") {
    return (
      date +
      "-" +
      month +
      "-" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  } else if (sFormat == "YYYY-MM-DD") {
    return year + "-" + month + "-" + date;
  } else {
    return year + month + date + hours + minutes + seconds;
  }
};

/**
 * Smoothly scrolls an element by a specified amount in the X and Y directions.
 *
 * @param {string} elementId - The ID of the DOM element to scroll.
 * @param {number} deltaX - The total amount to scroll horizontally (in pixels).
 * @param {number} deltaY - The total amount to scroll vertically (in pixels).
 * @param {number} [steps=20] - The number of steps to divide the scrolling into (default is 20).
 * @param {number} [duration=200] - The total duration of the scrolling animation (in milliseconds, default is 200ms).
 * @returns {void}
 *
 * @example
 * // Scrolls an element with ID "content" 300px to the right and 200px down
 * smoothScrollById('content', 300, 200);
 */
const smoothScrollById = (
  elementId,
  deltaX,
  deltaY,
  steps = 20,
  duration = 200
) => {
  const element = document.getElementById(elementId);

  // console.log("element data=>", element);

  if (!element) {
    return;
  }

  const stepX = deltaX / steps;
  const stepY = deltaY / steps;
  const intervalTime = duration / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < steps) {
      element.scrollBy(stepX, stepY);
      currentStep++;
    } else {
      clearInterval(interval);
    }
  }, intervalTime);
};

/**
 * Sets up keyboard scroll listeners for multiple elements by their IDs.
 * Allows smooth scrolling of the specified elements using the arrow keys
 * when the Shift key is held down.
 *
 * @param {...string} elementIds - The IDs of the elements to apply the scroll listeners to.
 * @returns {void}
 *
 * @example
 * // Enable smooth scrolling for elements with IDs "content1" and "content2"
 * setupScrollListeners("content1", "content2");
 */
const setupScrollListeners = (...elementIds) => {
  if (!elementIds.length) {
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("keydown", (event) => {
      elementIds.forEach((elementId) => {
        // console.log("elementId =>", elementId, event.shiftKey, event.key);

        if (event.shiftKey) {
          switch (event.key) {
            case "ArrowUp":
              console.log("elementId up=>");
              smoothScrollById(elementId, 0, -50, 30, 300);
              event.preventDefault();
              break;
            case "ArrowDown":
              smoothScrollById(elementId, 0, 50, 30, 300);
              event.preventDefault();
              break;
            case "ArrowLeft":
              smoothScrollById(elementId, -50, 0, 30, 300);
              event.preventDefault();
              break;
            case "ArrowRight":
              smoothScrollById(elementId, 50, 0, 30, 300);
              event.preventDefault();
              break;
            default:
              break;
          }
        }
      });
    });
  });
};

/**
 * Displays a toast notification with a custom message and type (success or error).
 * The notification uses Toastify for styling and positioning.
 *
 * @param {string} message - The message to display in the toast.
 * @param {string} [type="success"] - The type of the toast, either "success" or "error".
 * Defaults to "success" if not provided.
 * @returns {void}
 *
 * @example
 * // Display a success toast
 * showToast("Operation completed successfully.");
 *
 * @example
 * // Display an error toast
 * showToast("An error occurred.", "error");
 */
const showToast = (message, type = "success") => {
  console.log("run");

  // Define solid background colors and text styles for success and error
  const styles = {
    success: {
      backgroundColor: "#28a745", // Solid green
      textColor: "#ffffff", // White text
    },
    error: {
      backgroundColor: "#dc3545", // Solid red
      textColor: "#ffffff", // White text
    },
  };

  const { backgroundColor, textColor } = styles[type] || styles.success;

  // Call Toastify with the provided message and type
  Toastify({
    text: `<span style="color: ${textColor}">${message}</span>`, // Bold white text
    duration: 3000, // Duration in ms
    close: false, // Show close icon
    gravity: "top", // Position: "top" or "bottom"
    position: "center", // Position: "left", "center", or "right"
    backgroundColor: backgroundColor, // Solid background color
    escapeMarkup: false, // Allows HTML in text
  }).showToast();
};

module.exports = {
  getCurrentDatetime,
  smoothScrollById,
  setupScrollListeners,
  showToast,
};
