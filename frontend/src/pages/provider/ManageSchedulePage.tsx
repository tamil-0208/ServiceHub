import React, { useEffect, useState, useCallback } from 'react';
import {
  getMyProviderProfile,
  getProviderSchedule,
  createScheduleSlot,
  updateScheduleSlot,
  deleteScheduleSlot,
} from '../../api/providers';
import type { Schedule, WeekDay } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

const DAYS: WeekDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<WeekDay, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
};

interface DayState {
  schedule: Schedule | null;
  startTime: string;
  endTime: string;
  available: boolean;
  saving: boolean;
  error: string;
}

export const ManageSchedulePage: React.FC = () => {
  const [providerId, setProviderId] = useState<string | null>(null);
  const [dayStates, setDayStates] = useState<Record<WeekDay, DayState>>(() => {
    const init: Partial<Record<WeekDay, DayState>> = {};
    DAYS.forEach(d => {
      init[d] = { schedule: null, startTime: '09:00:00', endTime: '18:00:00', available: false, saving: false, error: '' };
    });
    return init as Record<WeekDay, DayState>;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchedule = useCallback(async (pid: string) => {
    const res = await getProviderSchedule(pid);
    const schedules = res.data;
    setDayStates(prev => {
      const updated = { ...prev };
      DAYS.forEach(d => {
        const found = schedules.find(s => s.dayOfWeek === d) ?? null;
        updated[d] = {
          schedule: found,
          startTime: found?.startTime ?? '09:00:00',
          endTime: found?.endTime ?? '18:00:00',
          available: found?.available ?? false,
          saving: false,
          error: '',
        };
      });
      return updated;
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const pRes = await getMyProviderProfile();
        const pid = pRes.data.id;
        setProviderId(pid);
        await loadSchedule(pid);
      } catch (err: any) {
        setError(err.response?.data?.message ?? 'Failed to load schedule.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [loadSchedule]);

  const setDayField = (day: WeekDay, field: keyof DayState, value: any) => {
    setDayStates(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = async (day: WeekDay) => {
    const ds = dayStates[day];
    setDayField(day, 'saving', true);
    setDayField(day, 'error', '');
    try {
      const payload = {
        dayOfWeek: day,
        startTime: ds.startTime.length === 5 ? `${ds.startTime}:00` : ds.startTime,
        endTime: ds.endTime.length === 5 ? `${ds.endTime}:00` : ds.endTime,
        available: ds.available,
      };
      if (ds.schedule) {
        const res = await updateScheduleSlot(ds.schedule.id, payload);
        setDayStates(prev => ({ ...prev, [day]: { ...prev[day], schedule: res.data, saving: false } }));
      } else {
        const res = await createScheduleSlot(payload);
        setDayStates(prev => ({ ...prev, [day]: { ...prev[day], schedule: res.data, saving: false } }));
      }
    } catch (err: any) {
      setDayField(day, 'error', err.response?.data?.message ?? 'Failed to save.');
      setDayField(day, 'saving', false);
    }
  };

  const handleDelete = async (day: WeekDay) => {
    const ds = dayStates[day];
    if (!ds.schedule) return;
    if (!window.confirm(`Remove ${DAY_LABELS[day]} schedule?`)) return;
    setDayField(day, 'saving', true);
    try {
      await deleteScheduleSlot(ds.schedule.id);
      setDayStates(prev => ({
        ...prev,
        [day]: { schedule: null, startTime: '09:00:00', endTime: '18:00:00', available: false, saving: false, error: '' },
      }));
      if (providerId) await loadSchedule(providerId);
    } catch (err: any) {
      setDayField(day, 'error', err.response?.data?.message ?? 'Failed to delete.');
      setDayField(day, 'saving', false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="page-container" style={{ maxWidth: 780, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Weekly Schedule</h1>
          <p className="page-subtitle">Set your availability for each day. One time slot per day.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {DAYS.map(day => {
          const ds = dayStates[day];
          const hasSlot = !!ds.schedule;
          return (
            <div
              key={day}
              className="card"
              style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${ds.available ? 'var(--success)' : 'var(--border)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Day label */}
                <div style={{ minWidth: 110, fontWeight: 600 }}>{DAY_LABELS[day]}</div>

                {/* Available toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={ds.available}
                    onChange={e => setDayField(day, 'available', e.target.checked)}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Available</span>
                </label>

                {/* Time inputs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <input
                    type="time"
                    value={ds.startTime.substring(0, 5)}
                    onChange={e => setDayField(day, 'startTime', e.target.value + ':00')}
                    className="form-input"
                    style={{ width: 120, padding: '0.35rem 0.6rem' }}
                    disabled={!ds.available}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>to</span>
                  <input
                    type="time"
                    value={ds.endTime.substring(0, 5)}
                    onChange={e => setDayField(day, 'endTime', e.target.value + ':00')}
                    className="form-input"
                    style={{ width: 120, padding: '0.35rem 0.6rem' }}
                    disabled={!ds.available}
                  />
                </div>

                {/* Status badge */}
                {hasSlot && (
                  <span className={`badge ${ds.available ? 'badge-success' : 'badge-secondary'}`}>
                    {ds.available ? 'Set' : 'Off'}
                  </span>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSave(day)}
                    disabled={ds.saving}
                  >
                    {ds.saving ? '…' : hasSlot ? 'Update' : 'Save'}
                  </button>
                  {hasSlot && (
                    <button
                      className="btn btn-sm"
                      style={{ background: 'var(--error)', color: '#fff' }}
                      onClick={() => handleDelete(day)}
                      disabled={ds.saving}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              {ds.error && (
                <div className="banner banner-error" style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
                  {ds.error}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
