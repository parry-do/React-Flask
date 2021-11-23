import React from 'react';
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';

function Login(props) {
    return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header style={{background: "#d0d0d0"}}>
            <Modal.Title id="contained-modal-title-vcenter">
            Login
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{background: "#f0f0f0"}}>
            <Container
                id="main"
                className="d-grid h-100"
                style={{
                    "place-items": "center center",
                    "display":"grid"
                }}
            >
            <Form id="login" className="text-center p-3 w-100">
                <Form.Group controlId="user_name">
                    <Form.Control
                        type="text"
                        size="lg"
                        placeholder="User Name"
                        autoComplete="username"
                        className="position-relative mb-3"
                        />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Control
                        type="password"
                        size="lg"
                        placeholder="Password"
                        autoComplete="current-password"
                        className="position-relative mb-3"
                    />
                </Form.Group>
                <Form.Group
                    className="d-flex justify-content-center mb-4" 
                    controlId="remember"
                >
                    <Form.Check
                        label="Remember me"
                        className="mb-3"
                    />
                </Form.Group>
                <div className="d-grid">
                    <Button variant="primary" size="lg">
                        Sign in
                    </Button>
                </div>
            </Form>
            </Container>
        </Modal.Body>
    </Modal>
    );
}

export default Login
