import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetWithCode = () => {
  const [searchParams] = useSearchParams();
  const prefilled = searchParams.get('email') || '';
  const [email, setEmail] = useState(prefilled);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (prefilled) setEmail(prefilled);
  }, [prefilled]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !code || !password) return toast.error('All fields are required');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await axios.post('/api/user/reset-password-with-code', { email, code, password }, { withCredentials: true });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Password reset successfully');
        navigate('/login');
      } else {
        toast.error(res.data?.message || 'Unable to reset password');
      }
    } catch (err) {
      console.error('Reset with code error:', err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-4">Enter the code we sent to your email and set a new password.</p>
      <form onSubmit={submitHandler}>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Reset Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetWithCode;
