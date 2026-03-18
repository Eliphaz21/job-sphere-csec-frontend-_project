import React from 'react';
import { MapPin } from 'lucide-react';

interface SidebarFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
}

export const SidebarFilters = ({ filters, setFilters, resetFilters }: SidebarFiltersProps) => (
  <aside className="lg:col-span-3">
    <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Filter</h2>
      
      <div className="space-y-8">
        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Date Posted</label>
          <select 
            value={filters.datePosted}
            onChange={(e) => setFilters({ ...filters, datePosted: e.target.value })}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0046D5] appearance-none cursor-pointer"
          >
            <option>All Time</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last Month</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Job Type</label>
          <div className="p-4 border border-gray-200 rounded-2xl space-y-3">
            {['Full-time', 'Part-time', 'Contract', 'Volunteer', 'Internship', 'Remote', 'Hybrid', 'On-Site'].map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.jobTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked 
                      ? [...filters.jobTypes, type]
                      : filters.jobTypes.filter((t: string) => t !== type);
                    setFilters({ ...filters, jobTypes: newTypes });
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#0046D5] focus:ring-[#0046D5]" 
                />
                <span className="text-sm text-gray-600 group-hover:text-[#0046D5] transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Location</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter your location" 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0046D5]" 
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Experience Level</label>
          <select 
            value={filters.experienceLevel}
            onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0046D5] appearance-none cursor-pointer"
          >
            <option value="">All Levels</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
            <option>Executive</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Salary Range</label>
          <div className="relative h-6 flex items-center mb-2 px-1">
            <div className="absolute w-full h-1 bg-blue-100 rounded-full" />
            <div 
              className="absolute h-1 bg-[#0046D5] rounded-full" 
              style={{
                left: `${((filters.salaryRange[0] - 0) / (150000 - 0)) * 100}%`,
                right: `${100 - ((filters.salaryRange[1] - 0) / (150000 - 0)) * 100}%`
              }}
            />
            <input 
              type="range" 
              min="0" 
              max="150000" 
              step="1000"
              value={filters.salaryRange[0]}
              onChange={(e) => {
                const val = Math.min(parseInt(e.target.value), filters.salaryRange[1] - 5000);
                setFilters({ ...filters, salaryRange: [val, filters.salaryRange[1]] });
              }}
              className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#0046D5] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
            />
            <input 
              type="range" 
              min="0" 
              max="150000" 
              step="1000"
              value={filters.salaryRange[1]}
              onChange={(e) => {
                const val = Math.max(parseInt(e.target.value), filters.salaryRange[0] + 5000);
                setFilters({ ...filters, salaryRange: [filters.salaryRange[0], val] });
              }}
              className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#0046D5] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{filters.salaryRange[0]}</span>
            <span>{filters.salaryRange[1]}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Input Manually</label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block mb-1">From</span>
              <input 
                type="number" 
                value={filters.salaryRange[0]}
                onChange={(e) => setFilters({ ...filters, salaryRange: [parseInt(e.target.value) || 0, filters.salaryRange[1]] })}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none" 
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-gray-400 block mb-1">To</span>
              <input 
                type="number" 
                value={filters.salaryRange[1]}
                onChange={(e) => setFilters({ ...filters, salaryRange: [filters.salaryRange[0], parseInt(e.target.value) || 0] })}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none" 
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-900 mb-3 block">Currency</label>
          <select 
            value={filters.currency}
            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#0046D5] appearance-none cursor-pointer"
          >
            <option>Dollar</option>
            <option>Euro</option>
            <option>Pound</option>
          </select>
        </div>

        <button 
          onClick={resetFilters}
          className="w-full py-4 bg-[#0046D5] text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          Reset all filter
        </button>
      </div>
    </div>
  </aside>
);
