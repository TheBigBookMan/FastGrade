class ReturnSuccess {
    successCreate(res, data = null, message = 'Resource created successfully') {
        const response = {
            success: true,
            message,
            timestamp: new Date().toISOString()
        };

        if(!data) response.data = data;

        return res.status(201).json(response);
    }

    successFetch(res, data, message = 'data') {
        const responseMessage = `Successfully fetched ${message}`;
        return res.status(200).json({
            success: true,
            message: responseMessage,
            data,
            timestamp: new Date().toISOString()
        });
    }
}

export default new ReturnSuccess();