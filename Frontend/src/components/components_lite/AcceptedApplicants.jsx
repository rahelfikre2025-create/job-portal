import React, { useEffect, useState } from "react";
import axios from "axios";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const AcceptedApplicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/recruiter/accepted`, { withCredentials: true });
        setApplications(res.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch accepted applicants", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccepted();
  }, []);

  const openChat = async (application) => {
    try {
      // ensure conversation exists for this application
      const res = await axios.post(`${APPLICATION_API_ENDPOINT}/${application._id}/open-chat`, {}, { withCredentials: true });
      const conversationId = res.data.conversationId;
      if (conversationId) {
        navigate(`/chat/${conversationId}`);
      }
    } catch (error) {
      console.error("Failed to open conversation", error);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto my-10">Loading accepted applicants...</div>;

  return (
    <div className="max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-4">Accepted Applicants</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">You have no accepted applicants yet.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li key={app._id} className="p-4 border rounded flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{app.applicant?.fullname || 'N/A'}</h3>
                <p className="text-sm text-gray-500">{app.applicant?.email || ''}</p>
                <p className="text-sm text-gray-500">Job: {app.job?.title || 'N/A'}</p>
                <p className="text-xs text-gray-400">Applied: {new Date(app.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => openChat(app)} className="rounded-full">Open Chat</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedApplicants;
