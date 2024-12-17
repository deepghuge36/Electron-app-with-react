function addWatermark() {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas dimensions to match the viewport
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Set watermark text properties
  ctx.font = "50px SamsungOne";
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Adjust opacity as needed
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Add the watermark text
  let content = "";
  for (let index = 0; index < 1000; index++) {
    content += `Cheil India `;
  }
  ctx.fillText(content, canvas.width / 2, canvas.height / 2);

  // Convert canvas to data URL
  const watermarkImage = canvas.toDataURL();

  // Create a div to hold the watermark
  let img_url = "../assets/images/png/water-mark.png";
  const watermarkDiv = document.createElement("div");
  watermarkDiv.style.position = "fixed";
  watermarkDiv.style.zIndex = "999999";
  // watermarkDiv.style.transform = 'rotate(-45deg)';
  // watermarkDiv.style.wordWrap = 'break-word';
  watermarkDiv.style.opacity = "0.7";
  watermarkDiv.style.top = "0";
  watermarkDiv.style.left = "0";
  watermarkDiv.style.width = "100vw";
  watermarkDiv.style.height = "100vw";
  // watermarkDiv.style.backgroundImage = `url(${watermarkImage})`;
  watermarkDiv.style.backgroundImage = `url(${img_url})`;
  watermarkDiv.style.pointerEvents = "none"; // Allow interaction with underlying elements

  // Add the watermark div to the document body
  document.body.appendChild(watermarkDiv);
}

// Call the function to add the watermark
addWatermark();
