import React, { useState } from 'react';
import axios from 'axios';

const AdminRegisterModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ fullname: '', email: '', phoneNumber: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const res = await axios.post('/api/admin/register-admin', form, { withCredentials: true });
      if (res.data && res.data.success) {
        if (onSuccess) onSuccess(res.data.admin);
        onClose();
      } else {
        setError(res.data?.message || 'Failed to create administrator');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b"><h3 className="text-lg font-semibold">Register Administrator</h3></div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-3"><label className="block text-sm">Full name</label><input name="fullname" value={form.fullname} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required /></div>
          <div className="mb-3"><label className="block text-sm">Email</label><input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required /></div>
          <div className="mb-3"><label className="block text-sm">Phone</label><input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required /></div>
          <div className="mb-3"><label className="block text-sm">Password</label><input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required /></div>
          {error && <div className="mb-3 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">{saving ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterModal;