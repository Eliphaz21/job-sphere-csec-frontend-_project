import React, { useEffect, useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Job } from '../types';
import api from '../api';
import { Hero } from '../components/Hero';
import { SidebarFilters } from '../components/SidebarFilters';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { SavedJobItem } from '../components/SavedJobItem';
import { AddJobModal } from '../components/AddJobModal';

interface HomePageProps {
  onJobClick: (job: Job) => void;
  user: any;
}

export const HomePage = ({ onJobClick, user }: HomePageProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobsView, setSavedJobsView] = useState<Job[]>([]);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    datePosted: 'All Time',
    jobTypes: [] as string[],
    location: '',
    experienceLevel: '',
    salaryRange: [0, 150000] as [number, number],
    currency: 'Dollar',
    searchQuery: '',
    searchLocation: ''
  });

  const fetchJobs = async () => {
    try {
      const qParams = new URLSearchParams();
      if (filters.searchQuery) qParams.append('title', filters.searchQuery);
      if (filters.searchLocation) qParams.append('location', filters.searchLocation);
      if (filters.location && !filters.searchLocation) qParams.append('location', filters.location);
      if (filters.jobTypes.length > 0) qParams.append('type', filters.jobTypes[0]); // Simplifying for one mapping

      const url = qParams.toString() ? `/jobs/search?${qParams.toString()}` : '/jobs';
      const { data } = await api.get(url);
      setJobs(data);
      
      // Dynamically display up to 2 specifically bookmarked jobs in "Saved Jobs" sidebar
      const bookmarked = data.filter((j: any) => j.isBookMarked);
      setSavedJobsView(bookmarked.slice(0, 2));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchQuery, filters.searchLocation, filters.location, filters.jobTypes]);

  const resetFilters = () => {
    setFilters({
      datePosted: 'All Time',
      jobTypes: [],
      location: '',
      experienceLevel: '',
      salaryRange: [0, 150000],
      currency: 'Dollar',
      searchQuery: '',
      searchLocation: ''
    });
  };

  const wrapToggleBookmark = async (job: Job) => {
    try {
      const { data } = await api.put(`/jobs/${job._id || job.id}/bookmark`);
      const newJobs = jobs.map(j => (j._id === data._id ? data : j));
      setJobs(newJobs);
      setSavedJobsView(newJobs.filter(j => j.isBookMarked).slice(0, 2));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveJob = async (job: Job) => {
    try {
      await api.delete(`/jobs/${job._id || job.id}`);
      setJobs(jobs.filter(j => (j._id || j.id) !== (job._id || job.id)));
      setSavedJobsView(savedJobsView.filter(j => (j._id || j.id) !== (job._id || job.id)));
    } catch (e) {
      console.error('Error deleting job', e);
      alert('Failed to delete job. Are you logged in?');
    }
  };

  // Remaining frontend filters (e.g. salary, experience level) 
  // if not supported by backend currently
  const filteredJobs = React.useMemo(() => {
    const list = jobs.filter(job => {
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
        return false;
      }
      const [filterMin, filterMax] = filters.salaryRange;
      if (job.salary < filterMin || (filterMax < 150000 && job.salary > filterMax)) {
        return false;
      }
      if (filters.datePosted !== 'All Time' && job.createdAt) {
        const diffHours = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60);
        if (filters.datePosted === 'Last 24 Hours' && diffHours > 24) return false;
        if (filters.datePosted === 'Last 7 Days' && diffHours > 24 * 7) return false;
        if (filters.datePosted === 'Last Month' && diffHours > 24 * 30) return false;
      }
      if (filters.currency) {
        const cMap: any = { 'Dollar': 'USD', 'Euro': 'EUR', 'Pound': 'GBP' };
        if (cMap[filters.currency] && job.currency && job.currency.toUpperCase() !== cMap[filters.currency]) {
          return false;
        }
      }
      return true;
    });

    return list.sort((a, b) => a.title.localeCompare(b.title));
  }, [filters, jobs]);

  return (
    <div className="min-h-screen pb-20 bg-[#F8F9FB]">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <SidebarFilters 
            filters={filters} 
            setFilters={setFilters} 
            resetFilters={resetFilters} 
          />

          <main className="lg:col-span-6">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="flex-1 w-full">
                <SearchBar 
                  searchQuery={filters.searchQuery} 
                  searchLocation={filters.searchLocation} 
                  setFilters={setFilters} 
                  filters={filters} 
                />
              </div>
              {user && (
                <button 
                  onClick={() => setIsAddJobModalOpen(true)}
                  className="px-8 py-[18px] bg-[#0046D5] text-white font-bold text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-sm shrink-0 w-full md:w-auto"
                >
                  Add Job
                </button>
              )}
            </div>

            <div className="space-y-2">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job._id || job.id} 
                    job={job} 
                    onClick={() => onJobClick(job)} 
                    onBookmark={() => wrapToggleBookmark(job)} 
                    onRemove={user && job.user === user._id ? () => handleRemoveJob(job) : undefined}
                  />
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
                  <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </main>

          <aside className="lg:col-span-3">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">Saved Jobs</h2>
              </div>
              <div className="space-y-1">
                {savedJobsView.map(job => (
                  <SavedJobItem key={job._id || job.id} job={job} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <AddJobModal 
        isOpen={isAddJobModalOpen} 
        onClose={() => setIsAddJobModalOpen(false)} 
        onJobAdded={fetchJobs} 
      />
    </div>
  );
};
