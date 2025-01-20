import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Shophome = () => {
  const [items, setItems] = useState([]);
  const [images, setImages] = useState({}); 
  //  token from local storage
  const token = localStorage.getItem('authToken'); 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          'http://beta.hrmetrics.mv/interview/api/Item/GetItems',
          {   headers: {
            // used token in authorization
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        setItems(response.data);
        console.log(response.data);
        
        // get the id and images
        const imagePromises = response.data.map(async (item) => {
          const imageUrl = await fetchImageUrl(item.ImagePath);
          return { id: item.Id, imageUrl };
        });

        // promise constructor
        const preloadedImages = await Promise.all(imagePromises);
        const imageMap = preloadedImages.reduce((acc, img) => {
          acc[img.id] = img.imageUrl;
          return acc;
        }, {});
// Store preloaded image URLs
        setImages(imageMap); 
      } catch (error) {
        console.error('There was an error fetching the items!', error);
      }
    };

    fetchItems();
  }, [token]);

  const fetchImageUrl = async (imagePath) => {
    try {
      const response = await axios.get(
        `http://beta.hrmetrics.mv/interview/api/Item/GetItemImage?img=${imagePath}`,
        { headers: {
          // Include the token in the header
            Authorization: `Bearer ${token}`, 
          },
          responseType: 'blob', // Ensure the response is treated as a binary blob (image)
        }
      );
      return URL.createObjectURL(response.data); // Create a local object URL for the image
    } catch (error) {
      console.error('Error fetching the image:', error);
      return '/path/to/placeholder-image.jpg'; // Fallback to a placeholder image
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
  <h1 className="m-0">Shopify Website</h1>
  <Link to="/post" className="btn btn-primary">Add <i className="bi bi-plus-circle-fill"></i></Link>
</div>

      <div className="row">
        {items.map((item) => (
          <div key={item.Id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={images[item.Id] || '/path/to/placeholder-image.jpg'} // Use preloaded image URL
                className="card-img-top"
                alt={item.ItemName}
              />
              <div className="card-body">
                <h5 className="card-title">{item.ItemName}</h5>
                <p className="card-text">
                  <strong>Category:</strong> {item.Category}
                </p>
                <p className="card-text">
                  <strong>SKU:</strong> {item.SKU}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${item.SellingPrice.toFixed(2)}
                </p>
                <p className="card-text">
                  <strong>Opening Stock:</strong> {item.OpeningStock}
                </p>
                <p className="card-text">
                  <strong>GST Applicable:</strong> {item.GSTApplicable ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shophome;
