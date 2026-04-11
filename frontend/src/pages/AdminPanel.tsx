import React, { useEffect, useState, useCallback } from 'react';
import { Users, Briefcase, FileText, Trash2, Edit2, Check, X, Plus, ChevronDown, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../api';
import { Job } from '../types';

// ── Types ──────────────────────────────────────────────────
interface User { _id: string; name: string; email: string; isAdmin: boolean; createdAt: string; }
interface Application {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  userId: { _id: string; name: string; email: string };
  jobId: { _id: string; title: string; company: string; location: string; type: string; salary: number; currency: string; logo: string };
}
interface Stats { totalUsers: number; totalJobs: number; totalApplications: number; }

type Tab = 'overview' | 'users' | 'jobs' | 'applications';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

// ── Job Form Modal ─────────────────────────────────────────
const JOB_DEFAULTS = { title: '', type: 'Full-time', salary: '', description: '', company: '', logo: '', location: '', experienceLevel: 'Mid Level', currency: 'USD' };
const JobFormModal = ({ job, onClose, onSaved }: { job: Job | null; onClose: () => void; onSaved: () => void }) => {
  const isEdit = !!job;
  const [form, setForm] = useState(isEdit ? {
    title: job.title, type: job.type, salary: String(job.salary), description: job.description,
    company: job.company, logo: job.logo || '', location: job.location,
    experienceLevel: job.experienceLevel || 'Mid Level', currency: job.currency || 'USD'
  } : JOB_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, salary: Number(form.salary) };
      if (isEdit) await api.put(`/jobs/${job._id}`, payload);
      else await api.post('/jobs', payload);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Job' : 'Add New Job'}</h2>
        {error && <p className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['title', 'Job Title'], ['company', 'Company']].map(([name, label]) => (
              <div key={name}>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
                <input required name={name} value={(form as any)[name]} onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Location</label>
              <input required name="location" value={form.location} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors">
                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Salary</label>
              <input required type="number" name="salary" value={form.salary} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors">
                {['USD', 'EUR', 'GBP'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors">
                {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Company Logo URL</label>
              <input name="logo" value={form.logo} onChange={handleChange} placeholder="https://...logo.png"
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea required name="description" value={form.description} onChange={handleChange} rows={4}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#0046D5] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 shadow-lg shadow-blue-200">
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Job')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── Edit User Modal ────────────────────────────────────────
const EditUserModal = ({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved: () => void }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.put(`/admin/users/${user._id}`, form);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit User</h2>
        {error && <p className="text-red-500 text-sm font-semibold mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name', 'Full Name', 'text'], ['email', 'Email', 'email']].map(([name, label, type]) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
              <input required type={type} value={(form as any)[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#0046D5] transition-colors" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-[#0046D5] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

// ── Main AdminPanel ────────────────────────────────────────
export const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [users,   setUsers]   = useState<User[]>([]);
  const [jobs,    setJobs]    = useState<Job[]>([]);
  const [apps,    setApps]    = useState<Application[]>([]);

  const [editingJob,  setEditingJob]  = useState<Job | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);

  // ── Fetch helpers ────────────────────────────────────────
  const fetchStats    = useCallback(async () => { try { const { data } = await api.get('/admin/stats');         setStats(data);   } catch {} }, []);
  const fetchUsers    = useCallback(async () => { try { const { data } = await api.get('/admin/users');         setUsers(data);   } catch {} }, []);
  const fetchJobs     = useCallback(async () => { try { const { data } = await api.get('/jobs');                setJobs(data);    } catch {} }, []);
  const fetchApps     = useCallback(async () => { try { const { data } = await api.get('/admin/applications'); setApps(data);    } catch {} }, []);

  useEffect(() => { fetchStats(); fetchJobs(); }, [fetchStats, fetchJobs]);
  useEffect(() => { if (tab === 'users')        fetchUsers(); }, [tab, fetchUsers]);
  useEffect(() => { if (tab === 'applications') fetchApps();  }, [tab, fetchApps]);

  // ── User actions ─────────────────────────────────────────
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user and all their applications?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchUsers(); fetchStats(); } catch {}
  };

  // ── Job actions ───────────────────────────────────────────
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    try { await api.delete(`/jobs/${id}`); fetchJobs(); fetchStats(); } catch {}
  };

  // ── Application status ────────────────────────────────────
  const handleStatusChange = async (appId: string, status: string) => {
    try {
      const { data } = await api.put(`/admin/applications/${appId}/status`, { status });
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status: data.status } : a));
    } catch {}
  };

  // ── Tab nav ───────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview',      label: 'Overview',     icon: BarChart3  },
    { id: 'users',         label: 'Users',        icon: Users      },
    { id: 'jobs',          label: 'Jobs',         icon: Briefcase  },
    { id: 'applications',  label: 'Applications', icon: FileText   },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage users, jobs and applications</p>
          </div>
          {tab === 'jobs' && (
            <button onClick={() => { setEditingJob(null); setShowJobForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0046D5] text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4" /> Add Job
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tab navigation */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit mb-8 shadow-sm">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === id ? 'bg-[#0046D5] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Overview tab ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Users}    label="Total Users"        value={stats?.totalUsers        ?? 0} color="bg-[#0046D5]" />
                <StatCard icon={Briefcase} label="Total Jobs"        value={stats?.totalJobs         ?? 0} color="bg-indigo-500" />
                <StatCard icon={FileText} label="Total Applications" value={stats?.totalApplications ?? 0} color="bg-emerald-500" />
              </div>

              {/* Quick jobs preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Recent Jobs</h2>
                  <button onClick={() => setTab('jobs')} className="text-xs text-[#0046D5] font-bold hover:underline">View all</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job._id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          {job.logo ? <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                            : <span className="text-lg font-bold text-gray-400">{job.company?.[0]}</span>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{job.type}</span>
                    </div>
                  ))}
                  {jobs.length === 0 && <p className="px-6 py-8 text-center text-gray-400 text-sm">No jobs yet.</p>}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Users tab ── */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h2 className="font-bold text-gray-900">All Users ({users.filter(u => !u.isAdmin).length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        {['Name', 'Email', 'Joined', 'Role', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.filter(u => !u.isAdmin).map(user => (
                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[#0046D5] font-bold text-sm shrink-0">
                                {user.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">User</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditingUser(user)}
                                className="p-2 text-gray-400 hover:text-[#0046D5] hover:bg-blue-50 rounded-lg transition-all" title="Edit user">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteUser(user._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete user">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.filter(u => !u.isAdmin).length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Jobs tab ── */}
          {tab === 'jobs' && (
            <motion.div key="jobs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h2 className="font-bold text-gray-900">All Jobs ({jobs.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        {['Job', 'Location', 'Type', 'Salary', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {jobs.map(job => (
                        <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                {job.logo ? <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                                  : <span className="text-lg font-bold text-gray-400">{job.company?.[0]}</span>}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{job.title}</p>
                                <p className="text-xs text-gray-500">{job.company}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{job.location}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">{job.type}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: job.currency || 'USD', maximumFractionDigits: 0 }).format(job.salary)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditingJob(job); setShowJobForm(true); }}
                                className="p-2 text-gray-400 hover:text-[#0046D5] hover:bg-blue-50 rounded-lg transition-all" title="Edit job">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteJob(job._id!)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete job">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {jobs.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No jobs found. Add one above.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Applications tab ── */}
          {tab === 'applications' && (
            <motion.div key="applications" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h2 className="font-bold text-gray-900">All Applications ({apps.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        {['Applicant', 'Job', 'Applied', 'Status', 'Update Status'].map(h => (
                          <th key={h} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {apps.map(app => (
                        <tr key={app._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{app.userId?.name ?? '—'}</p>
                            <p className="text-xs text-gray-500">{app.userId?.email ?? '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            {app.jobId ? (
                              <>
                                <p className="font-semibold text-gray-900">{app.jobId.title}</p>
                                <p className="text-xs text-gray-500">{app.jobId.company}</p>
                              </>
                            ) : <span className="text-gray-400 italic">Job deleted</span>}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleStatusChange(app._id, 'accepted')} title="Accept"
                                className={`p-2 rounded-lg transition-all ${app.status === 'accepted' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'}`}>
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleStatusChange(app._id, 'rejected')} title="Reject"
                                className={`p-2 rounded-lg transition-all ${app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                                <X className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleStatusChange(app._id, 'pending')} title="Reset to pending"
                                className={`p-2 rounded-lg transition-all ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}>
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {apps.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No applications yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      {showJobForm && (
        <JobFormModal
          job={editingJob}
          onClose={() => { setShowJobForm(false); setEditingJob(null); }}
          onSaved={() => { fetchJobs(); fetchStats(); }}
        />
      )}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={fetchUsers}
        />
      )}
    </div>
  );
};
