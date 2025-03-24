import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

// export const createListingHandler = async (req, res, next) => {
//   const {
//     name,
//     description,
//     address,
//     regularPrice,
//     discountPrice,
//     bathrooms,
//     bedrooms,
//     furnished,
//     parking,
//     type,
//     offer,
//     imageUrls,
//     userRef,

//   } = req.body;

//   try {
//     const listing = Listing.create({
//       name,
//       description,
//       address,
//       regularPrice,
//       discountPrice,
//       bathrooms,
//       bedrooms,
//       furnished,
//       parking,
//       type,
//       offer,
//       imageUrls,
//       userRef,

//     });

//     res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

export const createListingHandler = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {

  
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "Invalid listing ID"));
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  // Check if the user is authorized to update the listing
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can only update your own listings"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    
    const offer =
      req.query.offer === "true"
        ? true
        : req.query.offer === "false"
        ? false
        : { $exists: true };
    const furnished =
      req.query.furnished === "true"
        ? true
        : req.query.furnished === "false"
        ? false
        : { $exists: true };
    const parking =
      req.query.parking === "true"
        ? true
        : req.query.parking === "false"
        ? false
        : { $exists: true };

    
    let type = req.query.type;
    if (!type || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const query = {
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    };
    
    
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
      
      
      return res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    next(error);
  }
};
