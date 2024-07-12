import Listing from "../models/listing.model.js";

const createListingHandler = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    imageUrls,
    userRef,
    city,
    province,
    country,
    contact,
    image,
  } = req.body;

  try {
    const listing = Listing.create({
      title,
      description,
      price,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
      contact,
      image,
      location: {
        city,
        province,
        country,
      },
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export { createListingHandler };
