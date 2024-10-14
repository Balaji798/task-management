import "./widgetSm.css";
import { LiaEyeSolid } from "react-icons/lia";
import { User } from "../../types/User";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import UserModal from "../UserModal";
import { useUserTask } from "../../Context/UserTaskContext";

const WidgetSm = () => {
  const {activeUser} = useUserTask()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  return (
    <div className="widgetSm">
      <div style={{display:"flex",justifyContent:"space-between"}}>
      <span className="widgetSmTitle">Users</span>
        <button
          style={{
            marginRight: "10px",
            zIndex: 0,
            backgroundColor: "#1677ff",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            fontSize: 20,
            border: "none",
            outline: "none",
          }}
          onClick={() => {
            setIsModalOpen(true);
            setTitle("Add New Task");
          }}
        >
          <IoIosAddCircleOutline /> Add New User
        </button>

      </div>
      <ul className="widgetSmList">
        {activeUser?.map((item: User, index: number) => (
          <li className="widgetSmListItem" key={index}>
            <div className="widgetSmImg">
              {item?.firstName
                ?.split(" ")
                .map((word) => word[0])
                .join("")}
            </div>
            <div className="widgetSmUser">
              <span className="widgetSmUsername">
                {item?.firstName} {item?.lastName}
              </span>
              <span className="widgetSmUserTitle">{item?.email}</span>
            </div>
            <LiaEyeSolid className="widgetSmIcon" />
          </li>
        ))}
      </ul>
      <UserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={title}
      />
    </div>
  );
};

export default WidgetSm;
