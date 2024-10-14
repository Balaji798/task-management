import { useNavigate } from "react-router-dom";
import "./home.css";
import { useEffect } from "react";
import { useUserTask } from "../../Context/UserTaskContext";
import WidgetUser from "../../components/widgetuser/widgetUser";

const Home = () => {
  const { userTaskCount } = useUserTask();
  const navigate = useNavigate();
  const user = localStorage.getItem("adminToken");
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="home">
      <div className="featured">
        <div className="featuredItem">
          <div className="featuredMoneyContainer">
            <span className="featuredTitle">Total Task</span>
            <span className="featuredMoney">{userTaskCount}</span>
          </div>
          <div className="featuredMoneyContainer"></div>
        </div>
      </div>
      <div className="homeWidgets">
        <WidgetUser />
      </div>
    </div>
  );
};

export default Home;
