import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEditProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ fullname: '', phoneNumber: '', companyName: '', skills: '' });
  useEffect(() => {
    if (user) setForm({ fullname: user.fullname || '', phoneNumber: user.phoneNumber || '', companyName: user?.profile?.company?.name || '', skills: user?.profile?.skills ? user.profile.skills.join(', ') : '' });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await axios.put(`/api/admin/users/${user._id}/profile`, form, { withCredentials: true });
      if (res.data && res.data.success) {
        if (onSave) onSave(res.data.user);
        if (onClose) onClose();
      } else {
        setError(res.data?.message || 'Failed to save profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  }; 

  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input name="fullname" value={form.fullname} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company name (optional)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="Comma-separated (e.g., Ruby, React)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProfileModal;