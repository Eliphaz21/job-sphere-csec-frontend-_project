import React from 'react';
import { Bookmark, Share2, Trash2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../types';

const formatDistanceToNow = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) return `${Math.floor(diffDays)}d ago`;
  const diffMonths = diffDays / 30;
  return `${Math.floor(diffMonths)}mo ago`;
};
interface JobCardProps {
  job: Job;
  onClick: () => void;
  onBookmark?: (job: Job) => void;
  onRemove?: (job: Job) => void;
  key?: React.Key;
}

export const JobCard = ({ job, onClick, onBookmark, onRemove }: JobCardProps) => {
  const [imgError, setImgError] = React.useState(false);

  return (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group mb-4"
    onClick={onClick}
  >
    <div className="flex gap-4">
      <div className="w-14 h-14 rounded-xl bg-[#F8F9FB] flex items-center justify-center overflow-hidden border border-gray-100 p-2 shrink-0">
        {!imgError && job.logo ? (
          <img 
            src={job.logo.startsWith('http') ? job.logo : `https://${job.logo}`} 
            alt={job.company} 
            className="w-full h-full object-contain" 
            referrerPolicy="no-referrer" 
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-bold text-gray-400">{job.company?.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0046D5] transition-colors">{job.title}</h3>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-sm text-gray-500 font-medium">{job.company}</p>
              {job.createdAt && (
                <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(job.createdAt)}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmark?.(job); }}
              className="p-2 text-gray-400 hover:text-[#0046D5] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Bookmark className={`w-5 h-5 ${job.isBookMarked ? 'fill-[#0046D5] text-[#0046D5]' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#0046D5] hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {onRemove && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(job); }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                title="Remove Job"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 bg-[#F1F2F4] text-gray-600 text-xs font-semibold rounded-md">{job.location}</span>
          <span className="px-3 py-1 bg-[#F1F2F4] text-gray-600 text-xs font-semibold rounded-md">{job.type}</span>
          <span className="px-3 py-1 bg-[#F1F2F4] text-gray-600 text-xs font-semibold rounded-md">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: (() => {
              const c = (job.currency || 'USD').toUpperCase();
              if (c.includes('EUR') || c === 'EURO') return 'EUR';
              if (c.includes('GBP') || c === 'POUND') return 'GBP';
              return 'USD';
            })(), maximumFractionDigits: 0 }).format(job.salary)}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
          {job.description}
        </p>
      </div>
    </div>
  </motion.div>
  );
};
