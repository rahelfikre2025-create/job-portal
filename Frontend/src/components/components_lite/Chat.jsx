import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CHAT_API_ENDPOINT } from "@/utils/data";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Chat = () => {
  const { id } = useParams(); // conversation id
  const [conversation, setConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();
  const { user } = useSelector((store) => store.auth);

  const fetchConversation = async () => {
    try {
      const res = await axios.get(`${CHAT_API_ENDPOINT}/${id}`, { withCredentials: true });
      if (res.data.success) {
        // attach application info if provided so schedule button can call the interviews API
        const convo = res.data.conversation;
        if (res.data.applicationInfo) convo.applicationInfo = res.data.applicationInfo;
        setConversation(convo);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load conversation");
    }
  };

  useEffect(() => {
    if (id) fetchConversation();
  }, [id]);

  useEffect(() => {
    // scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const sendText = async () => {
    if (!message.trim()) return;
    setSending(true);
    // optimistic UI: append a temp message immediately
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      text: message,
      sender: user,
      type: 'text',
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setConversation((prev) => ({
      ...prev,
      messages: prev?.messages ? [...prev.messages, tempMsg] : [tempMsg],
    }));
    const optimisticText = message;
    setMessage("");
    try {
      const res = await axios.post(`${CHAT_API_ENDPOINT}/${id}/message`, { text: optimisticText, type: 'text' }, { withCredentials: true });
      if (res.data.success) {
        // Replace only the temp message with the authoritative server message to avoid heavy re-renders
        const serverMsg = res.data.message;
        setConversation((prev) => {
          if (!prev) return { ...prev, messages: [serverMsg] };
          const found = prev.messages.some((m) => m._id === tempId);
          if (found) {
            return {
              ...prev,
              messages: prev.messages.map((m) => (m._id === tempId ? { ...serverMsg, status: 'sent' } : m)),
            };
          }
          // fallback: append server message
          return { ...prev, messages: [...prev.messages, { ...serverMsg, status: 'sent' }] };
        });
      } else {
        // mark temp message as failed
        setConversation((prev) => ({
          ...prev,
          messages: prev.messages.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m)),
        }));
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error(error);
      // mark temp message as failed
      setConversation((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m)),
      }));
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // helper: try to parse user input and return an ISO string or null
  const parseDateInputToISO = (input) => {
    if (!input) return null;
    // Try direct parse
    let d = new Date(input);
    if (!isNaN(d)) return d.toISOString();
    // try replace space with 'T'
    const t = input.replace(' ', 'T');
    d = new Date(t);
    if (!isNaN(d)) return d.toISOString();
    // try add seconds if pattern has only minutes
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t)) {
      d = new Date(t + ':00');
      if (!isNaN(d)) return d.toISOString();
    }
    return null;
  };

  const sendInterview = async (isoDate, type = 'interview') => {
    if (!isoDate) return;
    // ensure we have a valid ISO string
    const parsedISO = parseDateInputToISO(isoDate) || (typeof isoDate === 'string' ? isoDate : null);
    if (!parsedISO) {
      toast.error('Invalid date. Please use format like 2025-12-10T14:30 or use the scheduler.');
      return;
    }

    setSending(true);
    // optimistic schedule message
    const tempId = `temp-${Date.now()}`;
    const text = `${type === 'written_exam' ? 'Written exam' : 'Interview'} scheduled: ${new Date(parsedISO).toLocaleString()}`;
    const tempMsg = {
      _id: tempId,
      text,
      sender: user,
      type: type === 'written_exam' ? 'written_exam' : 'interview',
      meta: { scheduledAt: parsedISO, type },
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setConversation((prev) => ({ ...prev, messages: prev?.messages ? [...prev.messages, tempMsg] : [tempMsg] }));
    try {
      const res = await axios.post(`${CHAT_API_ENDPOINT}/${id}/message`, { text, type: type === 'written_exam' ? 'written_exam' : 'interview', meta: { scheduledAt: parsedISO, type } }, { withCredentials: true });
      if (res.data.success) {
        const serverMsg = res.data.message;
        setConversation((prev) => {
          if (!prev) return { ...prev, messages: [serverMsg] };
          const found = prev.messages.some((m) => m._id === tempId);
          if (found) {
            return {
              ...prev,
              messages: prev.messages.map((m) => (m._id === tempId ? { ...serverMsg, status: 'sent' } : m)),
            };
          }
          return { ...prev, messages: [...prev.messages, { ...serverMsg, status: 'sent' }] };
        });
        toast.success(`${type === 'written_exam' ? 'Written exam' : 'Interview'} schedule sent`);

        // If this conversation is attached to an application, try to schedule the actual interview/exam in the backend
        const applicationId = (conversation && conversation.applicationInfo && conversation.applicationInfo.applicationId) || null;
        if (applicationId) {
          try {
            const interviewTitle = type === 'written_exam' ? 'Written Exam' : 'Interview';
            const duration = type === 'written_exam' ? 60 : 30; // sensible defaults
            await axios.post('/api/interviews/schedule', { applicationId, interviewTitle, startTime: parsedISO, duration, type }, { withCredentials: true });
          } catch (scheduleErr) {
            console.error('Failed to schedule on backend', scheduleErr);
            // notify user but do not revert chat message
            toast.error('Failed to persist schedule to application (backend)');
          }
        }

      } else {
        setConversation((prev) => ({
          ...prev,
          messages: prev.messages.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m)),
        }));
        toast.error(`Failed to send ${type === 'written_exam' ? 'written exam' : 'interview'} schedule`);
      }
    } catch (error) {
      console.error(error);
      setConversation((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m._id === tempId ? { ...m, status: 'failed' } : m)),
      }));
      toast.error(`Failed to send ${type === 'written_exam' ? 'written exam' : 'interview'} schedule`);
    } finally {
      setSending(false);
    }
  };

  const onSendInterviewClick = () => {
    const typeInput = window.prompt('Enter type (press Enter for interview) - allowed values: interview, written_exam');
    const type = (typeInput && typeInput.trim().toLowerCase() === 'written_exam') ? 'written_exam' : 'interview';
    const iso = window.prompt(`Enter ${type === 'written_exam' ? 'written exam' : 'interview'} date/time (e.g. 2025-12-10T14:30 or 2025-12-10 14:30)`);
    if (iso) sendInterview(iso, type);
  };

  if (!conversation) return <div className="max-w-7xl mx-auto my-10">Loading chat...</div>;

  return (
    <div className="max-w-3xl mx-auto my-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">Chat</h2>
          <div className="text-sm text-gray-500">{conversation.participants?.length || 2} participants</div>
        </div>
        <div className="p-4 bg-gray-50">
          <div ref={scrollRef} className="h-96 overflow-y-auto p-3 space-y-3 rounded border border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((m, idx) => {
            // function to convert text with URLs into clickable links
            const linkify = (text) => {
              if (!text) return null;
              const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
              const parts = [];
              let lastIndex = 0;
              let match;
              while ((match = urlRegex.exec(text)) !== null) {
                const url = match[0];
                const index = match.index;
                if (index > lastIndex) {
                  parts.push(text.substring(lastIndex, index));
                }
                const href = url.startsWith("www.") ? `https://${url}` : url;
                parts.push(
                  <a key={`${idx}-link-${index}`} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {url}
                  </a>
                );
                lastIndex = index + url.length;
              }
              if (lastIndex < text.length) parts.push(text.substring(lastIndex));
              // map to React nodes (strings and anchors already fine)
              return parts.map((p, i) => (typeof p === "string" ? <span key={`${idx}-text-${i}`}>{p}</span> : p));
            };

            const isMe = m.sender?._id === user?._id || m.sender?._id === user?._id?.toString?.();
            const initials = (m.sender?.fullname || 'U').split(' ').map(s => s[0]).slice(0,2).join('');
            // choose bubble styles: silver (gray) for sender, green for receiver
            const bubbleClass = isMe
              ? (m.status === 'sending' ? 'bg-gray-200 text-gray-800' : 'bg-gray-300 text-gray-900')
              : 'bg-green-100 border border-green-200 text-green-900';
            return (
              <div key={m._id || idx} className={`flex items-start gap-4 ${isMe ? 'justify-start' : 'justify-end'}`}>
                {isMe && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-gray-900 font-semibold">{initials}</div>
                  </div>
                )}

                <div className={`max-w-[78%] break-words ${isMe ? 'text-left' : 'text-right'}`}>
                  <div className={`${isMe ? 'inline-block' : 'inline-block'} ${bubbleClass} px-4 py-2 rounded-2xl shadow-sm relative`}> 
                    {/* speech-tail */}
                    {(() => {
                      const tailColor = isMe ? (m.status === 'sending' ? '#E5E7EB' : '#D1D5DB') : '#D1FAE5';
                      return (
                        <span
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent',
                            borderRight: isMe ? `8px solid ${tailColor}` : undefined,
                            borderLeft: !isMe ? `8px solid ${tailColor}` : undefined,
                            position: 'absolute',
                            left: isMe ? -8 : undefined,
                            right: !isMe ? -8 : undefined,
                            top: 16,
                          }}
                        />
                      );
                    })()}
                    <div className="text-sm font-medium mb-1">{m.sender?.fullname || 'Unknown'}</div>
                    <div className="text-sm">{linkify(m.text)}</div>
                    {m.meta?.scheduledAt && (
                      <div className={`${isMe ? 'mt-2 text-xs text-gray-600' : 'mt-2 text-xs text-green-700'}`}>Scheduled: {new Date(m.meta.scheduledAt).toLocaleString()}</div>
                    )}
                  </div>

                  {/* status line under the bubble */}
                  <div className={`mt-1 text-xs ${isMe ? 'text-gray-600' : 'text-green-700'} ${isMe ? 'text-left' : 'text-right'}`}>
                    {isMe && m.status === 'sending' && (
                      <span className="inline-flex items-center gap-2 text-gray-600">
                        <span className="inline-block w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    )}
                    {isMe && m.status === 'sent' && (
                      <span className="text-gray-600">✓ Sent</span>
                    )}
                    {isMe && m.status === 'failed' && (
                      <span className="text-yellow-600">⚠ Failed</span>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt || Date.now()).toLocaleString()}</div>
                </div>

                {!isMe && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">{initials}</div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div>No messages yet</div>
        )}
          </div>

          <div className="px-4 py-3 border-t bg-white flex items-center gap-2">
            <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Type a message" />
            <button onClick={sendText} disabled={sending} className="px-4 py-2 bg-blue-600 text-white rounded-full">Send</button>
            <button onClick={onSendInterviewClick} disabled={sending} className="px-3 py-2 bg-green-600 text-white rounded-full">Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
