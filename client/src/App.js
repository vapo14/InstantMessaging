import {
  Button,
  Stack,
  Form,
  Container,
  Modal,
  Row,
  Col,
  ListGroup,
  Navbar,
  Toast,
} from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./custom.css";
let ENDPOINT = "http://localhost:2021";
let socket = socketIOClient(ENDPOINT);
let connectionIP, connectionPORT;
let messagesEnd;

function App() {
  const [showConnectionModal, setshowConnectionModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [isAlice, setIsAlice] = useState(false);
  const [keysButtonStatus, setKeysButtonStatus] = useState(false);
  const [isDark, setisDark] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [MAC, setMAC] = useState(false);

  let key = 0;
  const mounted = useRef();

  const toggleToast = () => {
    setShowToast(!showToast);
  };

  const handleConnectionChange = () => {
    setIsAlice(!isAlice);
    console.log(isAlice);
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      setshowConnectionModal(false);
      connectionIP = e.target.form[0].value;
      connectionPORT = e.target.form[1].value;
      let url = "http://" + connectionIP + ":" + connectionPORT;
      console.log("sending url", url);
      socket.emit("ConnectionURL", { url, isAlice });
    } else {
      setshowConnectionModal(false);
    }
  };

  const handleInjectMAC = () => {
    // generate new MAC
    setMAC(!MAC);
    console.warn("sending custom MAC");
  };

  const handleThemeChange = () => {
    if (isDark) {
      document.body.style.backgroundColor = "white";
    } else {
      document.body.style.backgroundColor = "#333";
    }
    setisDark(!isDark);
  };

  const handleKeyExchange = (e) => {
    e.preventDefault();
    setKeysButtonStatus(true);
    // execute diffie hellman in backend
    socket.emit("create-key");
  };

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  //const handleShow = () => setshowConnectionModal(true);
  useEffect(() => {
    socket.on("ToClient", (payload) => {
      setMessages((oldArray) => [...oldArray, { id: 1, data: payload.data }]);
      console.log(messages);
    });

    socket.on("InvalidIntegrity", () => {
      setShowToast(!showToast);
    });
    scrollToBottom();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      scrollToBottom();
      socket.emit("Custom MAC", MAC);
    }
  });

  useEffect(() => {
    setshowConnectionModal(true);
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (messageContent !== "") {
      let data = messageContent;
      setMessages((oldArray) => [...oldArray, { id: 0, data }]);
      console.log(messages);
      socket.emit("FromClient", { function: 1, data });
      setMessageContent("");
    }
  };

  const handleMessageChange = (e) => {
    setMessageContent(e.target.value);
  };

  return (
    <div className={isDark ? "dark-theme" : "light-theme"}>
      <Modal show={showConnectionModal} onHide={handleClose}>
        <Modal.Header
          closeButton
          className={isDark ? "dark-theme" : "light-theme"}
        >
          <Modal.Title>Specify Connection</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "dark-theme" : "light-theme"}>
          Write connection details
        </Modal.Body>
        <Form
          style={{ padding: "2rem" }}
          className={isDark ? "dark-theme" : "light-theme"}
        >
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Connection IP:</Form.Label>
            <Form.Control type="text" />
            <Form.Label>Connection PORT:</Form.Label>
            <Form.Control type="text" />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Starts Connection"
              value={isAlice}
              onChange={handleConnectionChange}
              style={{ margin: "1rem" }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={handleClose}>
            Connect
          </Button>
        </Form>
      </Modal>
      <Navbar
        bg={isDark ? "dark" : "light"}
        variant={isDark ? "dark" : "light"}
      >
        <Container>
          <Navbar.Brand href="#">Encrypted Messaging App</Navbar.Brand>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Dark Mode"
            value={isDark}
            onChange={handleThemeChange}
            style={{ margin: "1rem" }}
          />
        </Container>
      </Navbar>
      <Container style={{ marginTop: "2rem" }}>
        <Row>
          <Col md="3">
            <ListGroup className="chat-info">
              <ListGroup.Item className={isDark ? "dark-theme" : "light-theme"}>
                <b>Endpoint:</b> {ENDPOINT}
              </ListGroup.Item>
              <ListGroup.Item className={isDark ? "dark-theme" : "light-theme"}>
                <b>Socket ID:</b> {socket.id}
              </ListGroup.Item>
              <ListGroup.Item className={isDark ? "dark-theme" : "light-theme"}>
                <b>Host:</b> {window.location.host}
              </ListGroup.Item>
              <ListGroup.Item className={isDark ? "dark-theme" : "light-theme"}>
                <b>Connected:</b> {connectionIP}
              </ListGroup.Item>
              <ListGroup.Item className={isDark ? "dark-theme" : "light-theme"}>
                <b>PORT:</b> {connectionPORT}
              </ListGroup.Item>
            </ListGroup>

            <Form style={{ margin: "1rem" }}>
              <Form.Label>Inject Custom MAC</Form.Label>
              <Form.Check
                type="switch"
                value={MAC}
                onChange={handleInjectMAC}
              />
            </Form>

            {isAlice ? (
              <Button
                className="primary"
                style={{ margin: "1rem" }}
                disabled={keysButtonStatus}
                onClick={handleKeyExchange}
              >
                Exchange Keys
              </Button>
            ) : (
              <div></div>
            )}

            <Toast
              show={showToast}
              onClose={toggleToast}
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "2rem",
                zIndex: "10",
              }}
              bg={isDark ? "dark" : "light"}
            >
              <Toast.Header>
                <strong className="me-auto">Invalid Integrity</strong>
                <small>just now</small>
              </Toast.Header>
              <Toast.Body className={isDark ? "dark text-white" : "Light"}>
                You did not get this message because it has been modified!
              </Toast.Body>
            </Toast>
          </Col>
          <Col>
            <div className="chat-container">
              <Container>
                {messages.map((m) => {
                  return (
                    <div key={key++}>
                      <div
                        className={
                          m.id === 1
                            ? "speech-bubble speech-bubble-left"
                            : "speech-bubble speech-bubble-bottom-right speech-bubble-blue"
                        }
                      >
                        {m.data}
                      </div>
                    </div>
                  );
                })}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={(el) => {
                    messagesEnd = el;
                  }}
                ></div>
              </Container>
            </div>
            <Container style={{ position: "relative", marginTop: "2rem" }}>
              <div>
                <Form>
                  <Stack direction="horizontal" gap={3}>
                    <Form.Control
                      className="me-auto"
                      placeholder="Write your message here..."
                      onChange={handleMessageChange}
                      value={messageContent}
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
