import React, { Component } from 'react';
import BirdForm from './bird-form';
import BirdTable from './bird-table';
import axios from 'axios';

class Birds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getTest: "", //TODO ?
      birds: [],
    };

    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    this.getBirds();
  }

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
      <div>
        <br/>
        <BirdForm/>
        <br/>
        <BirdTable
            birds={ this.state.birds }
            deleteBird={ this.deleteItem }
        />
      </div>
    );
  }
}

export default Birds;
