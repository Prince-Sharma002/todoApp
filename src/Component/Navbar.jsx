import {Link} from "react-router-dom"

const Navbar = ()=>{

    return(

      <div className="navbar bg-base-100 flex justify-between">
        <h3> Todofy </h3>
        <div>
          <Link to="/notify"> Notify </Link>
          <Link to="/"> Todo </Link>
        </div>
      </div>
    )
  
}

export default Navbar;