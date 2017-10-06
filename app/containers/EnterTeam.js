import React, { Component } from 'react';
import {connect} from 'react-redux'

import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Navbar,
  NavbarBrand,
} from 'reactstrap';

import {setTeam} from '../actions/userActions'

class EnterTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: ''
    }
  }

  sendTeam(e) {
    e.preventDefault()
    this.props.dispatch(setTeam(this.state.team.trim()))
  }
  
  render() {
    return (
      <Container fluid>
        <Row
          style={{
            zIndex: 999,
            backgroundColor: '#fff',
            borderBottom: '2px solid #dedede',
            boxShadow: '#000',
          }}
        >
          <Navbar color="faded" light expand="md">
            <NavbarBrand>
              <h1>teamO!</h1>
            </NavbarBrand>
          </Navbar>
        </Row>
        <Row
          className="justify-content-center align-middle"
          style={{ backgroundColor: '#f7f7f7', minHeight: '90vh' }}
        >
          <Col xs="10" sm="6" md="6" className="align-self-center">
            <span style={{ fontSize: '2em' }}>
              <strong>Join Your Team</strong>
            </span>
            <p style={{ margin: '5px 50px 20px 0px' }}>
              Enter your Team ID below to start communicating with a team on
              your Local Network. Not sure what your Team ID is? Create one and
              share with others on your Network to join You! 😁
            </p>
            <Form
              onSubmit={e => this.sendTeam(e)}
            >
              <FormGroup row>
                <Col xs="9" sm="9" md="9" lg="9">
                  <Input
                    size="lg"
                    placeholder="Enter Team ID"
                    onChange={e => this.setState({ team: e.target.value })}
                  />
                </Col>
                <Col xs="3" sm="3" md="3" lg="3">
                  <Button size="lg" color="success" style={{ marginLeft: -10 }}>
                    Confirm
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect()(EnterTeam)
