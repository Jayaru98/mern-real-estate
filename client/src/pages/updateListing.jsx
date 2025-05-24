import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PriceEstimator from '../components/PriceEstimator';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [showEstimator, setShowEstimator] = useState(false);
  const [usedEstimator, setUsedEstimator] = useState(false);  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    propertyType: "residential",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 100,
    floors: 1,
    kitchens: 1,
    landSize: 0,
    hasPool: false,
    buildYear: "older",
    year: 2010,  // Added for ML API
    pool: false, // Added for ML API
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    latitude: "",
    longitude: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [params.listingId]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("Image Upload Failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
            resolve(getDownloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer" ||
      e.target.id === "hasPool"
    ) {
      // Update both the original property and the ML API mapped property
      const updates = {
        ...formData,
        [e.target.id]: e.target.checked,
      };
      
      // If hasPool is changed, also update the pool field for ML API
      if (e.target.id === "hasPool") {
        updates.pool = e.target.checked;
      }
      
      // If furnished is changed, it's already named correctly for ML API
      
      setFormData(updates);
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.discountPrice > +formData.regularPrice)
        return setError("Discount price must be less than regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-5xl mx-auto">
      <h1 className="text-center font-semibold my-7 text-3xl text-slate-700">
        Update Listing
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-6 flex-1">
            {/* Basic Information Section */}
            <div className="bg-slate-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">
                Basic Information
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Property Name"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  id="name"
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
                <textarea
                  type="text"
                  placeholder="Property Description"
                  className="border p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  id="description"
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  id="address"
                  maxLength="62"
                  minLength="10"
                  required
                  onChange={handleChange}
                  value={formData.address}
                />
                {formData.latitude && formData.longitude && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded-md">
                    <p>Latitude: {formData.latitude}</p>
                    <p>Longitude: {formData.longitude}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Property Type Section */}
            <div className="bg-slate-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">
                Property Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <p className="font-medium text-gray-700 mb-2">Listing Type</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 accent-blue-500"
                        id="sale"
                        onChange={handleChange}
                        checked={formData.type === "sale"}
                      />
                      <span>Sale</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 accent-blue-500"
                        id="rent"
                        onChange={handleChange}
                        checked={formData.type === "rent"}
                      />
                      <span>Rent</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <p className="font-medium text-gray-700 mb-2">Property Type</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 accent-blue-500"
                        id="residential"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              propertyType: "residential"
                            });
                          }
                        }}
                        checked={formData.propertyType === "residential"}
                      />
                      <span>Residential</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="w-4 h-4 accent-blue-500"
                        id="commercial"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              propertyType: "commercial"
                            });
                          }
                        }}
                        checked={formData.propertyType === "commercial"}
                      />
                      <span>Commercial</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Building Age</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="w-4 h-4 accent-blue-500"
                      id="newer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            buildYear: "newer",
                            year: 2020  // For ML API - newer buildings assumed to be around 2020
                          });
                        }
                      }}
                      checked={formData.buildYear === "newer"}
                    />
                    <span>Less than 5 years</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="w-4 h-4 accent-blue-500"
                      id="older"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            buildYear: "older",
                            year: 2010  // For ML API - older buildings assumed to be around 2010
                          });
                        }
                      }}
                      checked={formData.buildYear === "older"}
                    />
                    <span>5 years or older</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-2">Amenities</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="parking"
                      className="w-4 h-4 accent-blue-500"
                      onChange={handleChange}
                      checked={formData.parking}
                    />
                    <span>Parking spot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="furnished"
                      className="w-4 h-4 accent-blue-500"
                      onChange={handleChange}
                      checked={formData.furnished}
                    />
                    <span>Furnished</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="offer"
                      className="w-4 h-4 accent-blue-500"
                      onChange={handleChange}
                      checked={formData.offer}
                    />
                    <span>Offer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="hasPool"
                      className="w-4 h-4 accent-blue-500"
                      onChange={handleChange}
                      checked={formData.hasPool}
                    />
                    <span>Swimming Pool</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="bedrooms">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.bedrooms}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="bathrooms">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.bathrooms}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="kitchens">Kitchens</label>
                  <input
                    type="number"
                    id="kitchens"
                    min="1"
                    max="10"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.kitchens}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="floors">Floors</label>
                  <input
                    type="number"
                    id="floors"
                    min="1"
                    max="100"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.floors}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="squareFeet">Square Feet</label>
                  <input
                    type="number"
                    id="squareFeet"
                    min="50"
                    max="100000"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.squareFeet}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="landSize">Land Size (perches)</label>
                  <input
                    type="number"
                    id="landSize"
                    min="0"
                    max="1000"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.landSize}
                  />
                </div>
              </div>
            </div>
          
            {/* AI Price Estimation Section */}
            <div className="bg-slate-50 p-4 rounded-md mb-6">
              <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">
                Price Estimation
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Get an AI-powered price estimate based on your property details
              </p>
              <button 
                type="button"
                onClick={() => setShowEstimator(!showEstimator)}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {showEstimator ? 'Hide Price Estimator' : 'Show Price Estimator'}
              </button>
              
              {showEstimator && (
                <PriceEstimator 
                  formData={formData} 
                  onEstimatedPriceChange={(price) => {
                    setFormData({
                      ...formData,
                      regularPrice: Math.round(price)
                    });
                    setUsedEstimator(true);
                  }} 
                />
              )}
            </div>
            
            {/* Pricing Section */}
            <div className="bg-slate-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">
                Pricing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2" htmlFor="regularPrice">
                    Regular Price {formData.type === "rent" ? "($/month)" : "($)"}
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="1000000"
                    required
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                </div>
                
                {formData.offer && (
                  <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-2" htmlFor="discountPrice">
                      Discounted Price {formData.type === "rent" ? "($/month)" : "($)"}
                    </label>
                    <input
                      type="number"
                      id="discountPrice"
                      min="0"
                      max="1000000"
                      required
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="flex flex-col gap-5 flex-1">
            <div className="bg-slate-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold text-slate-700 border-b pb-2 mb-4">
                Images
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                The first image will be the cover (max 6)
              </p>
              
              <div className="flex gap-4 mb-4">
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 transition-all"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
              
              <p className="text-red-700 text-sm mb-4">
                {imageUploadError && imageUploadError}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {formData.imageUrls.length > 0 &&
                  formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className="flex justify-between p-3 border bg-white rounded-lg items-center"
                    >
                      <img
                        src={url}
                        alt="listing image"
                        className="w-20 h-20 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 text-white bg-red-600 rounded-lg uppercase hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            
            <button
              disabled={loading || uploading}
              className="p-3 bg-blue-600 text-white rounded-lg uppercase font-medium hover:bg-blue-700 disabled:opacity-75 transition-colors mt-4 h-14"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  Updating...
                </span>
              ) : (
                "Update Listing"
              )}
            </button>
            
            {error && (
              <p className="text-red-700 text-sm bg-red-100 p-3 rounded-md">
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
