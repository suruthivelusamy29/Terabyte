import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">TERABYTE</span>
        <p>Your ultimate streaming destination. Watch anywhere, anytime.</p>
      </div>
      <div className="footer-links">
        <div>
          <h4>Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/search">Search</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} TeraByte. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
