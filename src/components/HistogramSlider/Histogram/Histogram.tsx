import * as React from 'react';
import { ClassNames } from '@emotion/core';

interface HistogramProps {
  data: number[];
  maxHeightPx?: number;
}

interface HistogramState {
  data: number[];
}

export class Histogram extends React.Component<HistogramProps, HistogramState> {
  static defaultProps = {
    maxHeightPx: 64,
  };

  constructor(props: HistogramProps) {
    super(props);

    const { data, maxHeightPx } = this.props;
    const max = Math.max(...data);
    const heightPxPerUnit = maxHeightPx! / max;
    const heightData = data.map(v => Math.round(heightPxPerUnit * v));

    this.state = {
      data: heightData,
    };
  }

  render() {
    return (
      <ClassNames>
        {({ css }) => (
          <div
            className={css({
              width: '220px',
              display: 'flex',
              alignItems: 'flex-end',
            })}
          >
            {this.state.data.map((height, index) => (
              <div
                key={index}
                className={css({
                  width: '2%',
                  backgroundColor: '#d8d8d8',
                  height: `${height}px`,
                })}
              />
            ))}
          </div>
        )}
      </ClassNames>
    );
  }
}
