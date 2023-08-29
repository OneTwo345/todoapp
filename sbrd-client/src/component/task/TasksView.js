import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Search from "../common/Search";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

const TasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [tasksPerPage] = useState(10);

  const getStatusClass = (status) => {
    switch (status) {
      case "TODO":
        return "todo";
      case "IN_PROGRESS":
        return "in-progress";
      case "DISMISS":
        return "dismiss";
      case "DONE":
        return "done";
      case "SKIP":
        return "skip";
      default:
        return "";
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const result = await axios.get("http://localhost:9192/tasks", {
      validateStatus: () => true,
    });
    if (result.status === 302) {
      setTasks(result.data);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Bạn có chắc chắn muốn xóa task này?");

    if (shouldDelete) {
      try {
        await axios.delete(`http://localhost:9192/tasks/delete/${id}`);
        toast.success("Đã xóa thành công", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        loadTasks();
      } catch (error) {
        toast.error("Xóa thất bại", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );
  const pageCount = Math.ceil(filteredTasks.length / tasksPerPage);
  const offset = currentPage * tasksPerPage;
  const currentPageTasks = filteredTasks.slice(offset, offset + tasksPerPage);

  return (
    <section>
      <Search search={search} setSearch={setSearch} />
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Task</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Type</th>
            <th colSpan="2">Action</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {currentPageTasks.map((task, index) => (
            <tr key={task.id} className={getStatusClass(task.status)}>
              <td>{offset + index + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{moment(task.start).format("HH:mm")}</td>
              <td>{moment(task.end).format("HH:mm")}</td>
              <td>{task.status}</td>
              <td>{task.type}</td>
              <td className="mx-2">
                <Link to={`/edit-task/${task.id}`} className="btn btn-warning">
                  <FaEdit />
                </Link>
              </td>
              <td className="mx-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(task.id)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        activeClassName={"active"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
      />

      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </section>
  );
};

export default TasksView;
