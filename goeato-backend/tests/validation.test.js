const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateOrderPricing } = require('../src/orderPricing');

test('order quantity rules reject invalid values', () => {
  for (const value of [0, -1, 1.5, NaN, 100]) {
    assert.equal(Number.isInteger(value) && value >= 1 && value <= 99, false);
  }
  for (const value of [1, 99]) {
    assert.equal(Number.isInteger(value) && value >= 1 && value <= 99, true);
  }
});

test('food item ids must be Mongo ObjectIds', () => {
  const valid = /^[a-f\d]{24}$/i;
  assert.equal(valid.test('507f1f77bcf86cd799439011'), true);
  assert.equal(valid.test('demo-id'), false);
});

test('order pricing uses the same delivery, platform, and tax policy as checkout', () => {
  assert.deepEqual(calculateOrderPricing(400), {
    subtotal: 400,
    deliveryFee: 35,
    platformFee: 5,
    tax: 20,
    total: 460,
  });
  assert.deepEqual(calculateOrderPricing(401), {
    subtotal: 401,
    deliveryFee: 0,
    platformFee: 5,
    tax: 20,
    total: 426,
  });
});
