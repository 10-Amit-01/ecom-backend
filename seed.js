import mongoose from "mongoose";
import Product from "./models/product.js"; // Adjust the path to your model

// MongoDB connection string - UPDATE THIS
const MONGODB_URI = "mongodb://sahaiamit172_db_user:amit@ac-sfhyfto-shard-00-00.eycv9kl.mongodb.net:27017,ac-sfhyfto-shard-00-01.eycv9kl.mongodb.net:27017,ac-sfhyfto-shard-00-02.eycv9kl.mongodb.net:27017/?ssl=true&replicaSet=atlas-tno75x-shard-0&authSource=admin&appName=Cluster0";

// Product data templates
const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Beauty & Personal Care",
  "Furniture",
  "Jewelry",
  "Shoes"
];

const brands = {
  Electronics: ["Samsung", "Apple", "Sony", "LG", "Dell", "HP", "Canon", "Nikon"],
  Clothing: ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Gap", "Puma", "Under Armour"],
  "Home & Kitchen": ["KitchenAid", "Cuisinart", "OXO", "Pyrex", "Lodge", "Ninja"],
  "Sports & Outdoors": ["Nike", "Adidas", "Coleman", "North Face", "Patagonia", "REI"],
  Books: ["Penguin", "HarperCollins", "Random House", "Simon & Schuster"],
  "Toys & Games": ["LEGO", "Mattel", "Hasbro", "Fisher-Price", "Nerf"],
  "Beauty & Personal Care": ["L'Oreal", "Maybelline", "Neutrogena", "Dove", "Olay"],
  Furniture: ["IKEA", "Ashley", "Wayfair", "West Elm", "Crate & Barrel"],
  Jewelry: ["Tiffany & Co", "Pandora", "Swarovski", "Kay Jewelers"],
  Shoes: ["Nike", "Adidas", "Puma", "Reebok", "Converse", "Vans", "New Balance"]
};

const productNames = {
  Electronics: [
    "Wireless Headphones",
    "Smart Watch",
    "Laptop",
    "4K Monitor",
    "Bluetooth Speaker",
    "Camera",
    "Tablet",
    "Gaming Console",
    "Smartphone",
    "Wireless Mouse"
  ],
  Clothing: [
    "Cotton T-Shirt",
    "Denim Jeans",
    "Hoodie",
    "Jacket",
    "Dress Shirt",
    "Polo Shirt",
    "Shorts",
    "Sweater",
    "Track Pants",
    "Blazer"
  ],
  "Home & Kitchen": [
    "Coffee Maker",
    "Blender",
    "Air Fryer",
    "Cookware Set",
    "Knife Set",
    "Dinnerware Set",
    "Cutting Board",
    "Stand Mixer",
    "Toaster",
    "Food Processor"
  ],
  "Sports & Outdoors": [
    "Yoga Mat",
    "Dumbbell Set",
    "Running Shoes",
    "Camping Tent",
    "Backpack",
    "Water Bottle",
    "Fitness Tracker",
    "Basketball",
    "Tennis Racket",
    "Bicycle"
  ],
  Books: [
    "Mystery Novel",
    "Cookbook",
    "Self-Help Book",
    "Science Fiction",
    "Biography",
    "Poetry Collection",
    "Graphic Novel",
    "Travel Guide",
    "History Book",
    "Children's Book"
  ],
  "Toys & Games": [
    "Building Blocks",
    "Action Figure",
    "Board Game",
    "Puzzle",
    "Doll House",
    "Remote Control Car",
    "Educational Toy",
    "Stuffed Animal",
    "Art Supplies",
    "STEM Kit"
  ],
  "Beauty & Personal Care": [
    "Face Cream",
    "Shampoo",
    "Makeup Kit",
    "Perfume",
    "Hair Dryer",
    "Skincare Set",
    "Lipstick",
    "Body Lotion",
    "Face Mask",
    "Nail Polish"
  ],
  Furniture: [
    "Office Chair",
    "Dining Table",
    "Sofa",
    "Bookshelf",
    "Bed Frame",
    "Desk",
    "Coffee Table",
    "Nightstand",
    "TV Stand",
    "Wardrobe"
  ],
  Jewelry: [
    "Necklace",
    "Ring",
    "Bracelet",
    "Earrings",
    "Watch",
    "Pendant",
    "Anklet",
    "Brooch",
    "Charm",
    "Cufflinks"
  ],
  Shoes: [
    "Running Shoes",
    "Sneakers",
    "Boots",
    "Sandals",
    "Loafers",
    "High Heels",
    "Athletic Shoes",
    "Casual Shoes",
    "Formal Shoes",
    "Slippers"
  ]
};

