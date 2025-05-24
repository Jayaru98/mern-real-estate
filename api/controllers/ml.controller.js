import fetch from 'node-fetch';

export const predictPrice = async (req, res, next) => {
  try {
    const propertyData = req.body;
    
    // Validate required fields
    const requiredFields = ['house_square_feet', 'bed_rooms', 'bathrooms'];
    const missingFields = requiredFields.filter(field => !propertyData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: 'Please provide all required property information'
      });
    }
    
    // Forward the request to ML API
    const response = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // Try to parse the error as JSON if possible
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = errorText;
      }
      
      return res.status(response.status).json({
        status: 'error',
        error: `ML API error: ${response.status}`,
        details: errorDetails
      });
    }
    
    const prediction = await response.json();
    
    // Add timestamp and request details for logging/debugging
    const enrichedResponse = {
      ...prediction,
      timestamp: new Date().toISOString(),
      request_params: {
        square_feet: propertyData.house_square_feet,
        bedrooms: propertyData.bed_rooms,
        bathrooms: propertyData.bathrooms,
        property_type: propertyData.property_type || 'Not specified'
      }
    };
    
    res.status(200).json(enrichedResponse);
  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to process price estimation',
      details: error.message
    });
  }
};

export const getSampleData = async (req, res, next) => {
  try {
    // Forward the request to ML API
    const response = await fetch('http://localhost:5001/sample-data');
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // Try to parse the error as JSON if possible
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch (e) {
        errorDetails = errorText;
      }
      
      return res.status(response.status).json({
        status: 'error',
        error: `ML API error: ${response.status}`,
        details: errorDetails
      });
    }
    
    const sampleData = await response.json();
    
    // Add metadata about the sample data
    const enrichedResponse = {
      status: 'success',
      count: sampleData.length,
      data: sampleData,
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json(enrichedResponse);
  } catch (error) {
    console.error('Sample data fetch error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to fetch sample data',
      details: error.message
    });
  }
};
