import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { setActiveFilters } from '../../../redux/actions/filterActions';

const SearchBar = () => {
  const dispatch = useDispatch();
  const activeFilters = useSelector(state => state.filters.activeFilters);

  const handleSearch = (value) => {
    dispatch(setActiveFilters({
      ...activeFilters,
      search: value
    }));
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={activeFilters.search || ''}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;