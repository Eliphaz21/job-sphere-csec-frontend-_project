import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  searchLocation: string;
  setFilters: (filters: any) => void;
  filters: any;
}

const DEBOUNCE_DELAY = 400; // ms

export const SearchBar = ({
  searchQuery,
  searchLocation,
  setFilters,
  filters,
}: SearchBarProps) => {
  // Local state — reflects what the user is typing instantly
  const [inputQuery, setInputQuery] = useState(searchQuery);
  const [inputLocation, setInputLocation] = useState(searchLocation);

  // Sync local state when parent resets filters externally (e.g. "Reset" button)
  useEffect(() => {
    setInputQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setInputLocation(searchLocation);
  }, [searchLocation]);

  // Debounce: only call setFilters after the user stops typing for DEBOUNCE_DELAY ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, searchQuery: inputQuery });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer); // cleanup on next keystroke
  }, [inputQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, searchLocation: inputLocation });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [inputLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white p-2 rounded-2xl shadow-sm flex items-center gap-2 border border-gray-200 w-full">
      <div className="flex-1 flex items-center gap-3 px-4 border-r border-gray-100">
        <Search className="w-4 h-4 text-gray-900" />
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Job title, Keywords, or Company name"
          className="w-full outline-none text-xs font-medium placeholder:text-gray-400"
        />
      </div>
      <div className="flex-1 flex items-center gap-3 px-4">
        <MapPin className="w-4 h-4 text-gray-900" />
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Location"
          className="w-full outline-none text-xs font-medium placeholder:text-gray-400"
        />
      </div>
      <button className="px-8 py-2.5 bg-[#0046D5] text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all shrink-0">
        Search
      </button>
    </div>
  );
};
