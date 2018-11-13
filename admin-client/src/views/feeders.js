import React, { Component } from 'react';
import FeederForm from './feeder-form';
import FeederTable from './feeder-table';

class Feeders extends Component {
  render() {
    return(
      <div>
        <br/>
        <FeederForm/>
        <br/>
        <FeederTable/>
      </div>
    );
  }
}

export default Feeders;
