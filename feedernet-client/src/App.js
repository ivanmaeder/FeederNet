import React, { Component } from 'react';
import './App.css';
import Map from './views/map';

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({response: res.SUCCESS}))
      .catch(err => console.log(err));
    document.title = "FeederNet"
  }

  callApi = async () => {
    const response = await fetch('/api');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    return (
      <div className="App">
        <p id="hello">{this.state.response}</p>
        <Map/>
      </div>
    );
  }
}

export default App;
