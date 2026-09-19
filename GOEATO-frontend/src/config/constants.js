/**
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Food Categories
export const FOOD_CATEGORIES = [
  'All',
  'Biryani',
  'Starters',
  'Breakfast',
  'Pizza',
  'Burgers',
  'Main',
  'Desserts',
  'Beverages',
];

// Order Status Pipeline
export const ORDER_STATUS_PIPELINE = ['placed', 'preparing', 'delivering', 'delivered'];

// Order status steps rendered by the live tracking stepper (see Orders.jsx).
export const ORDER_STEPS = [
  { key: 'placed', label: 'Order Placed', iconKey: 'ticket' },
  { key: 'preparing', label: 'Preparing', iconKey: 'flame' },
  { key: 'delivering', label: 'On The Way', iconKey: 'box' },
  { key: 'delivered', label: 'Delivered', iconKey: 'check' },
];

// Payment Methods
export const PAYMENT_METHODS = ['cod', 'upi'];

// Address Types
export const ADDRESS_TYPES = ['Home', 'Work', 'Other'];

// Pricing Configuration
export const PRICING = {
  FREE_DELIVERY_THRESHOLD: 400,
  DELIVERY_FEE: 35,
  PLATFORM_FEE: 5,
  TAX_RATE: 0.05,
  MAX_QTY: 99,
};

// Toast Durations (ms)
export const TOAST_DURATIONS = {
  SHORT: 2500,
  MEDIUM: 3500,
  LONG: 4000,
  VERY_LONG: 6000,
};

// Image Defaults
export const DEFAULT_IMAGES = {
  FOOD: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  RESTAURANT: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  RESTAURANT_HERO: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'goeato_token',
  USER: 'goeato_user',
  CART: 'goeato_cart',
};

// Admin Tabs
export const ADMIN_TABS = ['orders', 'inventory', 'create'];

// Order Filters
export const ORDER_FILTERS = ['all', 'placed', 'preparing', 'delivering', 'delivered', 'cancelled'];

// Socket Configuration
export const SOCKET_CONFIG = {
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
  TRANSPORTS: ['websocket', 'polling'],
};

// Debounce Delays (ms)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_ADDRESS_LENGTH: 500,
  MAX_INSTRUCTIONS_LENGTH: 200,
};