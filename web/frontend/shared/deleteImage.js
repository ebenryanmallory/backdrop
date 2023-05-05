export const deleteImage = async (images, imageIndex, fetch) => {
    try {
      const deleteImageResponse = await fetch('/api/delete-user-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: images[imageIndex] })
      });

      if (!deleteImageResponse.ok) {
        throw new Error(deleteImageResponse.statusText);
      }

      const jsonResponse = await deleteImageResponse.json();
      console.log(jsonResponse?.message)

    } catch (error) {
      console.error(error);
    }
  }