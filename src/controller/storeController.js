const storesJson = require('../data/stores.json');
const util = require('../constants/util');
const statusCode = require('../constants/statusCode');
const postcodes = require('node-postcodes.io');
const logger = require('../config/winston');

const getAllStores = (req, res) => {
    try {
        logger.info('GET /store/AllStores');
        // 상점들의 이름만 가져오고 싶다면 11 lines에서 'return item.nane'으로 변경
        let storeData = [];
        storesJson.forEach((item) => {
            storeData.push(item);
        });

        // 가져올 수 있는 도시의 정보가 없을 경우.
        if (storeData.length === 0) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(statusCode.NOT_FOUND, 'no store in saved list')
                );
        } else {
            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, storeData));
        }
    } catch (err) {
        logger.error('GET /store/AllStores');
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.response));
    }
};

const getSpecificStore = (req, res) => {
    try {
        logger.info('GET /store/SpecificStore');
        const store = req.params.store;

        // 비교 조건을 따지기 위해 'filter'로 조회.
        let stores = storesJson.filter((item) => {
            if (item.name === store) {
                return item;
            }
        });
        // 해당 도시가 없거나, 혹은 도시의 이름이 잘못되었을 경우 처리.
        if (stores.length === 0) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(
                        statusCode.NOT_FOUND,
                        'no store about the request in the stored list OR wrong store name'
                    )
                );
        } else {
            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, stores));
        }
    } catch (err) {
        logger.error('GET /store/SpecificStore');
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.response));
    }
};

const getLatLongFromPostcode = async (req, res) => {
    try {
        logger.info('GET /store/LatLongFromPostcode');

        const postcode = req.params.postcode;
        // 우선 postcode에 대한 유효성 검사 먼저.
        const validateRes = await postcodes.validate(postcode);
        // 유효성검사 실패.
        if (validateRes.result === false) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(
                        statusCode.NOT_FOUND,
                        'no postcode like the request OR this postcode was deleted.'
                    )
                );
        }
        // 주어진 postcode로 해당 위도, 경도 추출.
        const lookupRes = await postcodes.lookup(postcode);
        const result = {
            latitude: lookupRes.result.latitude,
            longitude: lookupRes.result.longitude,
        };
        return res
            .status(statusCode.OK)
            .send(util.success(statusCode.OK, result));
    } catch (err) {
        logger.error('GET /store/LatLongFromPostcode');
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.response));
    }
};

const getAroundStores = async (req, res) => {
    try {
        logger.info('GET /store/AroundStores');

        const radius = req.query.radius;
        const postcode = req.params.postcode;
        // 우선 postcode에 대한 유효성 검사 먼저.
        const validateRes = await postcodes.validate(postcode);
        if (validateRes.result === false) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(
                        statusCode.NOT_FOUND,
                        'no postcode like the request'
                    )
                );
        }
        const lookupRes = await postcodes.lookup(postcode);

        const latitude = lookupRes.result.latitude;
        const longitude = lookupRes.result.longitude;
        // lookup 함수를 통해 주어진 postcode로 부터 위도, 경도를 가져옴.
        // radius는 optional
        const geoResult = await postcodes.geo([
            {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            },
        ]);

        // postcode가 정상적이라면, 반드시 중심의 도시 하나(요청한 postcode에 대하여)는 있어야 한다. 하지만 결과가 나오지 않는다는 것은 radius가 음수라는 의미.
        if (geoResult.result[0].result === null) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(
                        statusCode.NOT_FOUND,
                        'radius must be positive number'
                    )
                );
        } else {
            // 주변에 모든 가능한 상점들을 조회.
            let aroundStores = [];
            geoResult.result[0].result.forEach((store) => {
                aroundStores.push({
                    postcode: store.postcode,
                    latitude: store.latitude,
                    longitude: store.longitude,
                });
            });

            // 북쪽에서 남쪽으로 정렬. (위도 이용)
            aroundStores.sort((a, b) => {
                return a.latitude > b.latitude ? -1 : 1;
            });

            // 가능한 도시들 중에 store.json 에 있는 도시들만.
            let listOfStores = storesJson.filter((item) => {
                return aroundStores.find((store) => {
                    return item.postcode === store.postcode;
                });
            });

            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, listOfStores));
        }
    } catch (err) {
        logger.error('GET /store/AroundStores');
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.response));
    }
};

module.exports = {
    getAllStores,
    getSpecificStore,
    getLatLongFromPostcode,
    getAroundStores,
};
