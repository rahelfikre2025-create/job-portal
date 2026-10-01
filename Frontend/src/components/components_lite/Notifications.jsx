import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/redux/notificationSlice';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.notifications || { list: [], status: 'idle' });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div className="p-4 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={() => dispatch(markAllNotificationsRead())} className="text-sm text-blue-600">Mark all read</button>
      </div>
      <ul>
        {list.length === 0 && <li className="text-sm text-gray-500">No notifications</li>}
        {list.map((n) => (
          <li key={n._id} className={`p-2 rounded-md mb-2 ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
            <div className="text-sm">{n.message}</div>
            <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            <div className="mt-1 flex gap-2">
              {!n.read && <button onClick={() => dispatch(markNotificationRead(n._id))} className="text-xs text-blue-600">Mark read</button>}
              {n.data?.conversationId && (
                <button
                  onClick={() => {
                    // mark read then navigate to chat
                    dispatch(markNotificationRead(n._id));
                    navigate(`/chat/${n.data.conversationId}`);
                  }}
                  className="text-xs text-green-600"
                >
                  Open Chat
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
