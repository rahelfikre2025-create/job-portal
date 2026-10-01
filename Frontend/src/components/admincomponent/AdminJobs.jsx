import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsBoard from "./AdminJobsBoard";
import useGetAllAdminJobs from "@/hooks/useGetAllJAdminobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  const { user } = useSelector((store) => store.auth || {});

  // read `pending` query param to support /admin/jobs?pending=true
  import.meta.env; // keep bundler happy about top-level imports
  const locationObj = useLocation();
  const searchParams = new URLSearchParams(locationObj.search || '');
  const pendingQuery = searchParams.get('pending') === 'true' || searchParams.get('pending') === '1';

  // Fetch admin jobs; respect pending query if present (shows pending-only view)
  useGetAllAdminJobs(pendingQuery);

  return (
    <div>
      <div className=" max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by Name & Jobs"
            onChange={(e) => setInput(e.target.value)}
          ></Input>
        </div>

        {user?.role !== 'Administrator' && (
          <div className="p-3 rounded bg-yellow-50 text-yellow-800 mb-4">
            Note: Jobs require approval by an Administrator before appearing to job seekers.
          </div>
        )}

        {pendingQuery && user?.role === 'Administrator' && (
          <div className="p-3 rounded bg-blue-50 text-blue-800 mb-4">
            Viewing <strong>Pending Postings</strong> — review each posting below and use Approve / Reject to authorize or deny.
          </div>
        )}

        {user?.role === 'Recruiter' && (
          <div className="mb-4">
            <button
              className={`px-4 py-2 rounded ${user?.isBanned ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
              onClick={() => { if (!user?.isBanned) navigate('/recruiter/jobs/create'); }}
              title={user?.isBanned ? 'Your account is banned. Posting disabled.' : ''}
              disabled={user?.isBanned}
            >
              {user?.isBanned ? 'Posting Disabled' : 'Post Job'}
            </button>
          </div>
        )}

        <div>
          <AdminJobsBoard pendingView={pendingQuery} />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;