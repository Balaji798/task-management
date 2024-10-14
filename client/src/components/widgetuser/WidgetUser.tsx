import React, { useEffect, useState } from 'react'
import { convertToLocalTime } from '../../utils/convertToLocalTime';
import "./widgetLg.css"
import { Task } from '../../types/Task';
import { useUserTask } from '../../Context/UserTaskContext';

const WidgetUser = () => {
    const { fetchUserTasks, userTask } = useUserTask();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        // Call fetchUserTasks when the component mounts
        fetchUserTasks();
      }, []);
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
          <span className="widgetSmTitle">Task List</span>
        <table className="widgetLgTable">
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Task</th>
            <th className="widgetLgTh">Aisne To</th>
            <th className="widgetLgTh">Due Date</th>
            <th className="widgetLgTh">Status</th>
          </tr>
          {userTask.length > 0 &&
            userTask.map((item: Task, index: number) => {
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
      </div>
    );
}

export default WidgetUser