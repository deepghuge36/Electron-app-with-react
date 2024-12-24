// utils/util.js
export const imageBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return await blobToBase64(blob)
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

const blobToBase64 = async (blob) => {
  const reader = new FileReader()
  reader.onload = () => reader.result
  reader.readAsDataURL(blob)
}
