import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EStatus } from "./enum/Estatus";
import { EType } from "./enum/Etype";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const EditTask = () => {
  let navigate = useNavigate();

  const { id } = useParams();

  const [task, setTask] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    status: "",
    type: "",
  });
  const { title, description, start, end, status, type } = task;
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

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    const result = await axios.get(`http://localhost:9192/tasks/task/${id}`);
    setTask(result.data);
  };

  const handleInputChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });

    // Kiểm tra nếu thời gian kết thúc không hợp lệ (trước thời gian bắt đầu)
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
  const updateTask = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu có lỗi, không cho phép cập nhật
    if (error) {
      return;
    }

    try {
      await axios.put(`http://localhost:9192/tasks/update/${id}`, task);
      toast.success("Chỉnh sửa thành công");
      navigate("/view-tasks");
    } catch (error) {
      toast.error("Chỉnh sửa thất bại");
    }
  };

  return (
    <div className="col-sm-8 py-2 px-5 offset-2 shadow">
      <h2 className="mt-5"> EDIT TASK</h2>
      <form onSubmit={(e) => updateTask(e)}>
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

export default EditTask;
