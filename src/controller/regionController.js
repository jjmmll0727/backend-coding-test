const storesJson = require('../data/stores.json');
const util = require('../constants/util');
const statusCode = require('../constants/statusCode');
const postcodes = require('node-postcodes.io');

const getAllCities = (req, res) => {
    try {
        // forEach 보다 map의 성능이 좋기 때문에 map으로 조회
        let storeData = storesJson.map((item) => {
            return item.name;
        });

        if (storeData.length === 0) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(util.fail(statusCode.NOT_FOUND, 'no stored data'));
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

        // 2개 이상의 도시가 있을 수 있으니까 'find'가 아닌 'filter'로 조회.
        let cities = storesJson.filter((item) => {
            if (item.name === city) {
                return item;
            }
        });
        // 해당 도시가 없거나, 혹은 도시의 이름이 잘못되었을 경우 처리.
        if (cities.length === 0) {
            return res
                .status(statusCode.NOT_FOUND)
                .send(
                    util.fail(
                        statusCode.NOT_FOUND,
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

const getLatLongFromPostcode = async (req, res) => {
    try {
        const postcode = req.params.postcode;
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
        const result = {
            city: lookupRes.result.parliamentary_constituency,
            latitude: lookupRes.result.latitude,
            longitude: lookupRes.result.longitude,
        };
        return res
            .status(statusCode.OK)
            .send(util.success(statusCode.OK, result));
    } catch (err) {
        console.log(err);
        return res
            .status(statusCode.INTERNAL_SERVER_ERROR)
            .send(util.fail(statusCode.BAD_REQUEST, err.response));
    }
};

const getAroundCities = async (req, res) => {
    try {
        const radius = req.query.radius;
        const postcode = req.params.postcode;
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
        const geoResult = await postcodes.geo([
            {
                latitude: latitude,
                longitude: longitude,
                radius: radius,
            },
        ]);
        // postcode가 정상적이라면, 반드시 중심의 도시 하나는 있어야 한다. 하지만 결과가 나오지 않는다는 것은 radius가 음수라는 의미.
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
            // 주변에 모든 가능한 도시들을 조회.
            let aroundCities = geoResult.result[0].result.map((city) => {
                return {
                    postcode: city.postcode,
                    latitude: city.latitude,
                    longitude: city.longitude,
                };
            });
            // 북쪽에서 남쪽으로 정렬 (위도 이용).
            aroundCities.sort((a, b) => {
                return a.latitude > b.latitude ? -1 : 1;
            });

            // 가능한 도시들 중에 store.json 에 있는 도시들만.
            let listOfCities = storesJson.filter((item) => {
                return aroundCities.find((city) => {
                    return item.postcode === city.postcode;
                });
            });

            // let storedCity = listOfCities.map((city) => {
            //     return city;
            // });
            return res
                .status(statusCode.OK)
                .send(util.success(statusCode.OK, listOfCities));
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
    getLatLongFromPostcode,
    getAroundCities,
};
