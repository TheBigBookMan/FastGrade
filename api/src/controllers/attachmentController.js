import logger from "../utils/logger.js";
import attachmentService from '../services/attachmentService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";
import {uploadToR2} from "../utils/upload/r2.js";
import {generateThumbnail} from "../utils/upload/thumbnail.js";

class AttachmentController {
    async fetchAttachmentsByUserId (req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const attachments = await attachmentService.getAttachmentsByUserId(userId);

            return returnSuccess.successFetch(res, attachments, 'Successfully fetch attachments');

        } catch(err) {
            return returnError.internalError(res, 'Error fetching attachments by userId', err);
        }
    }

    async postAttachment(req, res) {
        try {
            const { userId } = req.params;
            const { name, description } = req.body;
            const file = req.file;

            if (!userId) return res.status(400).json({ error: "Missing userId" });
            if (!name) return res.status(400).json({ error: "Missing name" });
            if (!file) return res.status(400).json({ error: "File is required" });

            // Extract metadata
            const originalName = file.originalname;
            const fileSize = file.size;
            const mimeType = file.mimetype;
            const fileType = mimeType.split("/")[1];

            // Upload file & thumbnail
            const fileUrl = await uploadToR2(file.buffer, originalName, mimeType);
            const thumbnailUrl = mimeType.startsWith("image/")
                ? await generateThumbnail(file.buffer, originalName)
                : null;

            // Save in DB
            await attachmentService.createAttachment({
                userId,
                name,
                description,
                url: fileUrl,
                thumbnailUrl,
                originalName,
                fileType,
                fileSize,
                mimeType
            });

            return returnSuccess.successCreate(res, 'Attachment successfully created');

        } catch (err) {
            return returnError.internalError(res, 'Error creating attachment', err);
        }
    }

    async fetchAttachmentByUserId (req, res) {
        try {

            const {userId, attachmentId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!attachmentId) return returnError.loggerWarnRequiredAttribute(res, 'attachment', 'attachmentId');

            const attachment = await attachmentService.getAttachmentByUserId(userId, attachmentId);

            return returnSuccess.successFetch(res, attachment, 'Successfully fetch attachment');

        } catch(err) {
            return returnError.internalError(res, 'Error fetching attachment', err);
        }
    }
}

export default new AttachmentController();