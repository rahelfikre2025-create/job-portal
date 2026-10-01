import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await axios.post(`/api/user/reset-password/${token}`, { password }, { withCredentials: true });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Password reset successfully');
        navigate('/login');
      } else {
        toast.error(res.data?.message || 'Unable to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={submitHandler}>
        <label className="block text-sm font-medium text-gray-700">New Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2" />

        <label className="block text-sm font-medium text-gray-700 mt-4">Confirm Password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2" />

        <div className="mt-6 flex justify-end">
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">{loading ? 'Saving...' : 'Reset Password'}</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
