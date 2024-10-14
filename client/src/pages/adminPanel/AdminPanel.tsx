import { useNavigate } from "react-router-dom";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import "./adminPanel.css";
import { useEffect } from "react";
import { useUserTask } from "../../Context/UserTaskContext";

const AdminPanel = () => {
  const { totalUser, taskCount } = useUserTask();
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
            <span className="featuredTitle">Total Users</span>
            <span className="featuredMoney">{totalUser}</span>
          </div>
          <div className="featuredMoneyContainer">
            <span className="featuredTitle">Active Users</span>
            <span className="featuredMoney">{totalUser}</span>
          </div>
          {/* <span className="featuredSub">Compared to last month</span>*/}
        </div>
        <div className="featuredItem">
          <div className="featuredMoneyContainer">
            <span className="featuredTitle">Total Task</span>
            <span className="featuredMoney">{taskCount}</span>
          </div>
          <div className="featuredMoneyContainer"></div>
        </div>
      </div>
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
};

export default AdminPanel;
