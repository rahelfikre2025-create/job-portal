import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/user/forgot-password', { email }, { withCredentials: true });
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Password reset code sent.');
        // navigate to code-based reset with email prefilled
        navigate(`/reset-with-code?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(res.data?.message || 'Unable to process request');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-4">Enter your account email and we'll send a password reset link.</p>

      <form onSubmit={submitHandler}>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          aria-label="email"
          placeholder="you@example.com"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
        />

        {/* Inline validation message */}
        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
          <p className="text-sm text-red-600 mt-2">Please enter a valid email address.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
