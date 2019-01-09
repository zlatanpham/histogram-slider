import React, { Component } from 'react';
import { HistogramSlider } from './components/HistogramSlider';
import { FilterMenuItem } from './components/FilterMenuItem';
import './App.css';
import { histogramData } from './sampleData';
import { ClassNames } from '@emotion/core';
import FakeSearchBar, { DataModel } from './components/FakeSearchBar';

interface AppState {
  value: [number, number];
  showOverlay: boolean;
  data: DataModel;
}

class App extends Component<any, AppState> {
  state: AppState = {
    value: [162, 14000],
    showOverlay: false,
    data: {
      data: histogramData,
      min: 162,
      max: 14000,
      step: 1,
      distance: 1200,
    },
  };

  storedValue: undefined | [number, number];

  getButtonText = () => {
    const [min, max] = this.state.value;

    if (min === this.state.data.min && max < this.state.data.max) {
      return `Up to $${max} AUD`;
    } else if (min > this.state.data.min && max === this.state.data.max) {
      return `$${min}+ AUD`;
    } else if (min > this.state.data.min && max < this.state.data.max) {
      return `$${min} AUD - $${max} AUD`;
    }

    return 'Price';
  };

  getButtonActiveStatus = (isOpen: boolean) => {
    const [min, max] = this.state.value;
    if (min !== this.state.data.min || max !== this.state.data.max) {
      return true;
    }
    return isOpen;
  };

  handleChange = (data: DataModel) => {
    this.setState({ data, value: [data.min, data.max] }, () => {
      this.storedValue = undefined;
    });
  };

  render() {
    return (
      <ClassNames>
        {({ css }) => (
          <div className={css({ display: 'flex', minHeight: '100vh' })}>
            <div
              className={css({
                width: '280px',
                padding: '20px',
                borderRight: '1px solid #d9d9d9',
              })}
            >
              <FakeSearchBar onChange={this.handleChange} />
              <HistogramSlider
                colors={{
                  in: '#D7D8D8',
                  out: '#EEEEEE',
                }}
                min={this.state.data.min}
                max={this.state.data.max}
                step={this.state.data.step}
                value={this.state.value}
                distance={this.state.data.distance}
                data={this.state.data.data}
                onChange={(value: [number, number]) => {
                  this.setState({ value });
                }}
              />
            </div>
            {this.state.showOverlay && (
              <div
                className={css({
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                })}
                onClick={() => {
                  this.setState({ showOverlay: false }, () => {
                    if (
                      this.storedValue &&
                      (this.storedValue[0] !== this.state.value[0] ||
                        this.storedValue[1] !== this.state.value[1])
                    ) {
                      console.log('setState');
                      this.setState({ value: this.storedValue });
                    }
                  });
                }}
              />
            )}
            <div className={css({ padding: '20px', position: 'relative' })}>
              <FilterMenuItem
                onToggle={state => {
                  this.setState({ showOverlay: state });
                }}
                isOpen={this.state.showOverlay}
                getButtonText={this.getButtonText}
                getButtonActiveStatus={this.getButtonActiveStatus}
              >
                {({ close }) => (
                  <HistogramSlider
                    colors={{
                      in: '#99ccc7',
                      out: '#cceae8',
                    }}
                    min={this.state.data.min}
                    max={this.state.data.max}
                    step={this.state.data.step}
                    value={this.state.value}
                    distance={this.state.data.distance}
                    data={this.state.data.data}
                    onChange={(value: [number, number]) => {
                      this.storedValue = value;
                    }}
                    onApply={(value: [number, number]) => {
                      this.setState({ value, showOverlay: false }, () => {
                        close();
                      });
                    }}
                  />
                )}
              </FilterMenuItem>
            </div>
          </div>
        )}
      </ClassNames>
    );
  }
}

export default App;
