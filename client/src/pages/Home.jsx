import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/featured");
        const data = await res.json();
        setOfferListings(data);
        console.log(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80')"}}></div>
        <div className="relative z-10 flex flex-col gap-6 px-4 py-12 max-w-6xl mx-auto text-center">
          <h1 className="text-white font-bold text-4xl lg:text-6xl">
            Find your next <span className="text-yellow-300">perfect</span>
            <br />
            place with ease
          </h1>
          <div className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            SriEstate is the best place to find your next perfect place to
            live. We have a wide range of properties for you to choose from.
          </div>
          
          {/* Quick Search Form */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 text-left">Looking to</label>
                <select className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 text-left">Property Type</label>
                <select className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-left">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 pr-10"
                  />
                  <Link
                    to={"/search"}
                    className="absolute inset-y-0 right-0 flex items-center px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link
              to={"/search?type=sale"}
              className="bg-white hover:bg-gray-100 text-blue-700 px-6 py-3 rounded-lg w-fit text-sm sm:text-base font-medium transition-colors duration-300 flex items-center gap-2"
            >
              Buy Properties
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              to={"/search?type=rent"}
              className="bg-transparent border border-white hover:bg-white/10 text-white px-6 py-3 rounded-lg w-fit text-sm sm:text-base font-medium transition-colors duration-300 flex items-center gap-2"
            >
              Rent Properties
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>      {/* Featured Properties Slider */}
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Featured Properties</h2>
          <p className="text-gray-600 mb-8">Explore our handpicked selection of exceptional properties</p>
          <div className="relative">
            <Swiper 
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              className="rounded-xl overflow-hidden h-[500px] shadow-lg"
            >
              {offerListings && offerListings.length > 0 ? (
                offerListings.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <div className="relative w-full h-full group">
                      <div
                        style={{
                          background: `url(${listing.imageUrls[0]}) center no-repeat`,
                          backgroundSize: "cover",
                        }}
                        className="h-full w-full brightness-90 group-hover:brightness-100 transition-all duration-300"
                      ></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full mr-2">Featured</span>
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{listing.name}</h3>
                        <div className="flex items-center text-blue-100 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {listing.address}
                        </div>
                        <div className="flex gap-4 mb-4">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">${ listing.regularPrice?.toLocaleString()}</p>
                          <Link to={`/listing/${listing._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block transition-colors duration-300">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">No featured properties available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="bg-gray-50 py-16 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose SriEstate?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the most comprehensive and reliable property solutions in Sri Lanka, helping thousands find their dream homes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1,500+</h3>
              <p className="text-gray-600">Active Properties</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">5,000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">CMB</h3>
              <p className="text-gray-600">Colombo District</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">10+ Years</h3>
              <p className="text-gray-600">Industry Experience</p>
            </div>
          </div>
        </div>
      </div>      {/* Property Categories */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Property Type Filters */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Browse By Property Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link 
                to="/search?propertyType=residential&bedrooms=3" 
                className="bg-blue-50 hover:bg-blue-100 transition-all p-6 rounded-lg text-center group"
              >
                <div className="bg-blue-100 group-hover:bg-blue-200 transition-all w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Houses</h3>
                <p className="text-sm text-gray-500">Find your dream house</p>
              </Link>
              <Link 
                to="/search?propertyType=residential&apartmentType=apartment" 
                className="bg-green-50 hover:bg-green-100 transition-all p-6 rounded-lg text-center group"
              >
                <div className="bg-green-100 group-hover:bg-green-200 transition-all w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Apartments</h3>
                <p className="text-sm text-gray-500">Modern living spaces</p>
              </Link>
              <Link 
                to="/search?propertyType=commercial" 
                className="bg-purple-50 hover:bg-purple-100 transition-all p-6 rounded-lg text-center group"
              >
                <div className="bg-purple-100 group-hover:bg-purple-200 transition-all w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Commercial</h3>
                <p className="text-sm text-gray-500">Business spaces</p>
              </Link>
              <Link 
                to="/search?hasPool=true" 
                className="bg-yellow-50 hover:bg-yellow-100 transition-all p-6 rounded-lg text-center group"
              >
                <div className="bg-yellow-100 group-hover:bg-yellow-200 transition-all w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Luxury</h3>
                <p className="text-sm text-gray-500">Premium properties</p>
              </Link>
            </div>
          </div>
          
          {/* Offers Section */}
          {offerListings && offerListings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Special Offers
                  </h2>
                  <p className="text-gray-600">Exclusive deals on premium properties</p>
                </div>
                <Link
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                  to={"/search?offer=true"}
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Rent Section */}
          {rentListings && rentListings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Properties for Rent
                  </h2>
                  <p className="text-gray-600">Find your perfect rental property</p>
                </div>
                <Link
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                  to={"/search?type=rent"}
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}

          {/* Sale Section */}
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Properties for Sale
                  </h2>
                  <p className="text-gray-600">Invest in your future with our premium listings</p>
                </div>
                <Link
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                  to={"/search?type=sale"}
                >
                  View All
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
        {/* Call to Action */}
      <div className="relative bg-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="bg-blue-500 text-white text-sm py-1 px-3 rounded-full">Get Started Today</span>
              <h2 className="text-4xl font-bold mt-4 mb-6">Ready to Find Your Dream Property?</h2>
              <p className="text-blue-100 mb-8 text-lg">Whether you&apos;re looking to buy, rent, or invest, SriEstate has the perfect property waiting for you. Our expert team will guide you through every step of the process.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/search?type=sale" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Browse Properties for Sale
                </Link>
                <Link to="/search?type=rent" className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Find Rental Properties
                </Link>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-4">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="User" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-blue-100">Trusted by 5000+ happy customers</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block relative">
              <div className="bg-white p-6 rounded-lg shadow-xl transform rotate-3 translate-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" 
                  alt="Luxury property" 
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Luxury Villa</h3>
                    <p className="text-gray-500">Colombo, Sri Lanka</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">For Sale</span>
                </div>
                <div className="flex justify-between text-gray-800">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>4 Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>3 Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>2500 sq ft</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 transform translate-x-8 -translate-y-1/3 -rotate-6 bg-blue-500 rounded-lg p-4 shadow-lg text-white">
                <p className="text-xl font-bold">$1,250,000</p>
                <p className="text-sm">Premium Property</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
