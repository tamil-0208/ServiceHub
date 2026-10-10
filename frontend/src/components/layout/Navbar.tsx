import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notifications/NotificationBell';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProvider = user?.role === 'PROVIDER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span>⚡</span>
          <span>Hypermarketplace</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/providers"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Providers
            </NavLink>
          </li>

          {/* Customer-facing links */}
          {isAuthenticated && !isProvider && !isAdmin && (
            <li>
              <NavLink
                to="/bookings"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                My Bookings
              </NavLink>
            </li>
          )}

          {/* Provider-facing links */}
          {isAuthenticated && isProvider && (
            <>
              <li>
                <NavLink
                  to="/provider"
                  end
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/provider/bookings"
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Bookings
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/provider/services"
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/provider/schedule"
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  Schedule
                </NavLink>
              </li>
            </>
          )}

          {/* Admin link */}
          {isAuthenticated && isAdmin && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {isAuthenticated && user ? (
            <>
              {/* Notification bell for authenticated users */}
              <NotificationBell />
              <span className="badge badge-primary">{user.role}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
