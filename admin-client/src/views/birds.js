import React, { Component } from 'react';
import BirdForm from './bird-form';
import BirdTable from './bird-table';
import axios from 'axios';

class Birds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getTest: "", //?
      birds: []
    };

    this.addBird = this.addBird.bind(this);
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

  addBird(name, rfid, callback) {
    const postData = {
      name: name, //you can also simply write `name,` and `rfid` below, and nothing else (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015)
      rfid: rfid
    }

    axios.post('/api/birds', postData)
      .then(res => {
        console.log(res.data);
        this.getBirds();
        callback(null); //in Node the 1st param is usually the error. No error here
      })
      .catch((error) => {
        console.log(error);
        callback(error);
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
        <BirdForm
          addBird={ this.addBird }
        />
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
