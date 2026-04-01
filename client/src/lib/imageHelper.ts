import { getImageUrl } from "./utils";

const isImageExist = async (imageUrl: string) => {
  try {
    const response = await fetch(`${getImageUrl(imageUrl)}`, {
      method: "HEAD",
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to fetch image", error);
    return false;
  }
};

export { isImageExist };
