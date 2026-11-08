/**
 * Reads a picked photo into a small square JPEG data URL. Cropping and
 * downscaling keep the demo profile inside localStorage limits.
 */
export const fileToAvatarDataUrl = (file: File, size = 512): Promise<string> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      try {
        const side = Math.min(image.width, image.height);
        const sourceX = (image.width - side) / 2;
        const sourceY = (image.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is not available");

        context.drawImage(
          image,
          sourceX,
          sourceY,
          side,
          side,
          0,
          0,
          size,
          size,
        );
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the image"));
    };

    image.src = objectUrl;
  });
