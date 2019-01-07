import React, { Component } from 'react';
import { HistogramSlider } from './components/HistogramSlider';
import './App.css';
import { histogramData } from './sampleData';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HistogramSlider
          min={162}
          max={14000}
          step={1}
          value={[162, 14000]}
          distance={1000}
          data={histogramData}
          onChange={(value: [number, number]) => {
            console.log(value);
          }}
          onApply={(value: [number, number]) => {
            console.log(value);
          }}
        />
      </div>
    );
  }
}

export default App;
