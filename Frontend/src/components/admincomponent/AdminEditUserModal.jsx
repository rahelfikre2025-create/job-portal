import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ role: '', isBanned: false });

  useEffect(() => {
    if (user) {
      setForm({
        role: user.role || '',
        isBanned: !!user.isBanned,
        _id: user._id,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { role: form.role, isBanned: form.isBanned };
      const response = await axios.put(`/api/admin/users/${form._id}`, payload);

      if (response.data && response.data.success) {
        const savedUser = response.data.user || response.data;
        if (onSave) onSave(savedUser);
        if (onClose) onClose();
      } else {
        setError(response.data?.message || 'Failed to save user');
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
          <h3 className="text-lg font-semibold text-gray-800">Edit Role & Ban</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select role</option>
              <option value="Administrator" disabled>Administrator (use register admin)</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Note: Assigning Administrator role is disabled here. Use 'Register Administrator' from the dashboard instead.</p>
          </div>

          <div className="mb-6 flex items-center">
            <input
              id="isBanned"
              name="isBanned"
              type="checkbox"
              checked={form.isBanned}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="isBanned" className="ml-2 text-sm text-gray-700">Banned</label>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 p-2 rounded">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditUserModal;
