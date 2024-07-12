import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: false,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
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

  location: {
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  // Add other fields as needed
},{timestamps: true}
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
