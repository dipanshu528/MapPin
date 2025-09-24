import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate, useLocation } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "95vh",
  marginTop: "0px"
};

const center = {
  lat: 28.7041,
  lng: 77.1025,
};

const Map = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.Google_key,
  });

  // Fetch all points from backend
 
    const fetchPoints = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found, user may not be logged in");
        return;
      }
      try {
        const res = await fetch("https://mappin-pzu8.onrender.com/api/map/getallpoints", {
          headers: {
            "auth-token": token,
          },
        });
        const json = await res.json();
        if (res.ok) {
          setPoints(json);
        } else {
          console.error("Error fetching points:", json);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

   useEffect(() => {
  if (localStorage.getItem('token')) {
    fetchPoints();
  } else {
    alert('Please login first');
  }
}, []); // <--- empty dependency so it runs only once



  //  Define the handleRemove function
  const handleRemove = async (itemId) => {
    try {
      const response = await fetch(`https://mappin-pzu8.onrender.com/api/map/deletepoint/${itemId}`, {
      method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
  
      if (response.ok) {
        alert('mapPoint removed successfully');
        fetchPoints();
        setSelectedPoint(null);
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };


  // Deinfe the handleEdit function
  const handleEdit = (point) => {
  const queryParams = new URLSearchParams({
    mode: "edit",
    id: point._id,
    placeName: point.placeName,
    city: point.city,
    description: point.description,
    rating: point.rating,
    imageURL: point.imageURL,
    visited: point.visited,
    lat: point.latitude,
    lng: point.longitude,
  });

  navigate(`/addpoint?${queryParams.toString()}`);
};



  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    navigate(`/addpoint?lat=${clickedLat}&lng=${clickedLng}`);
  };

  const isAddingPoint = new URLSearchParams(location.search).get("mode") === "add";
  // console.log("adding point", isAddingPoint)

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onClick={isAddingPoint ? handleMapClick : null}
    >
     
      {points.map((point) => (
  <Marker
    key={point._id}
    position={{
      lat: parseFloat(point.latitude),
      lng: parseFloat(point.longitude),
    }}
    title={point.placeName}
    onClick={() => setSelectedPoint(point)} // Set selected point on click
     icon={{
      url: point.visited ? "https://cdn-icons-png.flaticon.com/512/14090/14090489.png"
                         : "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
                         scaledSize: new window.google.maps.Size(40, 40),
    }}
  />
))}

{selectedPoint && (
<InfoWindow
  position={{
    lat: parseFloat(selectedPoint.latitude),
    lng: parseFloat(selectedPoint.longitude),
  }}
  onCloseClick={() => setSelectedPoint(null)}
>
  <div
    className="map-card"
    style={{
      width: "250px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      fontFamily: "Arial, sans-serif",
      overflow: "hidden",
    }}
  >
    <img
      src={selectedPoint.imageURL}
      alt={selectedPoint.placeName}
      style={{
        width: "100%",
        height: "150px",
        objectFit: "cover",
      }}
    />
    <div style={{ padding: "12px" }}>
      <h5 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "bold" }}>
        {selectedPoint.placeName}, {selectedPoint.city}
      </h5>
      <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#555" }}>
        {selectedPoint.description}
      </p>
      <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
        <strong>Visited:</strong>{" "}
        <span style={{ color: selectedPoint.visited ? "green" : "red" }}>
          {selectedPoint.visited ? "Yes" : "No"}
        </span>
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <i
          className="fa-solid fa-pen"
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => handleEdit(selectedPoint)}
        ></i>
        <i
          className="fa-solid fa-trash"
          style={{ cursor: "pointer", color: "#dc3545" }}
          onClick={() => handleRemove(selectedPoint._id)}
        ></i>
      </div>
    </div>
  </div>
</InfoWindow>

)}

    </GoogleMap>
  );
};

export default Map;



















// import React, { useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
// import { useNavigate, useLocation } from "react-router-dom";

// const containerStyle = {
//   width: "100%",
//   height: "95vh",
//   marginTop: "0px"
// };

// const center = {
//   lat: 28.7041,
//   lng: 77.1025,
// };

// const Map = () => {
//   const [points, setPoints] = useState([]);
//   const [selectedPoint, setSelectedPoint] = useState(null);

//   const location = useLocation();
//   const navigate = useNavigate();

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.Google_key,
//   });

//   // Fetch all points from backend
 