// Unsplash image search terms for each category
const imageSearchTerms = {
  Electronics: "technology",
  Clothing: "fashion",
  "Home & Kitchen": "kitchen",
  "Sports & Outdoors": "sports",
  Books: "books",
  "Toys & Games": "toys",
  "Beauty & Personal Care": "beauty",
  Furniture: "furniture",
  Jewelry: "jewelry",
  Shoes: "shoes"
};

const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Gray", "Pink", "Purple", "Brown"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Helper function to generate slug
function generateSlug(title, index) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`;
}

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random items from array
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate Unsplash image URL
function generateUnsplashImages(category, productName, count = 3) {
  const searchTerm = imageSearchTerms[category] || "product";
  const images = [];
  
  for (let i = 0; i < count; i++) {
    const seed = `${productName}-${i}-${Math.random()}`;

    images.push({
      url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`,
      alt: `${productName} image ${i + 1}`
    });
  }
  
  return images;
}

// Generate a single product
function generateProduct(index) {
  const category = getRandomItem(categories);
  const brandList = brands[category];
  const brand = getRandomItem(brandList);
  const productNameList = productNames[category];
  const baseName = getRandomItem(productNameList);
  const title = `${brand} ${baseName}`;
  
  const basePrice = Math.floor(Math.random() * 900) + 100; // $100-$1000
  const hasDiscount = Math.random() > 0.6; // 40% chance of discount
  const discountPrice = hasDiscount ? Math.floor(basePrice * (0.7 + Math.random() * 0.2)) : null;
  
  const numReviews = Math.floor(Math.random() * 500);
  const rating = numReviews > 0 ? parseFloat((3 + Math.random() * 2).toFixed(1)) : 0;
  
  const product = {
    title,
    slug: generateSlug(title, index),
    description: `High-quality ${baseName.toLowerCase()} from ${brand}. Perfect for everyday use with excellent durability and performance.`,
    brand,
    category,
    price: basePrice,
    discountPrice,
    images: generateUnsplashImages(category, title, 3),
    stock: Math.floor(Math.random() * 200),
    rating,
    numReviews,
    tags: getRandomItems(["bestseller", "new arrival", "featured", "sale", "trending"], 2),
    attributes: {
      color: getRandomItems(colors, Math.floor(Math.random() * 3) + 2),
      size: category === "Clothing" || category === "Shoes" 
        ? getRandomItems(sizes, Math.floor(Math.random() * 4) + 2) 
        : []
    },
    isActive: Math.random() > 0.1 // 90% active
  };
  
  return product;
}

// Main function to seed database
async function seedProducts() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Existing products cleared");

    console.log("📦 Generating 500 products...");
    const products = [];
    for (let i = 0; i < 500; i++) {
      products.push(generateProduct(i + 1));
      if ((i + 1) % 100 === 0) {
        console.log(`   Generated ${i + 1} products...`);
      }
    }

    console.log("💾 Inserting products into database...");
    await Product.insertMany(products);
    console.log("✅ Successfully inserted 500 products!");

    // Show some statistics
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log("\n📊 Product Statistics by Category:");
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} products | Avg Price: $${stat.avgPrice.toFixed(2)} | Avg Rating: ${stat.avgRating.toFixed(1)}`);
    });

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the seed function
seedProducts();