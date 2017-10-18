import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }

  onSubmit(e) {
    e.preventDefault();
    let message = this.state.message;
    this.setState({ message: '' });
    this.props.onSubmit(message); // Message is passed directly as string to parent
  }

  render() {
    // active is the current receiver of the Message Action (User, Group)
    return (
      <div className="input-bar">
        <Form onSubmit={e => this.onSubmit(e)}>
          <FormGroup style={{ marginBottom: '0.1rem' }}>
            <Input
              size="lg"
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
              placeholder={`   Send to @${this.props.active}`}
            />
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default MessageInput;
