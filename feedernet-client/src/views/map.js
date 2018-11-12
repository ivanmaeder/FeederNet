import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Mapbox = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiaW50ZXJhY3Rpb25yZXNlYXJjaHN0dWRpbyIsImEiOiJjamdwcXd1bTMwMmNpMnhwZWU1NTRibWg4In0.Z0N-6EZWHB1cawLd1Hz_2A"
});

class Map extends Component {

  render() {
    return (
      <Mapbox
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
      </Mapbox>
    );
  }
}

export default Map;
