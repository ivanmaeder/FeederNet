import React, { Component } from 'react';
import axios from 'axios';
import BirdForm from './bird-form';

class Birds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getTest: "",
      birds: []
    };
  }

  componentDidMount() {
    axios.get('/api')
      .then(response => {
        this.setState({getTest: response.data.SUCCESS});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return(
      <div>
        <h2>{this.state.getTest}</h2>
        <BirdForm/>
      </div>
    );
  }
}

export default Birds;
