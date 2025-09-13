import logger from "../utils/logger.js";
import attachmentService from '../services/attachmentService.js';
import returnError from "../middleware/returnError.js";
import returnSuccess from "../middleware/returnSuccess.js";

class AttachmentController {
    async fetchAttachmentsByUserId (req, res) {
        try {

            const {userId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);

            const attachments = await attachmentService.getAttachmentsByUserId(userId);

            // TODO FIX THE RESPONES
            return res.json(attachments);

        } catch(err) {
            return returnError.internalError(res, 'Error fetching attachments by userId', err);
        }
    }

    async postAttachment(req, res) {
        try {

            const {userId} = req.params;
            const {name, description, imageURL} = req.body;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!name) return returnError.loggerWarnRequiredAttribute(res, 'attachment', 'name');

            const newAttachment = await attachmentService.createAttachment({
                userId, 
                name,
                description,
                imageURL
            });
// todo fix return
            return res.status(201).json(newAttachment);

        } catch(err) {
            return returnError.internalError(res, 'Error creating attachment', err);
        }
    }

    async fetchAttachmentByUserId (req, res) {
        try {

            const {userId, attachmentId} = req.params;

            if(!userId) return returnError.loggerWarnUserId(res);
            if(!attachmentId) return returnError.loggerWarnRequiredAttribute(res, 'attachment', 'attachmentId');

            const attachment = await attachmentService.getAttachmentByUserId(userId, attachmentId);

            // fix the response
            return res.json(attachment);

        } catch(err) {
            return returnError.internalError(res, 'Error fetching attachment', err);
        }
    }
}

export default new AttachmentController();