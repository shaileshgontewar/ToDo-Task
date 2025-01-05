import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { createTask, updateTask } from "../../services/api";
import { showSuccessToast, showErrorToast } from "../ToastNotifications";

function TaskModal({ date, task, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: date,
    status: "pending",
  });
  console.log(task);
  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        title: task.title,
        description: task.description,
        status: task.status || "pending",
        date: task.date ? new Date(task.date) : date,
      });
    }
  }, [task, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    onClose();
  };

  const handleDelete = () => {
    try {
      onDelete(task._id);
      showSuccessToast("Task deleted successfully!");
      onClose();
    } catch (error) {
      showErrorToast("Failed to delete task. Please try again.");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Create Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          {task && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ margin: "1rem" }}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {task ? "Update" : "Add"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TaskModal;
