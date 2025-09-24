import './App.css';
import { LoadScript } from "@react-google-maps/api";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './component/Navbar'
import Map from "./component/Map"; 
import Login from './component/Login';
import Signin from './component/Signin';
import AddPoint from './component/AddPoint';



function App() {
  return (
    <LoadScript googleMapsApiKey={process.env.Google_key}>
    <Router>
    <Navbar />
    <div>
    <Routes>
      <Route path="/" element={<Map />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/addpoint" element={<AddPoint/>} />
      

    </Routes>
    </div>
  </Router>
  </LoadScript>
  );
}

export default App;
