import React from 'react';
import { Briefcase, Mail, Lock, ChevronLeft, Apple, Facebook, Linkedin } from 'lucide-react';
import { Page } from '../types';
import loginpage from '../assets/loginpage.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: any) => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const LoginPage = ({ onNavigate, onLogin }: LoginPageProps) => {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { data } = await api.post('/auth/login', values);
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
      } catch (error: any) {
        setStatus(error.response?.data?.message || 'Login failed');
        console.error('Login error', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden bg-white relative">
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors z-50 bg-white/50 md:bg-transparent px-3 py-1.5 rounded-lg md:px-0 md:py-0"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Left pane - Image */}
      <div className="w-full md:w-1/2 bg-[#F6F6F6] border-b md:border-b-0 md:border-r border-[#E5E7EB] flex items-center justify-center p-8 lg:p-16 relative">
        <img
          src={loginpage}
          alt="Job Search Illustration"
          className="w-full h-auto object-contain max-h-[85%]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Right pane - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-16 relative z-10">
        <div className="max-w-[340px] w-full mx-auto">
          {/* Logo */}
          <div className="mb-8 inline-flex">
            <div className="bg-[#0046D5] px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('home')}>
              <Briefcase className="w-4 h-4 text-white fill-white" />
              <span className="text-[11px] font-bold text-white tracking-widest leading-none mt-0.5">JOBSPHEERE</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-black mb-8">Log in to your account</h1>
          {formik.status && <div className="mb-4 text-red-500 text-sm font-bold">{formik.status}</div>}

          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${formik.touched.email && formik.errors.email ? 'text-red-400' : 'text-gray-500'}`} />
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-2.5 text-[13px] bg-white border outline-none transition-colors rounded-lg ${formik.touched.email && formik.errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-400'} placeholder:text-gray-400`}
              />
              {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.email}</p>}
            </div>

            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${formik.touched.password && formik.errors.password ? 'text-red-400' : 'text-gray-500'}`} />
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password"
                className={`w-full pl-10 pr-4 py-2.5 text-[13px] bg-white border outline-none transition-colors rounded-lg ${formik.touched.password && formik.errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-400'} placeholder:text-gray-400`}
              />
              {formik.touched.password && formik.errors.password && <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full !mt-6 py-2.5 bg-[#0046D5] text-white text-[14px] font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${formik.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {formik.isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Login
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-[11px] text-black font-semibold uppercase"><span className="bg-white px-3 tracking-wide">OR</span></div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <GoogleIcon />
            </button>
            <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Apple className="w-[18px] h-[18px] text-black fill-black" />
            </button>
            <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2] border-none" strokeWidth={0} />
            </button>
            <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Linkedin className="w-[18px] h-[18px] text-[#0A66C2] fill-[#0A66C2] stroke-[#0A66C2]" strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-center mt-7 text-[12px] text-black font-semibold">
            Don't have an account? <button onClick={() => onNavigate('signup')} className="text-[#0046D5] hover:underline font-bold">Create account</button>
          </p>
        </div>
      </div>
    </div>
  );
};
