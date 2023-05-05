export const downloadImage = async (images, imageIndex) => {
    const imageURL = images[imageIndex];
    try {
        const imageData = await fetch(imageURL);
        if (!imageData.ok) {
            throw new Error(imageData.statusText);
        }
        const imageBlob = await imageData.blob();
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        const queryStringIndex = imageURL.indexOf('?');
        const imageName = queryStringIndex !== -1 ? 
            imageURL.substring(imageURL.lastIndexOf('/') + 1, queryStringIndex) : 
            imageURL.substring(imageURL.lastIndexOf('/') + 1);
        a.download = imageName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
    }
}