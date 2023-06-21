import React from 'react';

const Pagination = ({ currentPage, totalItems, perPage, onChange }) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / perPage);

  // Calculate the range of page numbers to display
  const range = [];
  const maxVisiblePages = 5; // Maximum number of visible page links

  // Generate an array of page numbers to display
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
    range.push(i);
  }

  return (
    <div className="flex justify-center my-4">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {/* Render Previous button */}
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10.293 4.293a1 1 0 0 0-1.414 0L4.586 8.586A2 2 0 0 0 4 10v0a2 2 0 0 0 .586 1.414l4.293 4.293a1 1 0 0 0 1.414-1.414L7.414 11H16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H7.414l2.879-2.879a1 1 0 0 0 0-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Render page number links */}
        {range.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onChange(pageNumber)}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
              pageNumber === currentPage ? 'text-indigo-500' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* Render Next button */}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M9.707 15.707a1 1 0 0 0 1.414 0l4.293-4.293a2 2 0 0 0 .586-1.414V10a2 2 0 0 0-.586-1.414l-4.293-4.293a1 1 0 0 0-1.414 1.414L12.586 9H4a2 2 0 0 0-2 2v0a2 2 0 0 0 .586 1.414l7.121 7.121z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
