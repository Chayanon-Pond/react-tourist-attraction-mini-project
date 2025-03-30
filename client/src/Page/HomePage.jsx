import SearchBar from "../Components/SearchBar";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6 mt-10">
        เที่ยวไหนดี
      </h1>
      <SearchBar />
    </div>
  );
};
export default HomePage;
