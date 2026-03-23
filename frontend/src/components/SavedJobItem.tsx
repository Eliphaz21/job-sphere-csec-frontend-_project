import React from 'react';
import { X } from 'lucide-react';
import { Job } from '../types';

interface SavedJobItemProps {
  job: Job;
  key?: React.Key;
}

export const SavedJobItem = ({ job }: SavedJobItemProps) => {
  const [imgError, setImgError] = React.useState(false);
  
  const getLogoBg = (company: string) => {
    if (company.includes('Binford')) return 'bg-[#008000]';
    if (company.includes('Abstergo')) return 'bg-[#0046D5]';
    if (company.includes('Sushi')) return 'bg-[#FF0000]';
    if (company.includes('Barone')) return 'bg-[#008000]';
    if (company.includes('Acme')) return 'bg-[#0046D5]';
    if (company.includes('Big Kahuna')) return 'bg-[#FF0000]';
    if (company.includes('Biffco')) return 'bg-[#FF0000]';
    return 'bg-[#FF0000]';
  };

  return (
    <div className="p-4 bg-white rounded-[24px] border border-gray-100 mb-4 hover:shadow-lg transition-all relative group shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full ${getLogoBg(job.company)} flex items-center justify-center border border-gray-50 p-2.5 shrink-0 overflow-hidden`}>
          {!imgError && job.logo ? (
            <img 
              src={job.logo.startsWith('http') ? job.logo : `https://${job.logo}`} 
              alt={job.company} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xl font-bold text-white tracking-widest leading-none pb-0.5">{job.company?.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-lg font-bold text-gray-900 truncate">{job.title}</h4>
            <button className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-2">{job.company}</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#F1F2F4] text-gray-500 text-[11px] font-bold rounded-full">{job.location}</span>
            <span className="px-3 py-1 bg-[#F1F2F4] text-gray-500 text-[11px] font-bold rounded-full">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: (() => {
                const c = (job.currency || 'USD').toUpperCase();
                if (c.includes('EUR') || c === 'EURO') return 'EUR';
                if (c.includes('GBP') || c === 'POUND') return 'GBP';
                return 'USD';
              })(), maximumFractionDigits: 0 }).format(job.salary)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
