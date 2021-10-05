
const axios = require('axios');

// test on get review endpoint
test('Shout get status code 200 for my get request', async () => {
  var result = await axios.get('http://localhost:3000/reviews?product_id=555')
  .then(function (response) {
    return response.status
  })
  expect(result).toBe(200)
});

test('Shout get corroct data back for my get request', async () => {
  var result = await axios.get('http://localhost:3000/reviews?product_id=555')
  .then(function (response) {
    return response.data.product
  })
  expect(result).toBe("555")
});

// test on get meta end point
test('Shout get 200 status code from my meta get request', async () => {
  var result = await axios.get('http://localhost:3000/reviews/meta?product_id=555')
  .then(function (response) {
    return response.status
  })
  expect(result).toBe(200)
});

test('Shout get corroct data back for my meta get request', async () => {
  var result = await axios.get('http://localhost:3000/reviews/meta?product_id=555')
  .then(function (response) {
    return response.data.product_id
  })
  expect(result).toBe("555")
});

//test on post review endpoint
test('Shout get 201 status code from my review post request', async () => {
  var body = {
    "product_id":37311,
    "rating":5,
    "summary":"its a test",
    "body":"hello world",
    "recommend":true,
    "name":"yo",
    "email":"test@gmail.com",
    "photos":[],
    "characteristics":{}
}
  var result = await axios.post('http://localhost:3000/reviews',body)
  .then(function (response) {
    return (response.status)
  })
  expect(result).toBe(201)
});
test('Shout get corroct data back from my review post request', async () => {
  var body = {
    "product_id":37311,
    "rating":5,
    "summary":"its a test",
    "body":"hello world",
    "recommend":true,
    "name":"yo",
    "email":"test@gmail.com",
    "photos":[],
    "characteristics":{}
}
  var result = await axios.post('http://localhost:3000/reviews',body)
  .then(function (response) {
    return response.data
  })
  expect(result).toBe("inserted")
});


//test on updata helpfulness endpoint
test('Shout get 204 status code from my helpful put request', async () => {
  var result = await axios.put('http://localhost:3000/reviews/31100/helpful')
  .then(function (response) {
    return response.status
  })
  expect(result).toBe(204)
});


//test on update reported endpoint
test('Shout get 204 status code from my reported request', async () => {
  var result = await axios.put('http://localhost:3000/reviews/841430/report')
  .then(function (response) {
    return response.status
  })
  expect(result).toBe(204)
});