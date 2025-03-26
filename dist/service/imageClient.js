"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageClient = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const crypto_1 = require("crypto");
class ImageUploaderClient {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
        });
    }
    promiseImageUpload(bufferData, publicId) {
        return new Promise((resolve, reject) => {
            const stream = new stream_1.Readable();
            stream.push(bufferData);
            stream.push(null);
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: "image", public_id: publicId }, (err, res) => {
                if (err)
                    return reject(err);
                resolve(res);
            });
            stream.pipe(uploadStream);
        });
    }
    uploadImageStream(imageBuffer, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicId = (0, crypto_1.createHash)("sha1").update(name).digest("hex");
            try {
                const response = yield this.promiseImageUpload(imageBuffer, publicId);
                return response;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    uploadImageFromUrl(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield cloudinary_1.v2.uploader.upload(imageUrl);
                return response;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    createSignature() {
        const timestamp = Math.round(Date.now() / 1000) + 3600;
        const signature = cloudinary_1.v2.utils.api_sign_request({
            timestamp: timestamp,
            folder: "pigeon-messanger",
            resource_type: "auto",
        }, process.env.CLOUD_API_SECRET);
        return { signature, timestamp };
    }
}
const imageClient = new ImageUploaderClient();
exports.imageClient = imageClient;
