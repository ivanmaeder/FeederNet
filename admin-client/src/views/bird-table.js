import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class BirdTable extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);

    this.state = {
      birds: []
    };
  }

  componentDidMount() {
    this.getBirds();
  }

  // GET birds
  getBirds() {
    axios.get('/api/birds')
      .then(response => {
        this.setState({
          birds: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Build table rows
  buildRows() {
    return this.state.birds.map((object, i) => {
      return(
        <tr key={i}>
          <td>{object.name}</td>
          <td>{object.rfid}</td>
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
    axios.delete('/api/bird/' + itemId)
      .then(res => {
        this.getBirds();
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
            <th>Bird Name</th>
            <th>RFID Tag</th>
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

export default BirdTable;
