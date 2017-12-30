import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './client'

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      earthquakes: []
    }
  }

  componentDidMount(){
    this.loadEarthquakes();
    setInterval(this.loadEarthquakes, 300000);
  }

  loadEarthquakes = () => {
    Client.dailySearch((data) => {
      this.setState({
            earthquakes: data,
        });
      }
    );
  }

  render() {
    const RecentEarthquakes = this.state.earthquakes.map((earthquake) => (
      <div>
        <div key={earthquake}>{earthquake}</div>
        <br></br>
      </div>
    ));

    return (
      <div className="App">
        <h1 style={{marginBottom: 20}}>Today's Earthquakes</h1>
        {RecentEarthquakes}
      </div>
    );
  }
}

export default App;
