import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';

import IntroPage from '../components/IntroPage';

import { setTeam } from '../actions/userActions';

class EnterTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: props.team || '',
    };
  }

  sendTeam(e) {
    e.preventDefault();
    if (!this.state.team) return;
    this.props.dispatch(setTeam(this.state.team.trim().toUpperCase()));
  }

  render() {
    return (
      <IntroPage>
        <div>
          <span style={{ fontSize: '2em' }}>
            <strong>Join Your Team</strong>
          </span>
          <p style={{ margin: '5px 40px 20px 0px' }}>
            Enter your Team ID below to start communicating with a team on your
            Local Network. Not sure what your Team ID is? Create one and share
            with others on your Network to join You! 😁
          </p>
          <Form onSubmit={e => this.sendTeam(e)}>
            <FormGroup row>
              <Col xs="9" sm="9" md="9" lg="9">
                <Input
                  size="lg"
                  value={this.state.team}
                  placeholder="Enter Team ID"
                  onChange={e =>
                    this.setState({
                      team: e.target.value.toUpperCase().replace(/\s+/g, ''),
                    })}
                />
              </Col>
              <Col xs="3" sm="3" md="3" lg="3">
                <Button size="lg" color="success" style={{ marginLeft: -10 }}>
                  Confirm
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </IntroPage>
    );
  }
}

function mapStateToProps(state) {
  return {
    team: state.user.team,
  };
}

export default connect()(EnterTeam);