//     const fetchPoints = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("Token not found, user may not be logged in");
//         return;
//       }
//       try {
//         const res = await fetch("http://localhost:4000/api/map/getallpoints", {
//           headers: {
//             "auth-token": token,
//           },
//         });
//         const json = await res.json();
//         if (res.ok) {
//           setPoints(json);
//         } else {
//           console.error("Error fetching points:", json);
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//       }
//     };

//    if (localStorage.getItem('token')) {
//     fetchPoints();
//   } else {
//     alert('Please login first');
//   }


//   //  Define the handleRemove function
//   const handleRemove = async (itemId) => {
//     try {
//       const response = await fetch(`http://localhost:4000/api/map/deletepoint/${itemId}`, {
//       method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'auth-token': localStorage.getItem('token')
//         }
//       });
  
//       if (response.ok) {
//         alert('mapPoint removed successfully');
//         fetchPoints();
//         setSelectedPoint(null);
//       } else {
//         throw new Error('Failed to remove item');
//       }
//     } catch (error) {
//       console.error('Error removing item:', error);
//     }
//   };


//   // Deinfe the handleEdit function
//   const handleEdit = (point) => {
//   const queryParams = new URLSearchParams({
//     mode: "edit",
//     id: point._id,
//     placeName: point.placeName,
//     city: point.city,
//     description: point.description,
//     rating: point.rating,
//     imageURL: point.imageURL,
//     visited: point.visited,
//     lat: point.latitude,
//     lng: point.longitude,
//   });

//   navigate(`/addpoint?${queryParams.toString()}`);
// };



//   const handleMapClick = (event) => {
//     const clickedLat = event.latLng.lat();
//     const clickedLng = event.latLng.lng();
//     navigate(`/addpoint?lat=${clickedLat}&lng=${clickedLng}`);
//   };

//   const isAddingPoint = new URLSearchParams(location.search).get("mode") === "add";
//   console.log("adding point", isAddingPoint)

//   if (!isLoaded) {
//     return <div>Loading Map...</div>;
//   }

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//       onClick={isAddingPoint ? handleMapClick : null}
//     >
     
//       {points.map((point) => (
//   <Marker
//     key={point._id}
//     position={{
//       lat: parseFloat(point.latitude),
//       lng: parseFloat(point.longitude),
//     }}
//     title={point.placeName}
//     onClick={() => setSelectedPoint(point)} // Set selected point on click
//      icon={{
//       url: point.visited ? "https://cdn-icons-png.flaticon.com/512/14090/14090489.png"
//                          : "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
//                          scaledSize: new window.google.maps.Size(40, 40),
//     }}
//   />
// ))}

// {selectedPoint && (
// <InfoWindow
//   position={{
//     lat: parseFloat(selectedPoint.latitude),
//     lng: parseFloat(selectedPoint.longitude),
//   }}
//   onCloseClick={() => setSelectedPoint(null)}
// >
//   <div
//     className="map-card"
//     style={{
//       width: "250px",
//       borderRadius: "10px",
//       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//       fontFamily: "Arial, sans-serif",
//       overflow: "hidden",
//     }}
//   >
//     <img
//       src={selectedPoint.imageURL}
//       alt={selectedPoint.placeName}
//       style={{
//         width: "100%",
//         height: "150px",
//         objectFit: "cover",
//       }}
//     />
//     <div style={{ padding: "12px" }}>
//       <h5 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "bold" }}>
//         {selectedPoint.placeName}, {selectedPoint.city}
//       </h5>
//       <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#555" }}>
//         {selectedPoint.description}
//       </p>
//       <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
//         <strong>Visited:</strong>{" "}
//         <span style={{ color: selectedPoint.visited ? "green" : "red" }}>
//           {selectedPoint.visited ? "Yes" : "No"}
//         </span>
//       </p>
//       <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
//         <i
//           className="fa-solid fa-pen"
//           style={{ cursor: "pointer", color: "#007bff" }}
//           onClick={() => handleEdit(selectedPoint)}
//         ></i>
//         <i
//           className="fa-solid fa-trash"
//           style={{ cursor: "pointer", color: "#dc3545" }}
//           onClick={() => handleRemove(selectedPoint._id)}
//         ></i>
//       </div>
//     </div>
//   </div>
// </InfoWindow>

// )}

//     </GoogleMap>
//   );
// };

// export default Map;




