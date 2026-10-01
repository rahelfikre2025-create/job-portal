import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AdminJobsTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const { allAdminJobs = [], searchJobByText = "" } = useSelector((store) => store.job || {});
  const { user } = useSelector((store) => store.auth || {});
  const navigate = useNavigate();

  const [filterJobs, setFilterJobs] = useState(allAdminJobs || []);

  useEffect(() => {
    const filteredJobs =
      Array.isArray(allAdminJobs) &&
      allAdminJobs.filter((job) => {
        if (!searchJobByText) return true;
        const titleMatch = job?.title?.toString().toLowerCase().includes(searchJobByText.toLowerCase());
        const companyMatch = job?.company?.name?.toString().toLowerCase().includes(searchJobByText.toLowerCase());
        return titleMatch || companyMatch;
      });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toISOString().split('T')[0];
    } catch (err) {
      return 'N/A';
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await axios.post(`/api/admin/jobs/${jobId}/approve`, {}, { withCredentials: true });
      // notify listeners to re-fetch jobs and update the dashboard
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
      // notify listeners to re-fetch jobs and update the dashboard
      window.dispatchEvent(new Event('jobStatusUpdated'));
    } catch (err) {
      console.error('Reject failed', err);
      alert('Failed to reject job');
    }
  };

  // Avoid noisy logs during renders
  if (companies === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table>
        <TableCaption>Your recent Posted Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Posted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(!Array.isArray(filterJobs) || filterJobs.length === 0) ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No Job Added</TableCell>
            </TableRow>
          ) : (
            filterJobs.map((job) => (
              <TableRow key={job._id || job.id}>
                <TableCell>{job?.company?.name || 'Unknown'}</TableCell>
                <TableCell>{job?.title || 'Untitled'}</TableCell>
                <TableCell>{job?.created_by ? (job.created_by.fullname || job.created_by.email || 'Unknown') : '—'}</TableCell>
                <TableCell>{formatDate(job?.createdAt)}</TableCell>
                <TableCell>{job?.approved ? (job.rejectionReason ? 'Rejected' : 'Approved') : 'Pending'}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      {/* Admins may only approve/reject; edit/applicant management is available to Recruiters under /recruiter namespace */}
                      { !job.approved && user?.role === 'Administrator' && (
                        <div onClick={() => handleApprove(job._id)} className="flex items-center gap-2 w-fit cursor-pointer mt-1 text-green-600">
                          <span>Approve</span>
                        </div>
                      )}
                      { !job.approved && user?.role === 'Administrator' && (
                        <div onClick={() => handleReject(job._id)} className="flex items-center gap-2 w-fit cursor-pointer mt-1 text-red-600">
                          <span>Reject</span>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;