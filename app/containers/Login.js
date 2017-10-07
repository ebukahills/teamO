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

import IntroPage from '../components/IntroPage';

import { setTeam, startLogin } from '../actions/userActions';
import { redirect } from '../actions/routerActions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    if (!this.props.team) {
      this.props.dispatch(redirect('/team'));
    }
  }

  login(e) {
    e.preventDefault();
    this.props.dispatch(startLogin(this.state.username, this.state.password));
  }

  render() {
    return (
      <IntroPage>
        <div>
          <span style={{ fontSize: '2em' }}>
            <strong>Login</strong>
          </span>
          <p style={{ margin: '5px 50px 20px 0px' }}>
            Enter your Login Credentials to get access to Team:{' '}
            <span style={{ fontSize: '1.2em', color: 'red' }}>
              {this.props.team}
            </span>
          </p>
          <Form onSubmit={e => this.login(e)}>
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

export default connect(mapStateToProps)(Login);
