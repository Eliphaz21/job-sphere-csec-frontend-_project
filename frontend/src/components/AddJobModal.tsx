import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: () => void;
}

export const AddJobModal = ({ isOpen, onClose, onJobAdded }: AddJobModalProps) => {
  const [formData, setFormData] = useState({
    title: '', type: 'Full-time', salary: '', description: '', company: '',
    logo: '', location: '', experienceLevel: 'Mid Level', currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/jobs', { ...formData, salary: Number(formData.salary) });
      onJobAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Add New Job</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Company</label>
              <input required name="company" value={formData.company} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Location</label>
              <input required name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Salary</label>
              <input required type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Currency</label>
              <input required name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full border p-2 rounded">
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
                <option>Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Company Logo URL</label>
              <input name="logo" value={formData.logo} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows={4}></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700">
            {loading ? 'Adding...' : 'Add Job'}
          </button>
        </form>
      </div>
    </div>
  );
};
