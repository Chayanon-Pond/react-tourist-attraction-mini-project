import React, { useState, useEffect } from "react";
import axios from "axios";
import TouristAttractionList from "./TouristAttractionList";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (!search.trim()) {
      fetchAllData();
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 1500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAllData = async () => {
    try {
      setLoading("Loading");
      const report = await axios.get("http://localhost:4001/trips", {
        params: { keywords: "", page: 1, limit: 100 },
      });
      setLoading("success");
      setResults(report.data.data || []);
    } catch (error) {
      setLoading("Error");
      console.error("Error fetching all data:", error);
      setResults([]);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading("Loading");
      const report = await axios.get("http://localhost:4001/trips", {
        params: { keywords: search.trim(), page: 1, limit: 100 },
      });
      setLoading("success");
      setResults(report.data.data || []);
    } catch (error) {
      setLoading("Error");
      console.error("Error searching:", error);
      setResults([]);
    }
  };

  return (
    <div>
      <h3 className="flex ml-[480px]">ค้นหาที่เที่ยว</h3>
      <div className="flex justify-center mb-4 flex-col items-center mt-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาสถานที่ท่องเที่ยว..."
          className="border-gray-300 rounded-l px-4 py-2 w-1/2 shadow-lg"
        />
        {loading === "Loading" && <h2 className="text-black">Loading...</h2>}
        {loading === "Error" && (
          <h2 className="text-red-800">เกิดข้อผิดพลาดในการค้นหา</h2>
        )}
        {loading === "success" && results.length === 0 && (
          <h2 className="text-gray-500">ไม่พบสถานที่ท่องเที่ยวที่ค้นหา</h2>
        )}
        {loading === "success" && results.length > 0 && (
          <div className="mt-13">
            <TouristAttractionList attractions={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
