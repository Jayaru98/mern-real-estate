import { useState } from 'react';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function PriceEstimator({ formData, onEstimatedPriceChange }) {
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getPriceEstimate = async () => {
    // Check if we have minimum required data
    if (!formData.squareFeet || !formData.bedrooms || !formData.bathrooms) {
      setError("Please fill in square feet, bedrooms, and bathrooms first");
      return;
    }

    // Validate numeric inputs to prevent API errors
    if (isNaN(parseFloat(formData.squareFeet)) || parseFloat(formData.squareFeet) <= 0) {
      setError("Please enter a valid positive number for square feet");
      return;
    }

    if (isNaN(parseInt(formData.bedrooms)) || parseInt(formData.bedrooms) <= 0) {
      setError("Please enter a valid number of bedrooms");
      return;
    }

    if (isNaN(parseFloat(formData.bathrooms)) || parseFloat(formData.bathrooms) <= 0) {
      setError("Please enter a valid number of bathrooms");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert form data to ML API format
      const mlData = {
        house_square_feet: parseInt(formData.squareFeet),
        bed_rooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        land_size_perch: parseFloat(formData.landSize || 10), // Default if not provided
        property_type: formData.type || "Residential",
        stories: parseInt(formData.floors || 1),
        furnished: formData.furnished ? 1 : 0,
        pool: formData.pool ? 1 : 0,
        build_year: parseInt(formData.year || 2010),
        location: formData.address || "Angoda" // Default location
      };      // Call ML API through our backend proxy
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mlData),
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error || 'Failed to get price estimate');
      }

      setEstimatedPrice(data.predicted_price);
      
      // Notify parent component about the estimated price
      if (onEstimatedPriceChange) {
        onEstimatedPriceChange(data.predicted_price);
      }
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaCalculator className="mr-2 text-blue-600" />
            AI Price Estimator
          </h3>
          <button
            type="button"
            onClick={getPriceEstimate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Calculating...' : 'Estimate Price'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {estimatedPrice && (
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-blue-600 mr-2" />
              <span className="text-gray-700 text-sm">Estimated market value based on property details:</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              ${Math.round(estimatedPrice).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This is an AI-generated estimate based on similar properties in the area.
            </p>
            <button
              type="button"
              onClick={() => onEstimatedPriceChange(Math.round(estimatedPrice))}
              className="mt-3 text-blue-600 underline text-sm"
            >
              Use this estimate as my listing price
            </button>
          </div>
        )}
      </div>    </div>
  );
}

PriceEstimator.propTypes = {
  formData: PropTypes.shape({
    squareFeet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bedrooms: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bathrooms: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    landSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
    floors: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    furnished: PropTypes.bool,
    pool: PropTypes.bool,
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    address: PropTypes.string
  }).isRequired,
  onEstimatedPriceChange: PropTypes.func.isRequired
};
