import React, { useEffect, useRef, useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/providers';
import type { Notification } from '../../types';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll every 30s while mounted
    const interval = setInterval(loadNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (n: Notification) => {
    if (n.read) return;
    try {
      await markNotificationRead(n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    } catch { /* ignore */ }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(x => ({ ...x, read: true })));
    } catch { /* ignore */ }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.4rem',
          position: 'relative',
          fontSize: '1.35rem',
          lineHeight: 1,
          color: 'var(--text)',
        }}
        aria-label="Notifications"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'var(--error)',
              color: '#fff',
              borderRadius: '50%',
              fontSize: '0.65rem',
              minWidth: '1.1rem',
              height: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 340,
            maxHeight: 420,
            overflowY: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            boxShadow: 'var(--shadow)',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--border)',
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
            }}
          >
            <strong style={{ fontSize: '0.95rem' }}>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </strong>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 500 }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          {loading && notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No notifications yet
            </div>
          ) : (
            notifications.slice().reverse().map(n => (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n)}
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: n.read ? 'default' : 'pointer',
                  background: n.read ? 'transparent' : 'var(--primary-light, rgba(0,102,255,0.05))',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>
                  {n.type?.includes('BOOKING') ? '📋' : n.type?.includes('PAYMENT') ? '💳' : '🔔'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.4, wordBreak: 'break-word' }}>{n.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {formatTime(n.createdAt)}
                  </div>
                </div>
                {!n.read && (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
