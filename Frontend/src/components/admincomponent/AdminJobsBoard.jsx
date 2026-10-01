import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_ENDPOINT } from '@/utils/data';
import { setAllAdminJobs } from '@/redux/jobSlice';

const AdminJobsBoard = ({ pendingView = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allAdminJobs = [] } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth || {});
  const [expandedJobId, setExpandedJobId] = useState(null);

  const pending = allAdminJobs.filter(j => !j.approved && !j.rejectionReason);
  const approved = allAdminJobs.filter(j => j.approved === true);
  const rejected = allAdminJobs.filter(j => j.rejectionReason);

  const refresh = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, { withCredentials: true, headers });
      if (res.data && res.data.status) {
        dispatch(setAllAdminJobs(res.data.jobs));
      }
    } catch (err) {
      console.error('Failed to refresh jobs', err);
    }
  };

  const handleApprove = async (jobId) => {
    if (!confirm('Approve this job posting?')) return;
    try {
      await axios.post(`/api/admin/jobs/${jobId}/approve`, {}, { withCredentials: true });
      await refresh();
      // notify other components (dashboard, lists) to refresh
      window.dispatchEvent(new Event('jobStatusUpdated'));
    } catch (err) {
      console.error('Approve failed', err);
      alert('Failed to approve job');
    }
  };

  const handleReject = async (jobId) => {
    const reason = window.prompt('Enter rejection reason (optional)');
    try {
      await axios.post(`/api/admin/jobs/${jobId}/reject`, { reason }, { withCredentials: true });
      await refresh();
      // notify other components (dashboard, lists) to refresh
      window.dispatchEvent(new Event('jobStatusUpdated'));
    } catch (err) {
      console.error('Reject failed', err);
      alert('Failed to reject job');
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      await axios.delete(`${JOB_API_ENDPOINT}/delete/${jobId}`, { withCredentials: true, headers });
      await refresh();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete job');
    }
  };

  const JobCard = ({ job, showActions, isPending = false }) => {
    const isOwner = user && (String(job.created_by) === String(user._id) || (job.created_by && String(job.created_by._id || job.created_by) === String(user._id)));
    const isDatabaseInstructorPending = isPending && job.title && String(job.title).toLowerCase() === 'database instructor';
    return (
      <div className="p-3 border rounded bg-white shadow-sm mb-3">
        <div className="flex justify-between items-start">
          <div>
            {isDatabaseInstructorPending ? (
              <div className="font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/description/${job._id}`)}>{job.title}</div>
            ) : (
              <div className="font-semibold">{job.title}</div>
            )}

            {/* For pending postings: show only title and horizontal action buttons. View Details toggles expansion */}
            {isPending && (
              <div className="mt-3 flex items-center gap-3">
                {user?.role === 'Administrator' && (
                  <>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={() => handleApprove(job._id)}>Approve</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={() => handleReject(job._id)}>Reject</button>
                  </>
                )}
                {user?.role === 'Recruiter' && isOwner && (
                  <>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}>View Applicants</button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm" onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>Edit</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                  </>
                )}

                <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" onClick={() => setExpandedJobId(expandedJobId === job._id ? null : job._id)}>{expandedJobId === job._id ? 'Hide Details' : 'View Details'}</button>
              </div>
            )}

            {/* When expanded, show company, poster and date at the top, plus full details below */}
            {isPending && expandedJobId === job._id && (
              <div className="mt-3">
                <div className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</div>
                <div className="text-xs text-gray-400">Posted by: {job.created_by?.fullname || job.created_by?.email || '—'}</div>
              </div>
            )}
          </div>

          {/* show date only when expanded or not pending */}
          <div className="text-xs text-gray-400">
            {(!isPending || expandedJobId === job._id) && (job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : '—')}
          </div>
        </div>
        {job.rejectionReason && (
          <div className="mt-2 text-sm text-red-600">Reason: {job.rejectionReason}</div>
        )}
        {/* lower action area hidden for pending items because actions are in the horizontal bar */}
        {!isPending && (
          <div className="mt-3 flex gap-2">
            {user?.role === 'Administrator' && showActions && (
              <>
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => handleApprove(job._id)}>Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleReject(job._id)}>Reject</button>
              </>
            )}

            {user?.role === 'Recruiter' && isOwner && (
              <>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}>View Applicants</button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>Edit</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(job._id)}>Delete</button>
              </>
            )}
          </div>
        )}

        {/* Expanded full details block (visible when admin clicks View Details) */}
        {expandedJobId === job._id && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Full Details</h4>
            <p className="text-sm text-gray-800 mb-2">{job.description}</p>
            <p className="text-sm mb-1"><strong>Requirements:</strong> {Array.isArray(job.requirements) ? job.requirements.join(', ') : (job.requirements || 'N/A')}</p>
            <p className="text-sm mb-1"><strong>Salary:</strong> {job.salaryMin != null && job.salaryMax != null ? `${job.currency || 'ETB'} ${job.salaryMin} - ${job.salaryMax}` : job.salary != null ? `${job.currency || 'ETB'} ${job.salary}` : 'N/A'}</p>
            <p className="text-sm mb-1"><strong>Deadline:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleString() : 'N/A'}</p>
            <div className="mt-3">
              <h5 className="font-semibold">Company</h5>
              <div className="text-sm text-gray-700">{job.company?.name || 'N/A'}</div>
              <div className="text-sm text-gray-600">{job.company?.description || 'No company description available'}</div>
              {job.company?.website && <a className="text-blue-600" href={job.company.website} target="_blank" rel="noreferrer">Visit website</a>}
            </div>
            <div className="mt-3">
              <h5 className="font-semibold">Poster</h5>
              <div className="text-sm text-gray-700">{job.created_by?.fullname || 'N/A'}</div>
              <div className="text-sm text-gray-600">{job.created_by?.email || ''}</div>
              <div className="text-sm text-gray-600">{job.created_by?.phoneNumber || ''}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-3 ${user?.role === 'Administrator' ? 'text-blue-700 cursor-pointer hover:underline' : ''}`}
          onClick={() => {
            if (user?.role === 'Administrator') {
              // navigate to admin pending view
              navigate('/admin/jobs?pending=true');
            }
          }}
          title={user?.role === 'Administrator' ? 'View all pending job details' : ''}
        >
          Pending Postings ({pending.length})
        </h3>
        <div>
          {pending.length === 0 ? <div className="text-sm text-gray-500">No pending postings</div> : pending.map(j => <JobCard key={j._id} job={j} showActions isPending={pendingView} />)}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Approved Postings ({approved.length})</h3>
        <div>
          {approved.length === 0 ? <div className="text-sm text-gray-500">No approved postings</div> : approved.map(j => <JobCard key={j._id} job={j} showActions={false} />)}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Rejected Postings ({rejected.length})</h3>
        <div>
          {rejected.length === 0 ? <div className="text-sm text-gray-500">No rejected postings</div> : rejected.map(j => <JobCard key={j._id} job={j} showActions={false} />)}
        </div>
      </div>
    </div>
  );
};

export default AdminJobsBoard;