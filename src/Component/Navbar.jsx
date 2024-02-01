import {Link} from "react-router-dom"

// styles
import "./styles/navbar.scss"


const Navbar = ()=>{

    return(

      <div className="navbar bg-slate-600/20">
        <h3> StudyPilot </h3>
        <div>
          <Link to="/"> ToDo </Link>
          <Link to="/stopwatch"> StopWatch </Link>
          <Link to="/notes"> Notes </Link>
          <Link to="/calendar"> Calendar </Link>
          <Link to="/lostPanel"> LostPanel </Link>   
          <Link to="/about"> About </Link>   
        </div>
      </div>
    )
  
}

export default Navbar;