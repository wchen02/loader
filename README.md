# loader
Loads data from normalizer to database.

## Getting Started
1. Clone the repo

    `git clone git@github.com:wchen02/loader.git`

2. Install

    `npm install`

3. Run

    `npm start`

## Data JSON
Takes normalized data JSON and insert data into database tables.
```json
{
  "title": "",
  "text1": null,
  "text2": null,
  "text3": null,
  "num1": null,
  "num2": null,
  "select1": null,
  "select2": null,
  "select3": null,
  "select4": null,
  "select5": null,
  "date": 1563692400,
  "details": "新装，独立出入，两房一厅。亮丽光猛，环境优雅整洁，购物交通方便，易趴车。$1480。\r 法拉盛。134街 / 58AV   电话： 212-971-4466。或 短信 谢谢！",
  "gallery": [
    "attachs/2019/07/21/c869443a-1961-4f02-9aeb-745ade51b395.jpg"
  ],
  "longitude": "",
  "latitude": "",
  "photo": "",
  "contact_person": "游客",
  "contact_phone": "2129714466",
  "contact_qq": "",
  "contact_address": "",
  "url": "http://c.dadi360.com/c/posts/list/2030337.page",
  "cate_id": 47,
  "city_id": 1,
  "area_id": 1,
  "business_id": 1,
  "urgent_date": "2019-07-21",
  "top_date": "2019-07-21",
  "audit": 1,
  "user_id": 2
}
```

### bao_life table
```javascript
const dbJson = {
    title: dataJson.title,
    text1: dataJson.text1,
    text2: dataJson.text2,
    text3: dataJson.text3,
    num1: dataJson.num1,
    num2: dataJson.num2,
    select1: dataJson.select1,
    select2: dataJson.select2,
    select3: dataJson.select3,
    select4: dataJson.select4,
    select5: dataJson.select5,
    create_time: dataJson.date,
    lng: dataJson.longitude,
    lat: dataJson.latitude,
    photo: dataJson.photo,
    contact: dataJson.contact_person,
    mobile: dataJson.contact_phone,
    urgent_date: dataJson.urgent_date,
    top_date: dataJson.top_date,
    qq: dataJson.contact_qq,
    addr: dataJson.contact_address,
    cate_id: dataJson.cate_id,
    city_id: dataJson.city_id,
    area_id: dataJson.area_id,
    business_id: dataJson.business_id,
    audit: dataJson.audit,
    user_id: dataJson.user_id,
};
```

### bao_life_details table
```javascript
const dbJson = {
    life_id: lifeId,
    details: details
};
```

### bao_life_photos table
Loop and insert each image specified in dataJson.gallery field into `bao_life_photos` table

```javascript
const dbJson = {
    life_id: lifeId,
    photo: imageFilename
};
```