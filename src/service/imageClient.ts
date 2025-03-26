import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { Readable } from "stream";
import { createHash } from "crypto";

class ImageUploaderClient {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

  private promiseImageUpload(bufferData: Buffer, publicId: string) {
    return new Promise((resolve, reject) => {
      const stream = new Readable();
      stream.push(bufferData);
      stream.push(null);
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image", public_id: publicId },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        }
      );
      stream.pipe(uploadStream);
    });
  }

  public async uploadImageStream(imageBuffer: Buffer, name: string) {
    const publicId = createHash("sha1").update(name).digest("hex");
    try {
      const response = await this.promiseImageUpload(imageBuffer, publicId);
      return response as UploadApiResponse;
    } catch (err) {
      console.error((err as UploadApiErrorResponse).message);
      return null;
    }
  }

  public async uploadImageFromUrl(imageUrl: string) {
    try {
      const response = await cloudinary.uploader.upload(imageUrl);
      return response;
    } catch (err) {
      console.error((err as UploadApiErrorResponse).message);
      return null;
    }
  }

  public createSignature() {
    const timestamp = Math.round(Date.now() / 1000) + 3600;
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "pigeon-messanger",
        resource_type: "auto",
      },
      process.env.CLOUD_API_SECRET!
    );
    return { signature, timestamp };
  }
}

const imageClient = new ImageUploaderClient();
export { imageClient };
