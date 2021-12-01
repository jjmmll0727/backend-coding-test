module.exports = {
    success: (status, data) => ({
        status,
        success: true,
        data,
    }),
    fail: (status, data) => ({
        status,
        success: false,
        data,
    }),
};
