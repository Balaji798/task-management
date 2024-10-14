import { useState } from "react";
import { Task } from "../../types/Task";
import "./widgetLg.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import TaskModal from "../TaskMoodal";
import {convertToLocalTime} from "../../utils/convertToLocalTime"
import { useUserTask } from "../../Context/UserTaskContext";

const WidgetLg = () => {
  const { totalTask } = useUserTask();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const Button = ({ type }) => {
    return (
      <button
        className={"widgetLgButton " + type}
        style={{ textTransform: "uppercase" }}
      >
        {type}
      </button>
    );
  };
  return (
    <div className="widgetLg">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="widgetSmTitle">Task List</span>
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
          <IoIosAddCircleOutline /> Add New Task
        </button>
      </div>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Task</th>
          <th className="widgetLgTh">Aisne To</th>
          <th className="widgetLgTh">Due Date</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {totalTask.length > 0 &&
          totalTask.map((item: Task, index: number) => {
            return (
              <tr className="widgetLgTr" key={index}>
                <td className="widgetLgUser">
                  <div className="">{item?.task_name}</div>
                </td>
                <td className="widgetLgDate">{item?.assign_to}</td>
                <td className="widgetLgDate">{convertToLocalTime(item?.due_date?.toString())}</td>
                <td className="widgetLgStatus">
                  <Button type={item?.status} />
                </td>
              </tr>
            );
          })}
      </table>
      <TaskModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={title}
      />
    </div>
  );
};

export default WidgetLg;
