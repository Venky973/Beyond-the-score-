import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    if (notif.link) {
      navigate(notif.link);
      if (onClose) onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'match':
        return <Trophy className="w-4 h-4 text-orange-400" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-sports-dark border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-sm text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-slate-400 hover:text-orange-400 flex items-center gap-1 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 hover:bg-slate-850 cursor-pointer transition flex gap-3 ${
                !notif.isRead ? 'bg-orange-950/20' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>{notif.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{notif.message}</p>
                {notif.link && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 mt-1.5 hover:underline">
                    View details <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
