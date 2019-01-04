import * as React from 'react';
import { Histogram } from './Histogram';
import { Slider } from './Slider';
import { ClassNames } from '@emotion/core';

interface HistogramSliderProps {
  data: number[];
}

export class HistogramSlider extends React.Component<HistogramSliderProps> {
  render() {
    return (
      <ClassNames>
        {({ css }) => (
          <div className={css({ maxWidth: '240px', padding: '10px' })}>
            <Histogram data={this.props.data} />
            <Slider />
          </div>
        )}
      </ClassNames>
    );
  }
}
