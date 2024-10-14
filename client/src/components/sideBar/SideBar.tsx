import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate()
  const navData = [
    {
      title: "Dashboard",
      //icon: <LineStyle className="sidebarIcon" />,
      link: "/",
    },
    {
      title: "Users",
      //icon: <PermIdentity className="sidebarIcon" />,
      link: "/users",
    },
    {
      title: "Task",
      link: "/task",
    },
    
  ];
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <ul className="sidebarList">
            {navData.map((item, index) => (
              <Link to={item.link} className="link" key={index}>
                <li className="sidebarListItem active">
                  {/* {item.icon} */}
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>
          <div className="link" style={{margin:"6rem 0 0 0.5rem"}} onClick={()=>{
            localStorage.removeItem("adminToken")
            navigate("/login")
            window.location.reload()
          }}>
          <p className="sidebarListItem active">Logout</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
