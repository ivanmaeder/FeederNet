import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class BirdForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRfidChange = this.handleRfidChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      birdName: '',
      birdRfid: ''
    };
  }

  // Handle form changes
  handleRfidChange(e) {
    console.log(e.target.value);
    this.setState({ birdRfid: e.target.value });
  }
  handleNameChange(e) {
    console.log(e.target.value);
    this.setState({ birdName: e.target.value });
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
        <Row>
          <Col md={6}>
            <FormGroup controlId="birdName">
              <ControlLabel>Bird name</ControlLabel>
              <FormControl
                type="text"
                value={this.state.birdName}
                placeholder="Apollo"
                onChange={this.handleNameChange}
                />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId="birdRfid">
              <ControlLabel>RFID tag</ControlLabel>
              <FormControl
                type="text"
                value={this.state.birdRfid}
                placeholder="123456789"
                onChange={this.handleRfidChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="form-row">
          <Button type="submit" onClick={this.handleSubmit}>Add New Bird</Button>
        </div>
      </form>
    );
  }

}

export default BirdForm;
