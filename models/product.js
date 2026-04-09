import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: {
      type: String
    },

    brand: {
      type: String
    },

    category: {
      type: String,
      index: true
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number
    },

    images: [
      {
        url: String,
        alt: String
      }
    ],

    stock: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
      type: Number,
      default: 0
    },

    tags: [String], 

    attributes: {
      color: [String],
      size: [String]
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);