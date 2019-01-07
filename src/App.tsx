import React, { Component } from 'react';
import { HistogramSlider } from './components/HistogramSlider';
import { FilterMenuItem } from './components/FilterMenuItem';
import './App.css';
import { histogramData } from './sampleData';
import { ClassNames } from '@emotion/core';

interface AppState {
  value: [number, number];
  show: boolean;
}

class App extends Component<any, AppState> {
  state: AppState = {
    value: [162, 14000],
    show: false,
  };

  getButtonText = () => {
    const [min, max] = this.state.value;

    if (min === 162 && max < 14000) {
      return `Up to $${max} AUD`;
    } else if (min > 162 && max === 14000) {
      return `$${min}+ AUD`;
    } else if (min > 162 && max < 14000) {
      return `$${min} AUD - $${max} AUD`;
    }

    return 'Price';
  };

  getButtonActiveStatus = (isOpen: boolean) => {
    const [min, max] = this.state.value;
    if (min !== 162 || max !== 14000) {
      return true;
    }
    return isOpen;
  };

  toggleShow = (e: React.MouseEvent) => {
    e.preventDefault();
    this.setState(prevState => ({
      show: !prevState.show,
    }));
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
              <HistogramSlider
                min={162}
                max={14000}
                step={1}
                value={this.state.value}
                distance={1000}
                data={histogramData}
                onChange={(value: [number, number]) => {
                  this.setState({ value });
                  console.log(value);
                }}
              />
            </div>
            <div className={css({ padding: '20px' })}>
              <FilterMenuItem
                getButtonText={this.getButtonText}
                getButtonActiveStatus={this.getButtonActiveStatus}
              >
                {({ close }) => (
                  <HistogramSlider
                    min={162}
                    max={14000}
                    step={1}
                    value={this.state.value}
                    distance={1000}
                    data={histogramData}
                    onApply={(value: [number, number]) => {
                      this.setState({ value }, () => {
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
