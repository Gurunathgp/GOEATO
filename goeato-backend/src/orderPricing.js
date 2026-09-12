const DELIVERY_FEE = 35;
const FREE_DELIVERY_THRESHOLD = 400;
const PLATFORM_FEE = 5;
const TAX_RATE = 0.05;

function calculateOrderPricing(subtotal) {
  const deliveryFee = subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const platformFee = subtotal > 0 ? PLATFORM_FEE : 0;
  const tax = Math.round(subtotal * TAX_RATE);

  return {
    subtotal,
    deliveryFee,
    platformFee,
    tax,
    total: subtotal + deliveryFee + platformFee + tax,
  };
}

module.exports = {
  calculateOrderPricing,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PLATFORM_FEE,
  TAX_RATE,
};
