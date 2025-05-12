import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaRulerCombined,
  FaLayerGroup,
  FaUtensils,
  FaLandmark,
  FaSwimmingPool,
  FaCalendarAlt,
  FaBuilding,
  FaAngleLeft,
  FaLongArrowAltLeft,
} from "react-icons/fa";
import Contact from "../components/Contact";
// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main className="bg-gray-50">
      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-medium text-gray-600">Loading property details...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">Something went wrong!</p>
            <p className="text-gray-600 mb-6">We couldn&apos;t load the property details. Please try again later.</p>
            <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
              <FaLongArrowAltLeft className="mr-2" />
              Return to home page
            </Link>
          </div>
        </div>
      )}
      
      {/* Property Details */}
      {listing && !loading && !error && (
        <>
          {/* Back Button */}
          <div className="bg-white shadow-sm py-3">
            <div className="max-w-6xl mx-auto px-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaAngleLeft className="mr-1" />
                <span>Back to listings</span>
              </Link>
            </div>
          </div>
          
          {/* Image Gallery */}
          <div className="relative">
            <Swiper 
              navigation 
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={listing.imageUrls.length > 1}
              className="h-[500px] md:h-[600px]"
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-full w-full"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Share Button */}
            <div className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 rounded-full w-10 h-10 flex justify-center items-center shadow-md cursor-pointer hover:bg-opacity-100 transition-all">
              <FaShare
                className="text-gray-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <div className="absolute top-16 right-4 z-10 bg-black bg-opacity-75 text-white rounded-md px-3 py-2 text-sm">
                Link copied to clipboard!
              </div>
            )}
            
            {/* Property Type & Status Badge */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                listing.type === "rent" 
                ? "bg-blue-600 text-white" 
                : "bg-green-600 text-white"
              }`}>
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                listing.propertyType === "residential" 
                ? "bg-purple-600 text-white" 
                : "bg-yellow-600 text-white"
              }`}>
                {listing.propertyType === "residential" ? "Residential" : "Commercial"}
              </span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Property Details */}
              <div className="lg:col-span-2">
                {/* Property Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.name}</h1>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        {listing.address}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        ${listing.offer && listing.discountPrice 
                          ? listing.discountPrice.toLocaleString("en-US") 
                          : listing.regularPrice.toLocaleString("en-US")}
                        <span className="text-sm font-normal text-gray-600">
                          {listing.type === "rent" && " / month"}
                        </span>
                      </div>
                      
                      {listing.offer && listing.discountPrice > 0 && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          ${(listing.regularPrice - listing.discountPrice).toLocaleString("en-US")} discount
                          <span className="line-through text-gray-500 ml-2">
                            ${listing.regularPrice.toLocaleString("en-US")}
                            {listing.type === "rent" && " / month"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Key Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center p-3 border-r border-gray-200">
                      <FaBed className="text-blue-600 text-xl mb-2" />
                      <div className="text-gray-900 font-bold">{listing.bedrooms}</div>
                      <div className="text-gray-600 text-sm">{listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}</div>
                    </div>
                    <div className="flex flex-col items-center p-3 border-r border-gray-200">
                      <FaBath className="text-blue-600 text-xl mb-2" />
                      <div className="text-gray-900 font-bold">{listing.bathrooms}</div>
                      <div className="text-gray-600 text-sm">{listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}</div>
                    </div>
                    <div className="flex flex-col items-center p-3 border-r border-gray-200">
                      <FaRulerCombined className="text-blue-600 text-xl mb-2" />
                      <div className="text-gray-900 font-bold">{listing.squareFeet}</div>
                      <div className="text-gray-600 text-sm">Sq. Ft.</div>
                    </div>
                    <div className="flex flex-col items-center p-3">
                      <FaLayerGroup className="text-blue-600 text-xl mb-2" />
                      <div className="text-gray-900 font-bold">{listing.floors}</div>
                      <div className="text-gray-600 text-sm">{listing.floors > 1 ? "Floors" : "Floor"}</div>
                    </div>
                  </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <div className="flex border-b">
                    <button 
                      onClick={() => setActiveTab('overview')} 
                      className={`flex-1 py-4 px-6 text-center transition-colors ${
                        activeTab === 'overview' 
                          ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Overview
                    </button>
                    <button 
                      onClick={() => setActiveTab('details')} 
                      className={`flex-1 py-4 px-6 text-center transition-colors ${
                        activeTab === 'details' 
                          ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Property Details
                    </button>
                    <button 
                      onClick={() => setActiveTab('features')} 
                      className={`flex-1 py-4 px-6 text-center transition-colors ${
                        activeTab === 'features' 
                          ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Features
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">{listing.description}</p>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaBed className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">
                              {listing.bedrooms} {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaBath className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">
                              {listing.bathrooms} {listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaRulerCombined className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">{listing.squareFeet} Square Feet</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaLandmark className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">{listing.landSize} Perches Land Size</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaUtensils className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">
                              {listing.kitchens} {listing.kitchens > 1 ? "Kitchens" : "Kitchen"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FaSwimmingPool className="text-blue-600" />
                            </div>
                            <span className="text-gray-700">
                              {listing.hasPool ? "Swimming Pool Available" : "No Swimming Pool"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'details' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <ul className="space-y-3">
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Property ID:</span>
                                <span className="font-medium text-gray-900">{listing._id.substring(0, 8)}</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Property Type:</span>
                                <span className="font-medium text-gray-900 capitalize">{listing.propertyType}</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-medium text-gray-900">
                                  ${(listing.offer && listing.discountPrice ? listing.discountPrice : listing.regularPrice).toLocaleString("en-US")}
                                  {listing.type === "rent" && " / month"}
                                </span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Building Age:</span>
                                <span className="font-medium text-gray-900 capitalize">
                                  {listing.buildYear === "newer" ? "Less than 5 years" : "More than 5 years"}
                                </span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Floors:</span>
                                <span className="font-medium text-gray-900">{listing.floors}</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <ul className="space-y-3">
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Land Size:</span>
                                <span className="font-medium text-gray-900">{listing.landSize} perches</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Total Area:</span>
                                <span className="font-medium text-gray-900">{listing.squareFeet} sq ft</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Bedrooms:</span>
                                <span className="font-medium text-gray-900">{listing.bedrooms}</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Bathrooms:</span>
                                <span className="font-medium text-gray-900">{listing.bathrooms}</span>
                              </li>
                              <li className="flex justify-between pb-3 border-b border-gray-100">
                                <span className="text-gray-600">Kitchens:</span>
                                <span className="font-medium text-gray-900">{listing.kitchens}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'features' && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`flex items-center p-3 rounded-lg ${listing.furnished ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <FaChair className={`mr-2 ${listing.furnished ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={listing.furnished ? 'text-green-800' : 'text-gray-600'}>
                              {listing.furnished ? "Furnished" : "Unfurnished"}
                            </span>
                          </div>
                          <div className={`flex items-center p-3 rounded-lg ${listing.parking ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <FaParking className={`mr-2 ${listing.parking ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={listing.parking ? 'text-green-800' : 'text-gray-600'}>
                              {listing.parking ? "Parking Available" : "No Parking"}
                            </span>
                          </div>
                          <div className={`flex items-center p-3 rounded-lg ${listing.hasPool ? 'bg-green-50' : 'bg-gray-50'}`}>
                            <FaSwimmingPool className={`mr-2 ${listing.hasPool ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={listing.hasPool ? 'text-green-800' : 'text-gray-600'}>
                              {listing.hasPool ? "Swimming Pool" : "No Swimming Pool"}
                            </span>
                          </div>
                          <div className={`flex items-center p-3 rounded-lg bg-blue-50`}>
                            <FaBuilding className="mr-2 text-blue-600" />
                            <span className="text-blue-800">
                              {listing.propertyType} Property
                            </span>
                          </div>
                          <div className={`flex items-center p-3 rounded-lg bg-blue-50`}>
                            <FaCalendarAlt className="mr-2 text-blue-600" />
                            <span className="text-blue-800">
                              {listing.buildYear === "newer" ? "Built < 5 years ago" : "Built > 5 years ago"}
                            </span>
                          </div>
                          {listing.latitude && listing.longitude && (
                            <div className={`flex items-center p-3 rounded-lg bg-blue-50`}>
                              <FaMapMarkerAlt className="mr-2 text-blue-600" />
                              <span className="text-blue-800">
                                Location Map Available
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Map Display (if coordinates are available) */}
                {listing.latitude && listing.longitude && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Property Location</h2>
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-600">Map would be displayed here using latitude: {listing.latitude}, longitude: {listing.longitude}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Contact & Info */}
              <div>
                {/* Contact Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
                  {currentUser && listing.userRef !== currentUser._id ? (
                    <>
                      {!contact ? (
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in this property?</h3>
                          <button
                            onClick={() => setContact(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                          >
                            Contact Owner
                          </button>
                        </div>
                      ) : (
                        <Contact listing={listing} />
                      )}
                    </>
                  ) : currentUser ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBuilding className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">This is your property</h3>
                      <p className="text-gray-600 mb-4">You can edit or manage this listing from your profile</p>
                      <Link
                        to="/profile"
                        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                      >
                        Go to Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to contact</h3>
                      <p className="text-gray-600 mb-4">Please sign in to contact the property owner</p>
                      <Link
                        to="/sign-in"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Similar Properties - This would be a real feature with API call */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties</h3>
                  <p className="text-gray-600 text-sm mb-2">Other {listing.propertyType} properties</p>
                  <div className="text-center py-8">
                    <p className="text-gray-500">This section would show similar properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
