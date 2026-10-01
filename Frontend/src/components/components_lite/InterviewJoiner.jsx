import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_ENDPOINT } from '@/utils/data';

const InterviewJoiner = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${INTERVIEW_API_ENDPOINT}/applicant`, { withCredentials: true });
      if (res.data && res.data.success) {
        setInterviews(res.data.interviews || []);
      }
    } catch (err) {
      console.error('fetchInterviews error', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchInterviews(); }, []);

  if (loading) return <div>Loading interviews...</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Scheduled Interviews</h3>
      {interviews.length === 0 && <div className="text-sm text-gray-500">No scheduled interviews</div>}
      <ul className="space-y-3">
        {interviews.map(i => (
          <li key={i.applicationId} className="border p-3 rounded">
            <div className="font-medium">{i.interview.interviewTitle || i.job.title}</div>
            <div className="text-sm text-gray-600">{new Date(i.interview.startTime).toLocaleString()}</div>
            <div className="mt-2">
              <a href={i.interview.meetingLink} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-600 text-white rounded">Join Meeting</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewJoiner;
