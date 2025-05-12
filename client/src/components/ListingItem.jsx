import { Link } from "react-router-dom";
import {
  MdLocationOn,
  MdOutlineBed,
  MdOutlineBathtub,
  MdOutlineHouse,
} from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import PropTypes from "prop-types";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden rounded-lg w-full group">
      <Link to={`/listing/${listing._id}`} className="block relative">
        <div className="overflow-hidden relative">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="h-[320px] sm:h-[220px] w-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                listing.type === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </span>
            {listing.offer && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                Offer
              </span>
            )}
          </div>
          <button className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors">
            <FaRegHeart />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-2 w-full">
          {" "}
          <div className="flex justify-between items-start">
            <h3 className="truncate text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {listing.name}
            </h3>{" "}
            <div className="text-right">
              <p className="text-blue-600 font-bold">
                $
                {listing.offer && listing.discountPrice
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                <span className="text-sm font-normal text-gray-600">
                  {listing.type === "rent" && " / month"}
                </span>
              </p>
              {listing.offer && listing.type === "rent" && (
                <p className="text-gray-500 text-sm line-through">
                  ${listing.regularPrice.toLocaleString("en-US")}/month
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MdLocationOn className="h-4 w-4 text-blue-600" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-1">
            {listing.description}
          </p>
          <div className="flex items-center border-t pt-3 mt-1 border-gray-100">
            <div className="flex items-center text-gray-600 mr-4">
              <MdOutlineBed className="text-blue-600 mr-1" />
              <span className="text-sm">
                {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mr-4">
              <MdOutlineBathtub className="text-blue-600 mr-1" />
              <span className="text-sm">
                {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
              </span>
            </div>
            {listing.parking && (
              <div className="flex items-center text-gray-600">
                <MdOutlineHouse className="text-blue-600 mr-1" />
                <span className="text-sm">Parking</span>
              </div>
            )}
          </div>
        </div>
      </Link>{" "}
    </div>
  );
}

// Add prop validation
ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    type: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    parking: PropTypes.bool,
    furnished: PropTypes.bool,
  }).isRequired,
};
