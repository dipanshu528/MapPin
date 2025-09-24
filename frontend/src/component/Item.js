import React, { useState, useEffect } from 'react';
import '../style/item.css';

const Item = ({ lat, lng }) => {
  const [item, setItem] = useState({ latitude: "", longitude: "", placeName: "", city:"", imageURL:"", rating:"", visited: "", description: "" });

  // Pre-fill latitude and longitude when the component loads or the props change
  useEffect(() => {
    setItem((prevItem) => ({
      ...prevItem,
      Latitude: lat,
      Longitude: lng,
    }));
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:4000/api/map/addpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ latitude: item.latitude, longitude: item.longitude, placeName: item.placeName, city: item.city, rating:item.rating, visited: item.visited, description: item.description }),
    });
    const json = await response.json();
    console.log(json);
  };

  const onChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
    console.log(item);
  };

  return (
    <div className="card">
      <h2 className="card-title">Location Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Latitude">Latitude</label>
          <input type="number" id="Latitude" name="Latitude" value={item.Latitude} onChange={onChange} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="Longitude">Longitude</label>
          <input type="number" id="Longitude" name="Longitude" value={item.Longitude} onChange={onChange} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="Place">Place</label>
          <input type="text" id="Place" name="Place" onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Visited</label><br />
          <input type="radio" id="visitedYes" name="visited" value="Yes" onChange={onChange} />
          <label htmlFor="visitedYes">Yes</label><br />
          <input type="radio" id="visitedNo" name="visited" value="No" onChange={onChange} />
          <label htmlFor="visitedNo">No</label>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="4" onChange={onChange} />
        </div>
        <div className="form-group">
          <button className="submit-btn" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Item;