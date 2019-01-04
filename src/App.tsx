import React, { Component } from 'react';
import { HistogramSlider } from './components/HistogramSlider';
import './App.css';
import { histogramData } from './sampleData';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HistogramSlider data={histogramData} />
      </div>
    );
  }
}

export default App;
