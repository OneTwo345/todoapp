import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import Search from "../common/Search";
import Modal from "react-modal";
import { EStatus } from "./enum/Estatus";
// import "./styles.css";

const DayToDay = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStartDate, setSelectedStartDate] = useState(
    moment().subtract(7, "days")
  );
  const [selectedEndDate, setSelectedEndDate] = useState(moment());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [titleCounts, setTitleCounts] = useState({});

  useEffect(() => {
    loadTasks();
  }, [selectedStartDate, selectedEndDate]);

  const loadTasks = async () => {
    const formattedStartDate = selectedStartDate.format("YYYY-MM-DD");
    const formattedEndDate = selectedEndDate.format("YYYY-MM-DD");

    const url = `http://localhost:9192/tasks/day-by-day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setTasks(response.data);
        // Thống kê tổng số task theo task.title
        const counts = {};
        response.data.forEach((task) => {
          counts[task.title] = (counts[task.title] || 0) + 1;
        });
        setTitleCounts(counts);
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

  const handleStartDateChange = (e) => {
    const startDate = moment(e.target.value);
    setSelectedStartDate(startDate);
  };

  const handleEndDateChange = (e) => {
    const endDate = moment(e.target.value);
    setSelectedEndDate(endDate);
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

  const renderStatistic = () => {
    if (selectedStatus === "") {
      return <p>Vui lòng chọn một trạng thái</p>;
    }

    const totalCount = tasks.length;
    const statusCount = tasks.filter(
      (task) => task.status === selectedStatus
    ).length;
    const percentage = (statusCount / totalCount) * 100;
    const titleCount = titleCounts[selectedStatus] || 0;

    return (
      <div>
        <p>Tổng số task: {totalCount}</p>
        <p>
          Số task ở trạng thái {selectedStatus}: {statusCount}
        </p>
        <p>Tỉ lệ: {percentage.toFixed(2)}%</p>
      </div>
    );
  };

  return (
    <section>
      <div className="mb-3">
        <label htmlFor="startDatePicker" className="form-label">
          Ngày bắt đầu:
        </label>
        <input
          type="date"
          id="startDatePicker"
          className="form-control"
          value={selectedStartDate.format("YYYY-MM-DD")}
          onChange={handleStartDateChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDatePicker" className="form-label">
          Ngày kết thúc:
        </label>
        <input
          type="date"
          id="endDatePicker"
          className="form-control"
          value={selectedEndDate.format("YYYY-MM-DD")}
          onChange={handleEndDateChange}
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
            .filter((task) =>
              task.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((task, index) => (
              <tr key={task.id}>
                <th scope="row">{index + 1}</th>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{moment(task.start).format("DD/MM HH:mm")}</td>
                <td>{moment(task.end).format("DD/MM HH:mm")}</td>
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
        <h2>Thống kê theo trạng thái</h2>
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
          <button className="btn btn-primary" onClick={closeModal}>
            Đóng
          </button>
        </div>
        <div>{renderStatistic()}</div>
      </Modal>
    </section>
  );
};

export default DayToDay;
