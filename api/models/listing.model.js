import mongoose from "mongoose";
// 
const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    squareFeet: {
      type: Number,
      required: true,
    },
    floors: {
      type: Number,
      required: true,
    },
    kitchens: {
      type: Number,
      required: true,
    },
    landSize: {
      type: Number,
      required: true,
    },
    hasPool: {
      type: Boolean,
      required: true,
      default: false,
    },
    buildYear: {
      type: String,
      enum: ['newer', 'older'],
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial'],
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: false,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: false,
    },
    longitude: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
