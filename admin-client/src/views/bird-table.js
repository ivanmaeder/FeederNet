import React, { Component } from 'react';
import { Table, Button, Glyphicon } from 'react-bootstrap';

class BirdTable extends Component {
  constructor(props) {
    super(props);
  }

  buildRows() {
    return this.props.birds.map((object, i) => {
      return (
        <tr key={i}>
          <td>{object.name}</td>
          <td>{object.rfid}</td>
          <td>
            <Button
              onClick={() => this.props.deleteBird(object._id)}
              bsSize="xsmall"
              >
              <Glyphicon glyph="remove"/>
            </Button>
          </td>
        </tr>
      );
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
