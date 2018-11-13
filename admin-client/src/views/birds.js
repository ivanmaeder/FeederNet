import React, { Component } from 'react';
import BirdForm from './bird-form';
import BirdTable from './bird-table';

class Birds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getTest: ""
    };
  }

  render() {
    return(
      <div>
        <br/>
        <BirdForm/>
        <br/>
        <BirdTable/>
      </div>
    );
  }
}

export default Birds;
