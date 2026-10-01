import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Assuming you have a reusable layout/navbar component
// Navbar provided by RootLayout
// Assuming you have an Axios instance for API calls
import axios from 'axios'; 

// --- Component Imports (You need to create these files) ---
import DashboardCard from './DashboardCard'; // A simple card component for metrics
import AdminRegisterModal from './AdminRegisterModal';
import AdminEditProfileModal from './AdminEditProfileModal';
// import Loader from './Loader'; // If you have a loading spinner component


const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth);
    
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        totalRecruiters: 0, 
        pendingJobs: 0,
        approvedJobs: 0,
        rejectedJobs: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);

    // --- 1. Security Check (Redundant, but good practice in the component itself) ---
    useEffect(() => {
        // Redirect if the user is not an Administrator
        if (!user || user.role !== 'Administrator') {
            navigate('/');
        }
    }, [user, navigate]);

    // --- 2. Data Fetching (Get site statistics) ---
    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            // Note: backend requires authentication via cookie; send credentials
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            const response = await axios.get('/api/admin/dashboard/stats', { withCredentials: true, headers });
            // response.data should contain { totalUsers, totalRecruiters, pendingJobs }
            const data = response.data || {};
            setStats({
                totalUsers: data.totalUsers ?? 0,
                totalRecruiters: data.totalRecruiters ?? 0,
                pendingJobs: data.pendingJobs ?? 0,
                approvedJobs: data.approvedJobs ?? 0,
                rejectedJobs: data.rejectedJobs ?? 0,
            });
        } catch (error) {
            // Log HTTP status and response body when available for easier debugging
            console.error("Error fetching dashboard stats:", error?.response?.status, error?.response?.data || error.message || error);
            // Fallback stats or show an error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      if (user && user.role === 'Administrator') {
        fetchDashboardStats();
        // Poll every 10 seconds for real-time-ish updates
        const id = setInterval(fetchDashboardStats, 10000);
        return () => clearInterval(id);
      }
    }, [user]);

    // Refresh immediately when a job status is changed elsewhere in the app
    useEffect(() => {
      const handler = () => fetchDashboardStats();
      window.addEventListener('jobStatusUpdated', handler);
      return () => window.removeEventListener('jobStatusUpdated', handler);
    }, []);

    const handleRegisterAdminSuccess = (admin) => {
      // Notify and refresh
      setStatusMessage(`✅ Administrator ${admin.fullname} created`);
      setRegisterOpen(false);
      // optionally refresh stats
      fetchDashboardStats();
    };

    useEffect(() => {
        // Only fetch data if the user is an Administrator
        if (user && user.role === 'Administrator') {
            fetchDashboardStats();
        }
    }, [user]);

    
    // if (loading) {
    //     return <Loader />; // Display loading spinner while fetching data
    // }

    // --- 3. Render Dashboard UI ---
    return (
        <>
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Administrator Control Panel
                </h1>

                <p className="text-lg mb-8 text-gray-600">
                    Welcome, {user?.fullname || 'Administrator'}. Manage site content, users, and reports.
                </p>

                {/* --- A. Metrics Overview Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <DashboardCard 
                        title="Total Users" 
                        value={loading ? "..." : stats.totalUsers} 
                        icon="👤" 
                        color="bg-indigo-100 text-indigo-800"
                        onClick={() => navigate('/super-admin/users?summary=true')}
                    />
                    <DashboardCard 
                        title="Total Recruiters" 
                        value={loading ? "..." : stats.totalRecruiters} 
                        icon="🏢" 
                        color="bg-green-100 text-green-800"
                        onClick={() => navigate('/super-admin/users?role=Recruiter')}
                    />
                    <DashboardCard 
                        title="Jobs Pending Approval" 
                        value={loading ? "..." : stats.pendingJobs} 
                        subtitle={loading ? '' : `Pending: ${stats.pendingJobs}`}
                        icon="⏳" 
                        color="bg-yellow-100 text-yellow-800"
                        onClick={() => navigate('/admin/jobs?pending=true')}
                    />
                </div>

                {/* --- B. Quick Action Links Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* 1. User Management */}
                    <Link to="/super-admin/users" className="block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-t-4 border-indigo-500">
                        <h2 className="text-xl font-semibold mb-2">User Management</h2>
                        <p className="text-gray-600">View, change roles, or ban user accounts.</p>
                    </Link>

                    {/* 2. Reporting and Analytics */}
                    <Link to="/super-admin/reports" className="block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-t-4 border-red-500">
                        <h2 className="text-xl font-semibold mb-2">Generate Reports</h2>
                        <p className="text-gray-600">Extract data reports (e.g., skill summaries, activity logs).</p>
                    </Link>

                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setRegisterOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded">Register Administrator</button>
                  <button onClick={() => setProfileOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded" title="Edit my profile">Edit My Profile</button>
                </div>

                {isRegisterOpen && <AdminRegisterModal onClose={() => setRegisterOpen(false)} onSuccess={handleRegisterAdminSuccess} />}
                {/* Admin edit profile modal for the current admin */}
                {isProfileOpen && <AdminEditProfileModal user={user} onClose={() => setProfileOpen(false)} onSave={() => window.location.reload()} />}
            </div>
        </>
    );
};

export default AdminDashboard;