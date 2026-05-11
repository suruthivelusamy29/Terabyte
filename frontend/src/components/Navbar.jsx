import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiSearch, FiX, FiBell, FiUser, FiLogOut,
  FiUpload, FiSettings, FiBookmark, FiClock,
  FiMenu, FiChevronRight,
} from "react-icons/fi";
import api from "../services/api";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef();
  const dropRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setSuggestions([]); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!searchVal.trim() || searchVal.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get(`/videos/search/suggestions?q=${encodeURIComponent(searchVal)}`);
        setSuggestions(data);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [searchVal]);

  useEffect(() => {
    if (user) {
      api.get("/auth/notifications").then(({ data }) => setNotifications(data)).catch(() => {});
    }
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal(""); setSearchOpen(false); setSuggestions([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isHome = location.pathname === "/";

  return (
    <>
      <nav className={`navbar ${scrolled || !isHome ? "solid" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-tb">TERA</span><span className="logo-byte">BYTE</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {[
              { to: "/", label: "Home" },
              { to: "/browse", label: "Browse" },
              { to: "/browse?sort=trending", label: "Trending" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className={`nav-link ${location.pathname === to ? "active" : ""}`}>
                {label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/watchlist" className={`nav-link ${location.pathname === "/watchlist" ? "active" : ""}`}>My List</Link>
                <Link to="/history" className={`nav-link ${location.pathname === "/history" ? "active" : ""}`}>History</Link>
              </>
            )}
          </div>

          {/* Right */}
          <div className="navbar-right">
            {/* Search */}
            <div className={`search-wrap ${searchOpen ? "open" : ""}`} ref={searchRef}>
              <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                {searchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
              </button>
              {searchOpen && (
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search titles, genres..."
                    className="search-input"
                  />
                  {suggestions.length > 0 && (
                    <div className="suggestions">
                      {suggestions.map((s) => (
                        <Link
                          key={s._id}
                          to={`/watch/${s._id}`}
                          className="suggestion-item"
                          onClick={() => { setSearchOpen(false); setSuggestions([]); setSearchVal(""); }}
                        >
                          {s.thumbnail && <img src={s.thumbnail} alt={s.title} />}
                          <div>
                            <p>{s.title}</p>
                            <span>{s.category}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Notifications */}
            {user && (
              <div className="notif-wrap" ref={notifRef}>
                <button className="icon-btn notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
                  <FiBell size={18} />
                  {unreadCount > 0 && <span className="notif-dot">{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown glass">
                    <div className="notif-header">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={() => {
                          api.put("/auth/notifications/read");
                          setNotifications((n) => n.map((x) => ({ ...x, read: true })));
                        }} className="mark-read">Mark all read</button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="notif-empty">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={i} className={`notif-item ${!n.read ? "unread" : ""}`}>
                          <div className="notif-dot-indicator" />
                          <p>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="user-menu" ref={dropRef}>
                <button className="avatar-btn" onClick={() => setDropOpen(!dropOpen)}>
                  <div className="avatar">
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.[0]?.toUpperCase()}
                  </div>
                </button>
                {dropOpen && (
                  <div className="user-dropdown glass">
                    <div className="dropdown-user">
                      <div className="avatar lg">
                        {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                        {user.role === "admin" && <span className="badge badge-purple" style={{ marginTop: 4 }}>Admin</span>}
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    {[
                      { to: "/profile", icon: <FiUser size={14} />, label: "Profile" },
                      { to: "/watchlist", icon: <FiBookmark size={14} />, label: "My List" },
                      { to: "/history", icon: <FiClock size={14} />, label: "Watch History" },
                    ].map(({ to, icon, label }) => (
                      <Link key={to} to={to} className="dropdown-item">
                        {icon} {label} <FiChevronRight size={12} className="ml-auto" />
                      </Link>
                    ))}
                    {user.role === "admin" && (
                      <>
                        <div className="dropdown-divider" />
                        <Link to="/admin" className="dropdown-item">
                          <FiSettings size={14} /> Admin Dashboard <FiChevronRight size={12} className="ml-auto" />
                        </Link>
                        <Link to="/admin/upload" className="dropdown-item">
                          <FiUpload size={14} /> Upload Video <FiChevronRight size={12} className="ml-auto" />
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={() => { logout(); navigate("/login"); }}>
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            <button className="mobile-menu-btn icon-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu glass">
          {[
            { to: "/", label: "Home" },
            { to: "/browse", label: "Browse" },
            { to: "/browse?sort=trending", label: "Trending" },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="mobile-link">{label}</Link>
          ))}
          {user && (
            <>
              <Link to="/watchlist" className="mobile-link">My List</Link>
              <Link to="/history" className="mobile-link">History</Link>
              <Link to="/profile" className="mobile-link">Profile</Link>
              {user.role === "admin" && <Link to="/admin" className="mobile-link">Admin</Link>}
              <button className="mobile-link logout" onClick={() => { logout(); navigate("/login"); }}>Sign Out</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="mobile-link">Sign In</Link>
              <Link to="/register" className="mobile-link">Get Started</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
