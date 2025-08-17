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
}

export default new ReturnSuccess();