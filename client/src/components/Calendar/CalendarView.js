import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  Card,
  ListGroup,
  Button,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import moment from "moment";

function CalendarView({ onDateSelect, tasks, onDelete, onEdit }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date, tasks);
  };
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "primary";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      default:
        return "secondary";
    }
  };
  return (
    <Container className="my-4">
      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <h2 style={{ textAlign: "center" }}>Task List</h2>
          <ListGroup>
            {tasks
              ?.filter(
                (task) =>
                  new Date(task.date).toDateString() ===
                  selectedDate.toDateString()
              )
              .map((task) => (
                <ListGroup.Item key={task._id}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{task.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Status:{" "}
                        <Badge bg={getStatusBadgeVariant(task.status)}>
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1)}
                        </Badge>
                      </Card.Subtitle>
                      <Card.Text>{task.description}</Card.Text>
                      <Card.Footer className="text-muted">
                        Due Date:{" "}
                        {moment(task.date).format("MMMM Do YYYY, h:mm a")}
                      </Card.Footer>
                      <div className="d-flex justify-content-end">
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => onEdit(task)}
                        >
                          <FaEdit /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(task._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default CalendarView;
