import React, { Component } from 'react';
import { Container, Row, Col, Form, Navbar } from 'react-bootstrap';
import './App.css';
import { BlobView } from './components/blobView';
import 'bootstrap/dist/css/bootstrap.min.css';

interface State {
  userUri: string;
}

class App extends Component<any, State> {
  constructor(p: any, s: State) {
    super(p, s);
    this.state = { userUri: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    this.setState({ userUri: event.target.value });
  }

  handleSubmit(event: any) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <Row>
          <Col>
            <Navbar bg="dark" variant="dark" expand="lg">
              <Container>
                <Navbar.Brand href="#home">azure blob sas thing</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Col>
        </Row>
        <Container>
          <Row>
            <Col>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formFullSasUri">
                  <Form.Label>Enter the SAS of your container here</Form.Label>
                  <Form.Control size="lg" type="url" value={this.state.userUri} onChange={this.handleChange} placeholder="https://<storage>.blob.core.windows.net/<container>/<sas>" />
                  <Form.Text className="text-muted">
                    This is an azure storage sas with list permissions on a container
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <BlobView key={this.state.userUri} fullSasUri={this.state.userUri} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default App;