require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Restaurant = require('../../models/Restaurant');
const FoodItem = require('../../models/FoodItem');

async function main() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/goeato';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding...');

  await FoodItem.deleteMany({});
  await Restaurant.deleteMany({});

  const restaurantsData = [
    {
      name: 'Royal Biryani & Kebabs',
      location: 'Indiranagar, Bengaluru',
      cuisine: 'Biryani, Mughlai, Kebabs',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      name: 'The Green Bowl & South Delights',
      location: 'Koramangala, Bengaluru',
      cuisine: 'South Indian, Healthy Bowls',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
    },
    {
      name: 'Artisan Pizza & Burger Lab',
      location: 'HSR Layout, Bengaluru',
      cuisine: 'Italian, Burgers, Fast Food',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },
    {
      name: 'Coastal Flavors Seafood',
      location: 'Whitefield, Bengaluru',
      cuisine: 'Seafood, Coastal, Curry',
      image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
    },
  ];
  const restaurants = await Restaurant.insertMany(restaurantsData);

  const items = [
    // Royal Biryani & Kebabs
    {
      name: 'Hyderabadi Dum Biryani',
      price: 299,
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      category: 'Biryani',
      veg: false,
      description: 'Slow-cooked fragrant basmati rice layered with succulent spiced chicken and saffron.',
      available: true,
      restaurantId: restaurants[0]._id,
    },
    {
      name: 'Paneer Tikka Platter',
      price: 240,
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
      category: 'Starters',
      veg: true,
      description: 'Cottage cheese cubes marinated in tandoori spices and charred over open coals.',
      available: true,
      restaurantId: restaurants[0]._id,
    },
    {
      name: 'Shahi Veg Biryani',
      price: 220,
      img: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=600&q=80',
      category: 'Biryani',
      veg: true,
      description: 'Fragrant basmati rice infused with whole spices, garden vegetables, and caramelized onions.',
      available: true,
      restaurantId: restaurants[0]._id,
    },
    {
      name: 'Chicken Seekh Kebab',
      price: 270,
      img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      category: 'Starters',
      veg: false,
      description: 'Minced chicken seasoned with fresh mint, coriander, and spices, skewered and grilled.',
      available: true,
      restaurantId: restaurants[0]._id,
    },

    // The Green Bowl & South Delights
    {
      name: 'Crispy Masala Dosa',
      price: 110,
      img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      category: 'Breakfast',
      veg: true,
      description: 'Golden fermented crepe filled with spiced potato masala, served with coconut chutney & sambar.',
      available: true,
      restaurantId: restaurants[1]._id,
    },
    {
      name: 'Steamed Ghee Podi Idli',
      price: 90,
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      category: 'Breakfast',
      veg: true,
      description: 'Fluffy steamed rice cakes tossed in aromatic spiced gunpowder and clarified butter.',
      available: true,
      restaurantId: restaurants[1]._id,
    },
    {
      name: 'Mediterranean Salad Bowl',
      price: 250,
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      category: 'Main',
      veg: true,
      description: 'Quinoa, roasted chickpeas, cucumber, cherry tomatoes, olives, and tahini drizzle.',
      available: true,
      restaurantId: restaurants[1]._id,
    },

    // Artisan Pizza & Burger Lab
    {
      name: 'Woodfired Margherita Pizza',
      price: 340,
      img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
      category: 'Pizza',
      veg: true,
      description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil.',
      available: true,
      restaurantId: restaurants[2]._id,
    },
    {
      name: 'Smoky BBQ Smash Burger',
      price: 280,
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      category: 'Burgers',
      veg: false,
      description: 'Double juicy grilled patty with caramelized onions, cheddar cheese, and house BBQ sauce in brioche.',
      available: true,
      restaurantId: restaurants[2]._id,
    },
    {
      name: 'Crispy Truffle Fries',
      price: 160,
      img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
      category: 'Starters',
      veg: true,
      description: 'Golden skin-on french fries tossed with parmesan herbs and aromatic white truffle oil.',
      available: true,
      restaurantId: restaurants[2]._id,
    },

    // Coastal Flavors Seafood
    {
      name: 'Mangalorean Fish Fry',
      price: 320,
      img: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=600&q=80',
      category: 'Starters',
      veg: false,
      description: 'Fresh kingfish steak coated in fiery red byadgi chili masala and rava fried to perfection.',
      available: true,
      restaurantId: restaurants[3]._id,
    },
    {
      name: 'Prawn Ghee Roast',
      price: 380,
      img: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80',
      category: 'Main',
      veg: false,
      description: 'Succulent juicy prawns simmered in a tangy spiced Mangalorean ghee masala.',
      available: true,
      restaurantId: restaurants[3]._id,
    },
  ];
  const foods = await FoodItem.insertMany(items);

  // Link food items to their restaurant menu
  for (const r of restaurants) {
    const menuIds = foods.filter((f) => f.restaurantId.toString() === r._id.toString()).map((f) => f._id);
    await Restaurant.findByIdAndUpdate(r._id, { menu: menuIds });
  }

  // Seed default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@goeato.local';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin123!';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPass, 10);
    await new User({
      name: process.env.ADMIN_NAME || 'GoEato Admin',
      email: adminEmail,
      password: hash,
      role: 'admin',
    }).save();
    console.log(`Created default admin: ${adminEmail} / ${adminPass}`);
  }

  // Seed default customer user
  const userEmail = 'user@goeato.local';
  const userPass = 'User123!';
  const existingUser = await User.findOne({ email: userEmail });
  if (!existingUser) {
    const hash = await bcrypt.hash(userPass, 10);
    await new User({
      name: 'Rahul Sharma',
      email: userEmail,
      password: hash,
      role: 'user',
    }).save();
    console.log(`Created default user: ${userEmail} / ${userPass}`);
  }

  console.log(`Successfully seeded ${restaurants.length} restaurants and ${foods.length} food items.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
