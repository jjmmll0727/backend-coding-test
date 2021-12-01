const storesJson = require('../data/stores.json');
const util = require('../constants/util');
const statusCode = require('../constants/statusCode');

const getAllCities = (req, res) => {
    try {
        let storeData = [];
        // json파일에 저장된 도시들의 이름만 추출하여 배열에 저장.
        storesJson.forEach((item) => {
            storeData.push(item.name);
        });

        if (storeData.length === 0) {
            return res
                .status(statusCode.NO_CONTENT)
                .send(util.success(statusCode.NO_CONTENT, 'no stored data'));
        } else {
            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, storeData));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.BAD_REQUEST, err.response));
    }
};

const getSpecificCity = (req, res) => {
    try {
        const city = req.params.city;
        const cities = []; // 혹시 같은 이름의 도시가 있을 수 있으니, 가능한 모든 도시를 뽑기 위해 배열 선언.

        // consumer가 원하는 도시에 대한 정보를 추출.
        storesJson.forEach((item) => {
            if (item.name === city) {
                cities.push(item);
            }
        });

        // 해당 도시가 없거나, 혹은 도시의 이름이 잘못되었을 경우 처리.
        if (cities.length === 0) {
            return res
                .status(statusCode.NO_CONTENT)
                .send(
                    util.success(
                        statusCode.NO_CONTENT,
                        'no city about the request OR wrong city name'
                    )
                );
        } else {
            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, cities));
        }
    } catch (err) {
        console.log(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.BAD_REQUEST, err.response));
    }
};

module.exports = {
    getAllCities,
    getSpecificCity,
};
