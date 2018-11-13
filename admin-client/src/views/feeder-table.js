import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class FeederTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);

    this.state = {
      feeders: []
    };
  }

  componentDidMount() {
    this.getFeeders();
  }

  // GET birds
  getFeeders() {
    axios.get('/api/feeders')
      .then(response => {
        this.setState({
          feeders: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Build table rows
  buildRows() {
    return this.state.feeders.map((object, i) => {
      return(
        <tr key={i}>
          <td>{object.name}</td>
          <td>{object.stub}</td>
          <td>{object.location.latitude}</td>
          <td>{object.location.longitude}</td>
          <td>{object.lastPing}</td>
          <td>
            <Button
              onClick={() => this.deleteItem(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="remove"/>
            </Button>
          </td>
        </tr>
      );
    });
  }

  deleteItem(itemId) {
    console.log("Delete item with ID " + itemId);
    axios.delete('/api/feeder/' + itemId)
      .then(res => {
        this.getFeeders();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return(
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Feeder Name</th>
            <th>Feeder Stub</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Last Ping</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.buildRows()}
        </tbody>
      </Table>
    );
  }
}

export default FeederTable;
