import axios from "axios";
import React, { useState, useEffect } from "react";

const TouristAttractionList = () => {
  const [products, setProducts] = useState([]);

  const handlefetchData = async () => {
    try {
      const report = await axios("http://localhost:4001/trips?keywords=");
      console.log(report.data.data);
      setProducts(report.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handlefetchData();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {products.map((item) => (
        <div
          key={item.eid}
          className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg mb-6 p-4"
        >
          {/* รูปภาพหลัก */}
          <div className="md:w-1/3">
            <img
              src={item.photos[0]}
              alt={item.title}
              className="rounded-lg w-full h-48 object-cover"
            />
          </div>

          {/* ข้อมูลสถานที่ */}
          <div className="md:w-2/3 md:ml-4">
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-500 mb-4">
              {item.description.substring(0, 100)}...{" "}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                อ่านต่อ
              </a>
            </p>

            {/* แท็ก */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* รูปภาพเพิ่มเติม */}
            <div className="flex mt-4 gap-2">
              {item.photos.slice(1).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`เพิ่มเติม ${index}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TouristAttractionList;
