import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EStatus } from "./enum/Estatus";
import { EType } from "./enum/Etype";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const AddTask = () => {
  let navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    status: "",
    type: "",
  });
  const { title, description, start, end, status, type } = task;

  const handleInputChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });

    if (
      (e.target.name === "end" && e.target.value < task.start) ||
      (e.target.name === "start" && e.target.value > task.end)
    ) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu");
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
    } else {
      setError("");
    }
  };

  const saveTask = async (e) => {
    e.preventDefault();

    if (error) {
      return;
    }

    await axios.post("http://localhost:9192/tasks", task);
    toast.success("Thêm mới thành công");
    navigate("/view-tasks");
  };
  const [eStatus, setEstatus] = useState([]);
  const [eType, setEtype] = useState([]);
  const [error, setError] = useState(""); // Thêm trạng thái lỗi

  const getEnumUnit = () => {
    const enumValuesArray = Object.values(EStatus);
    setEstatus(enumValuesArray);
    const typeEnumValues = Object.values(EType);
    setEtype(typeEnumValues);

    // console.log(enumValuesArray)
  };

  useEffect(() => {
    getEnumUnit();
  }, []);

  return (
    <div className="col-sm-8 py-2 px-5 offset-2 shadow">
      <h2 className="mt-5"> ADD TASK</h2>
      <form onSubmit={(e) => saveTask(e)}>
        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="title">
            TITLE
          </label>
          <input
            className="form-control col-sm-6"
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="description">
            DESCRIPTION
          </label>
          <input
            className="form-control col-sm-6"
            type="text"
            name="description"
            id="description"
            required
            value={description}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="start">
            TIME START
          </label>
          <input
            className="form-control col-sm-6"
            type="datetime-local"
            name="start"
            id="start"
            required
            value={start}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="end">
            TIME END
          </label>
          <input
            className="form-control col-sm-6"
            type="datetime-local" // Sử dụng loại datetime-local
            name="end"
            id="end"
            required
            value={end}
            onChange={(e) => handleInputChange(e)}
          />
        </div>

        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="status">
            STATUS
          </label>
          <select
            className="form-control col-sm-6"
            name="status"
            id="status"
            required
            value={status}
            onChange={(e) => handleInputChange(e)}
          >
            {eStatus.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group mb-5">
          <label className="input-group-text" htmlFor="type">
            TYPE
          </label>
          <select
            className="form-control col-sm-6"
            name="type"
            id="type"
            required
            value={type}
            onChange={(e) => handleInputChange(e)}
          >
            {eType.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="row mb-5">
          <div className="col-sm-2">
            <button type="submit" className="btn btn-outline-success btn-lg">
              SAVE
            </button>
          </div>

          <div className="col-sm-2">
            <Link
              to={"/view-tasks"}
              type="submit"
              className="btn btn-outline-warning btn-lg"
            >
              CANCEL
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
