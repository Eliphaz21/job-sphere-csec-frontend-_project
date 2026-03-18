import React, { useEffect, useState } from 'react';
import { ChevronLeft, Star, Bookmark, Share2, Search, MapPin } from 'lucide-react';
import { Job } from '../types';
import api from '../api';
import { SavedJobItem } from '../components/SavedJobItem';

interface JobDetailsPageProps {
  job: Job;
  onBack: () => void;
  onApply: () => void;
}

export const JobDetailsPage = ({ job: initialJob, onBack, onApply }: JobDetailsPageProps) => {
  const [job, setJob] = useState(initialJob);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const { data } = await api.get('/jobs');
        setRelatedJobs(data.filter((j: Job) => j._id !== job._id).slice(0, 2));
      } catch (e) {}
    };
    fetchRelated();
  }, [job]);

  const handleApplyClick = async () => {
    setIsApplying(true);
    setApplyMessage('');
    try {
      await api.post('/applications', { jobId: job._id || job.id });
      onApply();
    } catch (e: any) {
      setApplyMessage(e.response?.data?.message || 'Error applying for job - Are you logged in?');
    } finally {
      setIsApplying(false);
    }
  }

  const handleBookmarkToggle = async () => {
    try {
      const { data } = await api.put(`/jobs/${job._id || job.id}/bookmark`);
      setJob(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-semibold shrink-0">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xl">Back</span>
        </button>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl bg-white p-1.5 rounded-full shadow-2xl shadow-gray-200/60 border border-gray-100 flex items-center">
            <div className="flex-[1.5] flex items-center gap-3 px-6 border-r border-gray-100">
              <Search className="w-5 h-5 text-gray-900" />
              <input
                type="text"
                placeholder="Job title, Keywords, or Company name"
                className="w-full outline-none text-sm font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6">
              <MapPin className="w-5 h-5 text-gray-900" />
              <input
                type="text"
                placeholder="Location"
                className="w-full outline-none text-sm font-medium placeholder:text-gray-400"
              />
            </div>
            <button className="px-12 py-3 bg-[#0046D5] text-white font-bold text-sm rounded-full hover:bg-blue-700 transition-all">
              Search
            </button>
          </div>
        </div>

        <div className="w-24 hidden md:block"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <div className="bg-white p-8 rounded-2xl border-2 border-[#0046D5] shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0 p-2">
                  {job.logo ? (
                     <img 
                        src={job.logo.startsWith('http') ? job.logo : `https://${job.logo}`} 
                        alt={job.company} 
                        className="w-full h-full object-contain" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                     />
                  ) : (
                     <span className="text-3xl font-bold text-gray-400">{job.company?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-xl text-gray-600 font-medium">{job.company}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-5 h-5 ${s <= (job.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-6 w-full md:w-auto">
                <div className="flex items-center gap-4">
                  <button onClick={handleBookmarkToggle} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Bookmark className={`w-7 h-7 ${job.isBookMarked ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Share2 className="w-7 h-7" />
                  </button>
                </div>
                <button
                  onClick={handleApplyClick}
                  disabled={isApplying}
                  className="w-full md:w-auto px-12 py-4 bg-blue-700 text-white font-bold text-lg rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isApplying ? 'Applying...' : 'Apply now'}
                </button>
                {applyMessage && <p className="text-red-500 font-semibold text-sm">{applyMessage}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-3 space-y-8">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Job type:</p>
                  <p className="text-gray-600">{job.type}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Location:</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Experience:</p>
                  <p className="text-gray-600">{job.experienceLevel || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Salary:</p>
                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: (() => {
                      const c = (job.currency || 'USD').toUpperCase();
                      if (c.includes('EUR') || c === 'EURO') return 'EUR';
                      if (c.includes('GBP') || c === 'POUND') return 'GBP';
                      return 'USD';
                    })(), maximumFractionDigits: 0 }).format(job.salary)}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">Applications:</p>
                  <p className="text-gray-600">{job.applicants || 0}</p>
                </div>
              </div>

              <div className="md:col-span-9 space-y-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Job description</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Related Jobs</h2>
            <div className="space-y-4">
              {relatedJobs.map(relatedJob => (
                <SavedJobItem key={relatedJob._id || relatedJob.id} job={relatedJob} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
