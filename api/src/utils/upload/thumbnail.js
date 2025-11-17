import sharp from "sharp";
import { uploadToR2 } from "./r2.js";

export async function generateThumbnail(buffer, originalName) {
    const resized = await sharp(buffer)
        .resize(300)      // width 300px
        .jpeg({ quality: 80 })
        .toBuffer();

    return uploadToR2(resized, `thumb-${originalName}`, "image/jpeg");
}
