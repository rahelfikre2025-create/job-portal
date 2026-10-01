import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
// Navbar is provided by RootLayout
// Assuming you have a reusable modal component for editing (create this if needed)
import AdminEditUserModal from './AdminEditUserModal';
import AdminEditProfileModal from './AdminEditProfileModal'; 
// Assuming you have a loading component
// import Loader from './Loader'; 

const UserManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const ADMIN_ROLE = "Administrator";

    // --- 1. Security Check (Redundant, but safe) ---
    useEffect(() => {
        if (!user || user.role !== ADMIN_ROLE) {
            navigate('/');
        }
    }, [user, navigate]);

    // --- 2. Data Fetching (View All Users) ---
    const [searchParams] = useSearchParams();
    const roleFilter = searchParams.get('role');
    const displayRole = roleFilter ? (roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)) : null;
    const summary = searchParams.get('summary') === 'true' || searchParams.get('summary') === '1';

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Secure API call using the protected route
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            const url = roleFilter ? `/api/admin/users?role=${encodeURIComponent(roleFilter)}` : '/api/admin/users';
            const response = await axios.get(url, { withCredentials: true, headers });
            // Filter out the current Admin user from the list for safety/clarity
            const nonAdminUsers = response.data.users.filter(u => u._id !== user._id);
            setUsers(nonAdminUsers);
            setStatusMessage('');
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Check server connection or permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === ADMIN_ROLE) {
            fetchUsers();
        }
    }, [user, roleFilter]);

    // --- 3. CRUD Handlers ---

    // Handler for opening the Role Edit Modal
    const handleEditRole = (userToEdit) => {
        setCurrentUser(userToEdit);
        setIsModalOpen(true);
    };

    // Handler for opening the Profile Edit Modal
    const handleEditProfile = (userToEdit) => {
        setCurrentUser(userToEdit);
        setIsProfileModalOpen(true);
    };

    // Handler for saving updates from the Role Modal
    // The modal performs the API call and returns the saved user object here.
    const handleSave = (savedUser) => {
        // Update the state with the returned (saved) user
        setUsers(users.map(u => u._id === savedUser._id ? savedUser : u));
        setStatusMessage(`✅ Role updated for ${savedUser.fullname}.`);
        setIsModalOpen(false);
    };

    // Handler for saving profile updates
    const dispatch = useDispatch();

    const handleProfileSave = (savedUser) => {
        setUsers(users.map(u => u._id === savedUser._id ? savedUser : u));
        setStatusMessage(`✅ Profile updated for ${savedUser.fullname}.`);
        // If the currently logged-in user updated their own profile, refresh auth store
        if (user && String(user._id) === String(savedUser._id)) {
            dispatch(setUser(savedUser));
        }
        setIsProfileModalOpen(false);
    };

    // Handler for deleting a user
    const handleDelete = async (userId, fullname) => {
        if (!window.confirm(`Are you sure you want to permanently delete user: ${fullname}?`)) {
            return;
        }

        try {
            const response = await axios.delete(`/api/admin/user/${userId}`);
            
            if (response.data.success) {
                // Remove the user from the list
                setUsers(users.filter(u => u._id !== userId));
                setStatusMessage(`✅ User ${fullname} deleted successfully.`);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            setStatusMessage(`❌ Error deleting user: ${err.response?.data?.message || 'Server error'}`);
        }
    };


    // --- 4. Render Logic ---

    // if (loading) {
    //     return <Loader />; 
    // }

    if (error) {
        return (
            <>
                <div className="container mx-auto p-4 text-red-600 font-semibold">{error}</div>
            </>
        );
    }
    
    // Fallback for when the list is empty
    if (!loading && users.length === 0) {
         return (
            <>
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-6">User Management</h1>
                    <p className="text-gray-500">No non-administrator users found in the system.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">{summary ? `Total Users (${users.length})` : (displayRole ? `User Management - ${displayRole} (${users.length})` : `User Management (${users.length} Total)`)}</h1>
                
                {statusMessage && (
                    <div className={`p-3 mb-4 rounded-md text-sm font-medium ${statusMessage.startsWith('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {statusMessage}
                    </div>
                )}

                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                {displayRole !== 'Recruiter' && (
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {displayRole === 'Recruiter' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                )}
                                {!summary && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    {displayRole !== 'Recruiter' && (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Recruiter' ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800'}`}>
                                            {user.role}
                                        </span>
                                      </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         {/* Assuming you have an isBanned field in your User model */}
                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.isBanned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>

                                    {displayRole === 'Recruiter' && (
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.profile?.company?.name || 'N/A'}</td>
                                    )}

                                    {!summary && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                                        <button 
                                            onClick={() => handleEditRole(user)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                                        >
                                            Edit Role
                                        </button>

                                        <button
                                            onClick={async () => {
                                                // Toggle ban state
                                                try {
                                                    const res = await axios.put(`/api/admin/users/${user._id}`, { isBanned: !user.isBanned });
                                                    if (res.data && res.data.success) {
                                                        setUsers(users.map(u => u._id === user._id ? res.data.user : u));
                                                        setStatusMessage(`✅ ${user.isBanned ? 'Unbanned' : 'Banned'} ${user.fullname}`);
                                                    }
                                                } catch (err) {
                                                    console.error('Ban toggle error', err);
                                                    setStatusMessage(`❌ Failed to update ban status for ${user.fullname}`);
                                                }
                                            }}
                                            className={`text-white px-2 py-1 rounded ${user.isBanned ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        >
                                            {user.isBanned ? 'Unban' : 'Ban'}
                                        </button>
                                    </td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Role Edit Modal */}
            {isModalOpen && currentUser && (
                <AdminEditUserModal 
                    user={currentUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Admin Edit Profile Modal */}
            {isProfileModalOpen && currentUser && (
                <AdminEditProfileModal 
                    user={currentUser}
                    onClose={() => setIsProfileModalOpen(false)}
                    onSave={handleProfileSave}
                />
            )}
        </>
    );
};

export default UserManagementPage;