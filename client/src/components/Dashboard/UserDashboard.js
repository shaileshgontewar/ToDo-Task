import React, { useEffect, useState } from "react";
import CalendarView from "../Calendar/CalendarView";
import TaskModal from "../Task/TaskModal";
import {
  createTask,
  deleteTask,
  getUsersTask,
  getUserTasks,
  updateTask,
} from "../../services/api";
import { showErrorToast, showSuccessToast } from "../ToastNotifications";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function UserDashboard() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  async function fetchTasks() {
    try {
      let response;
      if (userId) {
        response = await getUsersTask(userId);
      } else {
        response = await getUserTasks();
      }
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }
  useEffect(() => {
    fetchTasks();
  }, [userId]);
  const handleDateSelect = (date) => {
    const taskForDate = tasks.find(
      (task) =>
        new Date(task.date).toLocaleDateString() ===
        new Date(date).toLocaleDateString()
    );
    setModalData({
      date: date,
      task: taskForDate || null,
    });
  };

  const handleEdit = (task) => {
    setModalData({ task, date: new Date(task.date) });
  };
  const handleSave = async (task) => {
    try {
      const taskData = {
        ...task,
        date: new Date(task.date).toISOString(),
      };
      if (task._id) {
        await updateTask(task._id, taskData);
      } else {
        await createTask(taskData);
      }
      showSuccessToast(
        task._id ? "Task updated successfully!" : "Task created successfully!"
      );
      fetchTasks();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("Failed to save task. Please try again.");
      }
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
      showErrorToast("Failed to delete task. Please try again.");
    }
  };
  const handleCloseModal = () => setModalData(null);
  const navigate = useNavigate();
  return (
    <Container>
      {userId && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>User Tasks</h2>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      )}

      <CalendarView
        onDateSelect={handleDateSelect}
        tasks={tasks}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {modalData && (
        <TaskModal
          date={modalData.date}
          task={modalData.task}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
}

export default UserDashboard;
