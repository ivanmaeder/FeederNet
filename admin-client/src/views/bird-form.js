import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import axios from 'axios';

class BirdForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      birdName: '',
      birdRfid: ''
    }
  }

  // Handle form change
  handleChange(e) {
    this.setState({
      birdName: e.target.birdName,
      birdRfid: e.target.birdRfid
    });
  }

  // Handle submit
  handleSubmit(e) {
    e.preventDefault();
    const postData = {
      name: this.state.birdName,
      rfid: this.state.birdRfid
    }
    axios.post('/api/birds', postData)
      .then(res => {
        console.log(res.data);
        this.setState({
          birdName: '',
          birdRfid: ''
        })
        // Also remember to reload data.
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return(
      <form>
        <FormGroup
          controlId="birdForm"
        >
          <ControlLabel>Bird name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.birdName}
            placeholder="Apollo"
            onChange={this.handleChange}
          />
          <ControlLabel>RFID tag</ControlLabel>
          <FormControl
            type="text"
            value={this.state.birdRfid}
            placeholder="123456789"
            onChange={this.handleChange}
          />
          <FormControl
            type="submit"
            value="Add New Bird"
            onChange={this.handleSubmit}
          />
        </FormGroup>
      </form>
    );
  }

}

export default BirdForm;
