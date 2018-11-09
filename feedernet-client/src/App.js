import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import './App.css';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiaW50ZXJhY3Rpb25yZXNlYXJjaHN0dWRpbyIsImEiOiJjamdwcXd1bTMwMmNpMnhwZWU1NTRibWg4In0.Z0N-6EZWHB1cawLd1Hz_2A"
});

class MapComponent extends Component {

  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}>
        <Layer
          type="symbol"
          id="marker"
          layout={{'icon-image': 'marker-15'}}>
          <Feature coordinates={[-1.162559, 53.038313]}/>
        </Layer>
      </Map>
    );
  }
}

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({response: res.SUCCESS}))
      .catch(err => console.log(err));
    document.title = "FeederNet"
  }

  callApi = async () => {
    const response = await fetch('/api');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render() {
    return (
      <div className="App">
        <p id="hello">{this.state.response}</p>
        <MapComponent/>
      </div>
    );
  }
}

export default App;
