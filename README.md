# Capa backend coding test

## About this task

Think of this as an open source project. How would this have to look in order for you to be impressed with it.

Please spend at least 90 minutes on this test. Feel free to take more time if you wish - make sure you are happy with your submission!

_Hint_: we are looking for a high-quality submission with great application architecture. Not a "get it done" approach.

Remember that this test is your opportunity to show us how you think. Be clear about how you make decisions in your code, whether that is with comments, tests, or how you name things.

## What to do

### First

* Create a new Javascript-based api service (any framework is fine)
  * TypeScript would be good, too.

### Make your API consumer happy

Let API consumer

* can get the list of stores in `stores.json`
* can get the specific item of stores in `stores.json`
  * Your API consumer can identify the item with its name
* can get the latitude and longitude for each postcode.
  * You can use postcodes.io to get the latitude and longitude for each postcode.
* can get the functionality that allows you to return a list of stores in a given radius of a given postcode in the UK. The list must be ordered from north to south.

### Finally

* Send the link of your repository.
* Provide answers for the following questions with your submission:
  1. If you had chosen to spend more time on this test, what would you have done differently?
  2. What part did you find the hardest? What part are you most proud of? In both cases, why?
  3. What is one thing we could do to improve this test?



***


# RESULT

### 1. can get the list of stores in `stores.json`
> `localhost:3000/store/AllStores`

```json
{
    "status": 200,
    "success": true,
    "data": [
        {
            "name": "St_Albans",
            "postcode": "AL1 2RJ"
        },
        {
            "name": "Hatfield",
            "postcode": "AL9 5JP"
        },
        {
            "name": "Worthing",
            "postcode": "BN14 9GB"
        },
        {
            "name": "Rustington",
            "postcode": "BN16 3RT"
        },
        ...
```

***

### 2. can get the specific item of stores in `stores.json`
> `localhost:3000/store/SpecificStore/:store`

- ### success 
`localhost:3000/store/SpecificStore/St_Albans`
```json
{
    "status": 200,
    "success": true,
    "data": [
        {
            "name": "St_Albans",
            "postcode": "AL1 2RJ"
        }
    ]
}
```

- ### fail 
`localhost:3000/store/SpecificStore/St_Alban`
```json
{
    "status": 404,
    "success": false,
    "data": "no store about the request in the stored list OR wrong store name"
}
```

***

### 3. can get the latitude and longitude for each postcode.
> `localhost:3000/store/LatLongFromPostcode/:postcode`

- ### success 
`localhost:3000/store/LatLongFromPostcode/AL1 2RJ`

```json
{
    "status": 200,
    "success": true,
    "data": {
        "latitude": 51.741753,
        "longitude": -0.341337
    }
}
```

- ### fail 
`localhost:3000/store/LatLongFromPostcode/AL1 2RJ1`


```json
{
    "status": 404,
    "success": false,
    "data": "no postcode like the request OR this postcode was deleted."
}
```

***

### 4. can get the functionality that allows you to return a list of stores in a given radius of a given postcode in the UK.
> `localhost:3000/store/AroundStores/:postcode?radius=`

- ### success 
`localhost:3000/store/AroundStores/AL1 2RJ?radius=1000`

```json
{
    "status": 200,
    "success": true,
    "data": [
        {
            "name": "St_Albans",
            "postcode": "AL1 2RJ"
        }
    ]
}
```

- ### fail 1 
`localhost:3000/store/AroundStores/AL1 2RJ1?radius=1000`

```json
{
    "status": 404,
    "success": false,
    "data": "no postcode like the request"
}
```

- ### fail 2
`localhost:3000/store/AroundStores/AL1 2RJ?radius=-1`

```json
{
    "status": 404,
    "success": false,
    "data": "radius must be positive number"
}
```

***

# ANSWERS 

1. If you had chosen to spend more time on this test, what would you have done differently?
- 해당 api를 이용하는 사용자들을 위해 상점을 추가할 수 있는 api를 구축할 것이다. 
- 검색 시간을 줄일 수 있는 방법을 고민해 볼 것이다. 

2. What part did you find the hardest? What part are you most proud of? In both cases, why?
- 더미데이터의 영이 적다 보니, 해당 api의 테스트 결과에 대한 신뢰성이 떨어졌다. 마지막 api결과를 가져올 때, store가 한개만 나왔고, 이를 확인하기 위해 직접 구글맵에서 우편번호를 검색해서 확인하는 수 밖에 없었다.
- forEach 보다 성능이 뛰어난 map 함수를 사용하였다.
- postcode,io 를 통해 가져온 데이터와 store.json에 있는 데이터를 비교할 때 filter, find를 통해 비교하였다. 
- logging 라이브러리 winston을 사용하여 로그를 확인할 수 있다. 
- api의 예외처리를 하였다. (잘못된 postcode, 잘못된 상점이름, 음수 반지름)

3. What is one thing we could do to improve this test?
- 더미데이터의 양을 늘리면 좋을 것 같다. 
- 더미데이터 중에 삭제된 우편번호도 존재했었다. 테스트의 원활한 결과를 위해 데이터들의 전체적인 업데이트가 필수적이라고 생각된다. 