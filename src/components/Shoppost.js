import React, { useState, useEffect } from 'react';
import ApiService from './api/ShopApi';
import { useNavigate } from 'react-router-dom';

const Shoppost = () => {
  const [responseData, setResponseData] = useState([]);
  const [formData, setFormData] = useState({
    ItemCategory: '',SKU: '',ItemName: '',CostOfGoods: '',SellingPrice: '',OpeningStock: '',file: null,OpeningStockDate: '',
    IsInventory: false,
    GSTApplicable: false,
  });
 const navigate = useNavigate();

  useEffect(() => {
    ApiService.getItemCategories()
      .then((data) => {
        setResponseData(data); //  API returns an array of categories
      })
      .catch(() => {
        alert('Failed to load item categories. Please try again later.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };


  //  jpeg image and 5mb images allow that
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidFileType = file.type === 'image/jpeg';
      const isValidFileSize = file.size <= 5 * 1024 * 1024;

      if (!isValidFileType) {
        alert('Please upload a JPEG image only.');
        return;
      }

      if (!isValidFileSize) {
        alert('File size should not exceed 5MB.');
        return;
      }

      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.OpeningStockDate || !formData.ItemCategory || !formData.SKU || !formData.ItemName || !formData.CostOfGoods || !formData.SellingPrice || !formData.OpeningStock || !formData.file) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const savedItemData = await ApiService.saveItem(formData);
      alert('Item saved successfully.');

      if (formData.file) {
        await ApiService.uploadImage(savedItemData.Data.Id, formData.file);
        // alert('Image uploaded successfully.');
      }
      navigate('/home'); 
    } catch (error) {
      alert('Failed to save item. Please check your input and try again.');
    }
  };
// Format as YYYY-MM-DDTHH:mm
  const today = new Date().toISOString().slice(0, 16); 

  return (
    <div className="container">
      <h2>Product Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product ID : </label>
          <input
            type="text"    className="form-control"
            name="ItemCategory"    value={formData.ItemCategory}        onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>SKU : </label>
          <input
            type="number"    className="form-control"
            name="SKU"     value={formData.SKU}       onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Product Name : </label>
          <select
            name="ItemName"   value={formData.ItemName}    onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Product Name</option>
            {responseData.map((category) => (
              <option key={category.Id} value={category.Text}>
                {category.Text}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Cost of Goods : </label>
          <input    type="number"    className="form-control"   name="CostOfGoods"
            value={formData.CostOfGoods}    onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Selling Price : </label>
          <input
            type="number"  className="form-control" name="SellingPrice"     value={formData.SellingPrice}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Opening Stock : </label>
          <input
            type="number"    className="form-control"  name="OpeningStock"  value={formData.OpeningStock}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image Upload : </label>
          <input
            type="file"   className="form-control"    name="file"        onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Opening Stock Date : </label>
          {/* old date disabled */}
          <input    type="datetime-local"    className="form-control"         name="OpeningStockDate"
            value={formData.OpeningStockDate}
            onChange={handleChange}
            min={today}
          />
        </div>
        <div className="form-group">
          <label>Is Inventory : </label>
          <input  type="checkbox"  className="form-check-input"       name="IsInventory"
            checked={formData.IsInventory}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>GST Applicable : </label>
          <input      type="checkbox"   className="form-check-input"   name="GSTApplicable"
            checked={formData.GSTApplicable}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save <i className="bi bi-check-lg"></i>
        </button>
      </form>
    </div>
  );
};

export default Shoppost;
