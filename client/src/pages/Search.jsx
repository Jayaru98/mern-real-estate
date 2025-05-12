import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { FaSearch, FaChevronDown, FaChevronUp, FaHome, FaBuilding, FaFilter } from "react-icons/fa";
import { MdApartment, MdOutlineVilla, MdSell, MdFormatListBulleted } from "react-icons/md";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [view, setView] = useState("grid"); // grid or list
  const [activeProperty, setActiveProperty] = useState("all");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
      setActiveProperty(typeFromUrl || "all");
    }
    
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, []);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebardata, type: e.target.id });
      setActiveProperty(e.target.id);
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebardata, sort, order });
    }
  };

  const selectPropertyType = (type) => {
    setSidebarData({ ...sidebardata, type });
    setActiveProperty(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  // Custom styling for property type buttons
  const getPropertyTypeStyle = (type) => {
    return activeProperty === type 
      ? "bg-blue-600 text-white border-blue-600" 
      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400";
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=996&q=80')"}}></div>
        <div className="relative z-10 flex flex-col gap-4 px-4 py-8 max-w-6xl mx-auto">
          <h1 className="text-white font-bold text-3xl md:text-4xl">
            Search Properties
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Find your perfect property from our extensive listings. Use filters to narrow down your search.
          </p>
        </div>
      </div>

      {/* Property Type Visual Filters */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-nowrap overflow-x-auto pb-4 gap-4 hide-scrollbar">
            <button
              onClick={() => selectPropertyType('all')}
              className={`flex flex-col items-center justify-center min-w-[110px] p-3 border rounded-lg transition-colors ${getPropertyTypeStyle('all')}`}
            >
              <MdFormatListBulleted className="text-2xl mb-2" />
              <span className="text-xs font-medium">All Types</span>
            </button>
            <button
              onClick={() => selectPropertyType('rent')}
              className={`flex flex-col items-center justify-center min-w-[110px] p-3 border rounded-lg transition-colors ${getPropertyTypeStyle('rent')}`}
            >
              <MdApartment className="text-2xl mb-2" />
              <span className="text-xs font-medium">For Rent</span>
            </button>
            <button
              onClick={() => selectPropertyType('sale')}
              className={`flex flex-col items-center justify-center min-w-[110px] p-3 border rounded-lg transition-colors ${getPropertyTypeStyle('sale')}`}
            >
              <MdSell className="text-2xl mb-2" />
              <span className="text-xs font-medium">For Sale</span>
            </button>
            <button
              onClick={() => setSidebarData({ ...sidebardata, offer: !sidebardata.offer })}
              className={`flex flex-col items-center justify-center min-w-[110px] p-3 border rounded-lg transition-colors ${sidebardata.offer ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
            >
              <MdOutlineVilla className="text-2xl mb-2" />
              <span className="text-xs font-medium">With Offers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto py-8 px-4 gap-8">
        {/* Advanced Filters */}
        <div className="lg:w-80">
          <div className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FaFilter className="text-blue-600" />
                Advanced Filters
              </h2>
              <button 
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="lg:hidden text-gray-500 hover:text-blue-600"
              >
                {filtersVisible ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className={`flex flex-col gap-6 ${filtersVisible ? 'block' : 'hidden lg:block'}`}
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Search Term
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="Location, property name, etc."
                    className="w-full p-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sidebardata.searchTerm}
                    onChange={handleChange}
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Amenities</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-4 h-4 text-blue-600"
                      onChange={handleChange}
                      checked={sidebardata.parking}
                    />
                    <label htmlFor="parking" className="ml-2 text-sm text-gray-700">
                      Parking Spot
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-4 h-4 text-blue-600"
                      onChange={handleChange}
                      checked={sidebardata.furnished}
                    />
                    <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                      Furnished
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Sort By
                </label>
                <select
                  onChange={handleChange}
                  defaultValue={"created_at_desc"}
                  id="sort_order"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="regularPrice_desc">Price: High to Low</option>
                  <option value="regularPrice_asc">Price: Low to High</option>
                  <option value="createdAt_desc">Latest</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>
              
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <FaSearch className="text-sm" /> Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1">
          <div className="bg-white p-4 shadow-md rounded-lg border border-gray-200 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl text-gray-800">
                {listings.length > 0 ? `${listings.length} Properties Found` : 'No Properties Found'}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'} rounded-md`}
                >
                  <FaBuilding />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'} rounded-md`}
                >
                  <FaHome />
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="ml-2 text-gray-600">Loading properties...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white p-8 shadow-md rounded-lg border border-gray-200 text-center">
              <div className="mb-4 text-gray-400 text-5xl flex justify-center">
                <FaSearch />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all properties</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}
          
          {showMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onShowMoreClick}
                className="bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-6 border border-blue-600 rounded-md transition-colors"
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
