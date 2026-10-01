import React, { useEffect, useState } from "react";
import axios from "axios";
import { CHAT_API_ENDPOINT } from "@/utils/data";
import { useNavigate } from "react-router-dom";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${CHAT_API_ENDPOINT}/conversations`, { withCredentials: true });
      if (res.data.success) {
        setConversations(res.data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto my-10">Loading conversations...</div>;

  return (
    <div className="max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-4">Conversations</h2>
      {conversations.length === 0 ? (
        <div className="text-gray-600">You have no conversations yet.</div>
      ) : (
        <ul className="space-y-3">
          {conversations.map((c) => {
            const otherParticipants = (c.participants || []).filter(p => p && p._id).map(p => p.fullname).join(', ');
            const lastMsg = c.lastMessage || (c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text : '') || '';
            return (
              <li key={c._id} className="p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/chat/${c._id}`)}>
                <div className="flex justify-between">
                  <div className="font-medium">{otherParticipants || 'Conversation'}</div>
                  <div className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{lastMsg}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Conversations;
