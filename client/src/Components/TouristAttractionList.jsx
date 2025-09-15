import axios from "axios";
import React, { useState, useEffect } from "react";

const TouristAttractionList = (props) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // if parent provides attractions prop, show 5 per page, otherwise use server default 10
  const isPropMode = props?.attractions && Array.isArray(props.attractions);
  const itemsPerPage = isPropMode ? 5 : 10;

  const handlefetchData = async (page = 1) => {
    try {
      if (!isPropMode) {
        const report = await axios.get("http://localhost:4001/trips", {
          params: {
            keywords: "",
            page,
            limit: itemsPerPage,
          },
        });
        // server returns { data: [...], meta: { total, page, perPage, totalPages } }
        setProducts(report.data.data || []);
        setTotalPages(report.data.meta?.totalPages || 1);
        setCurrentPage(report.data.meta?.page || page);
      } else {
        // prop-mode handled by effect; just ensure currentPage is set
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // when parent passes attractions, dedupe and set products + pagination
  useEffect(() => {
    if (isPropMode) {
      const deduped = Array.from(
        new Map(props.attractions.map((a) => [a.eid, a])).values()
      );
      setProducts(deduped);
      setTotalPages(Math.max(Math.ceil(deduped.length / itemsPerPage), 1));
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.attractions]);

  useEffect(() => {
    handlefetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // slice according to itemsPerPage (client-mode or server returns already paginated)
  const paginatedProducts = isPropMode
    ? products.slice(
        (currentPage - 1) * itemsPerPage,
        (currentPage - 1) * itemsPerPage + itemsPerPage
      )
    : products;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    if (isPropMode) {
      setCurrentPage(page);
    } else {
      handlefetchData(page);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Pagination Controls */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50  cursor-pointer"
        >
          ก่อนหน้า
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 cursor-pointer"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
        >
          ถัดไป
        </button>
      </div>
      {/* List Items */}
      {paginatedProducts.map((item) => (
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
