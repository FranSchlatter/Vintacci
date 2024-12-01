import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalProducts, 
  productsPerPage, 
  onPageChange,
  maxPagesToShow = 5 
}) => {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;

  // Calcular el rango de páginas a mostrar
  const getPageRange = () => {
    const range = [];
    const leftOffset = Math.floor(maxPagesToShow / 2);
    const rightOffset = maxPagesToShow - leftOffset - 1;

    let start = currentPage - leftOffset;
    let end = currentPage + rightOffset;

    if (start < 1) {
      end = Math.min(end + (1 - start), totalPages);
      start = 1;
    }

    if (end > totalPages) {
      start = Math.max(start - (end - totalPages), 1);
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Botón anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg border ${
          currentPage === 1
            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Primera página si no está en el rango */}
      {pageRange[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            1
          </button>
          {pageRange[0] > 2 && (
            <span className="px-2 text-gray-400">...</span>
          )}
        </>
      )}

      {/* Páginas numeradas */}
      {pageRange.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-sm rounded-lg ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Última página si no está en el rango */}
      {pageRange[pageRange.length - 1] < totalPages && (
        <>
          {pageRange[pageRange.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Botón siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg border ${
          currentPage === totalPages
            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
            : 'text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;