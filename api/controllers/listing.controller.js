import Listing from "../models/listing.model.js";

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
    const listing  = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next (error);
  }
  };
