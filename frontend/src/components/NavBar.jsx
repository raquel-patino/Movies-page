import { Link } from "react-router-dom";
import "../css/Navbar.css";
import Login from "../pages/Login";

function NavBar (){


return <nav className="navbar">
    <div className="navbar-brand">
        <Link to = "/" className="movie-app"> Movie App</Link>
    </div>
    <div className="navbar-links">
        <Link to ="/chat" className="nav-link"> AI Recommends</Link>
        <Link to= "/" className="nav-link">Home</Link>
        <Link to= "/favorites" className="nav-link">Favorites</Link>
        <Login />
    </div>

</nav>



}

export default NavBar