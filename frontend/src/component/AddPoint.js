import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddPoint = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode'); // 'edit' or null
  const id = queryParams.get('id');
  const latFromQuery = queryParams.get('lat');
  const lngFromQuery = queryParams.get('lng');

  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    placeName: '',
    city: '',
    imageFile: null,
    rating: '',
    visited: false,
    description: ''
  });

  useEffect(() => {
    const editData = {
      latitude: queryParams.get('lat') || '',
      longitude: queryParams.get('lng') || '',
      placeName: queryParams.get('placeName') || '',
      city: queryParams.get('city') || '',
      rating: queryParams.get('rating') || '',
      visited: queryParams.get('visited') === 'true',
      description: queryParams.get('description') || '',
      imageFile: null
    };

    if (mode === 'edit') {
      setFormData(editData);
    } else if (latFromQuery && lngFromQuery) {
      setFormData(prev => ({
        ...prev,
        latitude: latFromQuery,
        longitude: lngFromQuery
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imageFile' && value) {
        data.append('imageURL', value);
      } else {
        data.append(key, value);
      }
    });

    const url = mode === 'edit'
      ? `http://localhost:4000/api/map/updatepoint/${id}`
      : 'http://localhost:4000/api/map/addpoint';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'auth-token': localStorage.getItem('token')
        },
        body: data
      });

      const json = await response.json();

      if (json.success) {
        navigate('/');
      } else {
        alert("Failed to save point.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '700px' }}>
        <h3 className="mb-4 text-center">
          {mode === 'edit' ? 'Edit Map Point' : 'Add New Map Point'}
        </h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label">Latitude</label>
              <input type="number" className="form-control" name="latitude" value={formData.latitude} onChange={handleChange} required />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label">Longitude</label>
              <input type="number" className="form-control" name="longitude" value={formData.longitude} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Place Name</label>
            <input type="text" className="form-control" name="placeName" value={formData.placeName} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">City</label>
            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" name="imageFile" accept="image/*" onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Rating (0–5)</label>
            <input type="number" step="0.1" min="0" max="5" className="form-control" name="rating" value={formData.rating} onChange={handleChange} />
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" name="visited" checked={formData.visited} onChange={handleChange} />
            <label className="form-check-label">Visited</label>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">
              {mode === 'edit' ? 'Update Point' : 'Add Point'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPoint;





