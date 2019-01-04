import * as React from 'react';
import { Histogram } from './Histogram';
import { RangeSlider } from './RangeSlider';
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
            <RangeSlider
              min={0}
              max={20000}
              step={2}
              value={[0, 20000]}
              distance={10000}
            />
          </div>
        )}
      </ClassNames>
    );
  }
}
