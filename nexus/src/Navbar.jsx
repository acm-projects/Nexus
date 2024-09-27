import { Link } from 'react-router-dom';
import Logo from './assets/Logo.svg';
import './App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/"><img src={Logo} className="svg" alt="Logo" /></Link>

      <ul className="navbar-links">
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/grade-calculator">Grade Calculator</Link></li>
        <li><Link to="/chat">Chat</Link></li>
      </ul>

      <div className="navbar-auth">
        <Link to="/signup">
          <button className="auth-button">Sign Up / Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;