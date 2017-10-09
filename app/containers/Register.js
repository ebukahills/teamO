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
  Navbar,
  NavbarBrand,
} from 'reactstrap';

import { push } from 'react-router-redux';

import IntroPage from '../components/IntroPage';

import { startRegister } from '../actions/userActions';
import { showError, showInfo } from '../actions/feedbackActions';
import { redirect } from '../actions/routerActions';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      password: '',
      cpassword: '',
    };
  }

  componentDidMount() {
    if (!this.props.team) {
      this.props.dispatch(redirect('/team'));
    }
  }

  register(e) {
    e.preventDefault();
    let { name, username, password, cpassword } = this.state;
    if (!name || !username || !password) return;
    if (password !== cpassword) {
      return this.props.dispatch(showError('Passwords do not Match!'));
    }
    this.props.dispatch(
      startRegister(name.trim(), username, password, this.props.team)
    );
  }

  render() {
    return (
      <IntroPage>
        <div>
          <span style={{ fontSize: '2em' }}>
            <strong>Register</strong>
          </span>
          <p style={{ margin: '5px 50px 20px 0px' }}>
            Register with your details to get Access to the {'  '}
            <span style={{ fontSize: '1.2em', color: 'red' }}>
              {this.props.team}
            </span>{' '}
            Team.
          </p>
          <Form onSubmit={e => this.register(e)}>
            <FormGroup row>
              <Input
                size="lg"
                placeholder="Full Name"
                value={this.state.name}
                onChange={e =>
                  this.setState({
                    name: e.target.value,
                  })}
              />
            </FormGroup>
            <FormGroup row>
              <Input
                size="lg"
                placeholder="Username"
                value={this.state.username}
                onChange={e =>
                  this.setState({
                    username: e.target.value.replace(/\s+/g, ''),
                  })}
              />
            </FormGroup>
            <FormGroup row>
              <Input
                size="lg"
                type="password"
                value={this.state.password}
                placeholder="Password"
                onChange={e => this.setState({ password: e.target.value })}
              />
            </FormGroup>
            <FormGroup row>
              <Input
                size="lg"
                type="password"
                value={this.state.cpassword}
                placeholder="Confirm Password"
                onChange={e => this.setState({ cpassword: e.target.value })}
              />
            </FormGroup>
            <FormGroup row>
              <Button size="lg" color="success" block>
                REGISTER ON {this.props.team}
              </Button>
            </FormGroup>
            <Row className="justify-content-center align-middle">
              <Button
                size="sm"
                color="primary"
                onClick={() => this.props.dispatch(push('/login'))}
              >
                LOGIN TO TEAM
              </Button>
            </Row>
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

export default connect(mapStateToProps)(Register);
