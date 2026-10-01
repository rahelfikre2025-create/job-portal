import React, { useState } from 'react';
import axios from 'axios';
import { INTERVIEW_API_ENDPOINT, APPLICATION_API_ENDPOINT, CHAT_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';

const InterviewScheduler = ({ applicationId }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!applicationId) return toast.error('Application id missing');
    if (!title || !startTime || !duration) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const res = await axios.post(`${INTERVIEW_API_ENDPOINT}/schedule`, { applicationId, interviewTitle: title, startTime, duration }, { withCredentials: true });
      if (res.data && res.data.success) {
        // after scheduling, create/open a conversation and post a chat message so both parties see it in chat
        try {
          // request conversation for this application
          const convoRes = await axios.post(`${APPLICATION_API_ENDPOINT}/${applicationId}/open-chat`, {}, { withCredentials: true });
          const conversationId = convoRes?.data?.conversationId;
          if (conversationId) {
            const scheduledISO = new Date(startTime).toISOString();
            const messageText = `Interview scheduled: ${new Date(scheduledISO).toLocaleString()}`;
            await axios.post(`${CHAT_API_ENDPOINT}/${conversationId}/message`, { text: messageText, type: 'interview', meta: { scheduledAt: scheduledISO } }, { withCredentials: true });
          }
        } catch (chatErr) {
          console.error('Failed to notify via chat', chatErr);
        }

        toast.success('Interview scheduled');
      } else {
        toast.error(res.data.message || 'Failed to schedule');
      }
    } catch (err) {
      console.error('schedule error', err);
      toast.error(err.response?.data?.message || err.message || 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md">
      <h3 className="font-semibold mb-2">Schedule Interview</h3>
      <form onSubmit={handleSchedule} className="space-y-2">
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Start Time</label>
          <input type="datetime-local" value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e)=>setDuration(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Scheduling...':'Schedule Interview'}</button>
        </div>
      </form>
    </div>
  );
};

export default InterviewScheduler;
