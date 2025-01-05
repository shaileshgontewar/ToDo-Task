import React, { useEffect, useState } from "react";
import { Table, Button, Modal, ListGroup } from "react-bootstrap";
import { getUsers } from "../../services/api";
import { NavLink } from "react-router-dom";

const AdminDashboard = () => {
  const [usersWithTasks, setUsersWithTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsersWithTasks(response.data);
      } catch (error) {
        console.error("Error fetching users with tasks:", error);
      }
    };

    fetchData();
  }, []);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewTasks = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersWithTasks.map((user, index) => (
            <tr key={user.userId}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <NavLink to={`/admin/user-task/${user.userId}`}>
                  <Button
                    variant="primary"
                    onClick={() => handleViewTasks(user)}
                  >
                    View Tasks
                  </Button>
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.name}'s Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Tasks</h5>
          {selectedUser?.tasks?.length > 0 ? (
            <ListGroup>
              {selectedUser.tasks.map((task) => (
                <ListGroup.Item key={task._id}>
                  <strong>{task.title}</strong> - {task.description} <br />
                  <span className="text-muted">Status: {task.status}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No tasks available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
