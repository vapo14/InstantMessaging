import {
  Button,
  Stack,
  Form,
  Container,
  Alert,
  Modal,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
let ENDPOINT = "http://localhost:2021";
let socket = socketIOClient(ENDPOINT);
let connectionIP, connectionPORT;

function App() {
  const [showConnectionModal, setshowConnectionModal] = useState(false);
  const [messages, setMessages] = useState([]);
  let key = 0;
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      setshowConnectionModal(false);
      connectionIP = e.target.form[0].value;
      connectionPORT = e.target.form[1].value;
      let url = "http://" + connectionIP + ":" + connectionPORT;
      console.log("sending url", url);
      socket.emit("ConnectionURL", url);
    } else {
      setshowConnectionModal(false);
    }
  };
  //const handleShow = () => setshowConnectionModal(true);
  useEffect(() => {
    socket.on("ToClient", (payload) => {
      setMessages((oldArray) => [...oldArray, { id: 1, data: payload.data }]);
      console.log(messages);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setshowConnectionModal(true);
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    let data = e.target.form[0].value;
    setMessages((oldArray) => [...oldArray, { id: 0, data }]);
    console.log(messages);
    socket.emit("FromClient", { function: 1, data });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Modal show={showConnectionModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Specify Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body>Write connection details</Modal.Body>
        <Form style={{ padding: "2rem" }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Connection IP:</Form.Label>
            <Form.Control type="text" />
            <Form.Label>Connection PORT:</Form.Label>
            <Form.Control type="text" />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={handleClose}>
            Connect
          </Button>
        </Form>
      </Modal>
      <Container>
        <Row>
          <Col md="3">
            <ListGroup>
              <ListGroup.Item>
                <b>Endpoint:</b> {ENDPOINT}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Socket ID:</b> {socket.id}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Host:</b> {window.location.host}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Connected:</b> {connectionIP}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>PORT:</b> {connectionPORT}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col>
            <div
              style={{
                height: "80vh",
                overflowY: "scroll",
                border: "solid #c4c5c7 1px",
                borderRadius: "1rem",
                maxWidth: "60vw",
                marginLeft: "auto",
                marginRight: "auto",
                padding: " 4rem",
              }}
            >
              <Container>
                {messages.map((m) => {
                  return (
                    <div key={key++}>
                      <Alert variant={m.id === 1 ? "primary" : "secondary"}>
                        {m.data}
                      </Alert>
                    </div>
                  );
                })}
              </Container>
            </div>
            <Container style={{ position: "relative", marginTop: "2rem" }}>
              <div>
                <Form>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Control
                      className="me-auto"
                      placeholder="Write your message here..."
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleSubmitMessage}
                    >
                      Send
                    </Button>
                  </Stack>
                </Form>
              </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
