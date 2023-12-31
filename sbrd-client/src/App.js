import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Home";
import TasksView from "./component/task/TasksView";
import NavBar from "./component/common/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTask from "./component/task/AddTask";
import EditTask from "./component/task/EditTask";
import HistoryView from "./component/task/HistoryView";
import DayToDay from "./component/task/DayToDay";

function App() {
  return (
    <main className="container mt-5">
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/view-tasks" element={<TasksView />}></Route>
          <Route exact path="/add-task" element={<AddTask />}></Route>
          <Route exact path="/edit-task/:id" element={<EditTask />}></Route>
          <Route exact path="/search-task" element={<HistoryView />} />
          <Route exact path="/day-day" element={<DayToDay />} />
        </Routes>
      </Router>
      <ToastContainer />
    </main>
  );
}

export default App;
