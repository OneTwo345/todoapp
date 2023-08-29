import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import Search from "../common/Search";
import Modal from "react-modal";
import { EStatus } from "./enum/Estatus";

const HistoryView = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    moment().subtract(1, "days")
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const url = `http://localhost:9192/tasks/search?selectedDate=${formattedDate}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Bạn có chắc chắn muốn xóa task này?");

    if (shouldDelete) {
      try {
        await axios.delete(`http://localhost:9192/tasks/delete/${id}`);
        toast.success("Đã xóa thành công");
        loadTasks();
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = moment(e.target.value);
    setSelectedDate(selectedDate);
  };

  const handleStatistic = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  const renderStatistic = () => {
    if (selectedStatus === "" || selectedTitle === "") {
      return <p>Vui lòng chọn trạng thái và tiêu đề</p>;
    }

    const filteredTasks = tasks.filter(
      (task) => task.status === selectedStatus && task.title === selectedTitle
    );
    const totalCount = tasks.length;
    const statusCount = filteredTasks.length;
    const percentage = (statusCount / totalCount) * 100;

    return (
      <div>
        <p>Tổng số task: {totalCount}</p>
        <p>
          Số task với trạng thái "{selectedStatus}" và tiêu đề "{selectedTitle}
          ": {statusCount}
        </p>
        <p>Tỉ lệ: {percentage.toFixed(2)}%</p>
      </div>
    );
  };

  return (
    <section>
      <div className="mb-3">
        <label htmlFor="datePicker" className="form-label">
          Chọn ngày:
        </label>
        <input
          type="date"
          id="datePicker"
          className="form-control"
          value={selectedDate.format("YYYY-MM-DD")}
          onChange={handleDateChange}
        />
      </div>
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
          </tr>
        </thead>

        <tbody className="text-center">
          {tasks
            .filter((task) => task.title.toLowerCase().includes(search))
            .map((task, index) => (
              <tr key={task.id}>
                <th scope="row">{index + 1}</th>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{moment(task.start).format("HH:mm")}</td>
                <td>{moment(task.end).format("HH:mm")}</td>
                <td>{task.status}</td>
                <td>{task.type}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button className="btn btn-primary" onClick={handleStatistic}>
          Thống kê
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Thống kê theo trạng thái và tiêu đề</h2>
        <div>
          <label htmlFor="statusSelect">Chọn trạng thái:</label>
          <select
            id="statusSelect"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value={EStatus.TODO}>TODO</option>
            <option value={EStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={EStatus.DISMISS}>DISMISS</option>
            <option value={EStatus.DONE}>DONE</option>
          </select>
        </div>
        <div>
          <label htmlFor="titleInput">Nhập tiêu đề:</label>
          <input
            type="text"
            id="titleInput"
            value={selectedTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={closeModal}>
            Đóng
          </button>
        </div>
        <div>{renderStatistic()}</div>
      </Modal>
    </section>
  );
};

export default HistoryView;
