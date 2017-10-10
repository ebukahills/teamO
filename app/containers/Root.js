import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import Loading from '../components/Loading';

type RootType = {
  store: {},
  history: {},
};

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    let { store } = this.props;
    // Subscribe to state change and check for ready state
    let unsubscribe = store.subscribe(() => {
      let { ready } = store.getState().app;
      if (ready) {
        // App is now ready
        this.setState({ ready: true });
        unsubscribe();
      }
    });
  }

  render() {
    return (
      <Provider store={this.props.store}>
        {this.state.ready ? (
          <Routes history={this.props.history} />
        ) : (
          <Loading />
        )}
      </Provider>
    );
  }
}
