import * as React from 'react';
import { ClassNames } from '@emotion/core';

interface HistogramProps {
  data: number[];
  maxHeightPx?: number;
  value: [number, number];
  min: number;
  max: number;
}

interface HistogramState {
  data: number[];
}

export class Histogram extends React.Component<HistogramProps, HistogramState> {
  static defaultProps = {
    maxHeightPx: 64,
  };

  mask1: string = Date.now() + '';
  mask2: string = Date.now() + 1 + '';

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

  componentWillReceiveProps({ data }: HistogramProps) {
    if (data !== this.props.data) {
      const max = Math.max(...data);
      const heightPxPerUnit = this.props.maxHeightPx! / max;
      const heightData = data.map(v => Math.round(heightPxPerUnit * v));

      this.setState({
        data: heightData,
      });
    }
  }

  render() {
    const { min, max, value } = this.props;
    const [vMin, vMax] = value;
    const range = max - min;
    const start = ((vMin - min) * 50) / range;
    const end = start + ((vMax - vMin) * 50) / range;
    return (
      <ClassNames>
        {({ css }) => (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 30">
              <defs>
                <mask id={this.mask1} x="0" y="0" width="50" height="30">
                  >
                  <rect
                    x={start}
                    y="0"
                    fill="white"
                    width={end - start}
                    height="30"
                  />
                </mask>
                <mask id={this.mask2} x="0" y="0" width="50" height="30">
                  >
                  <rect x="0" y="0" fill="white" width={start} height="30" />
                  <rect
                    x={start}
                    y="0"
                    fill="black"
                    width={end - start}
                    height="30"
                  />
                  <rect
                    x={end}
                    y="0"
                    fill="white"
                    width={50 - end}
                    height="30"
                  />
                </mask>
              </defs>
              {this.state.data.map((height, index) => (
                <React.Fragment key={index}>
                  <rect
                    mask={`url(#${this.mask2})`}
                    x={index}
                    y={30 - (height * 30) / 100}
                    width="1.15"
                    stroke-width="0"
                    height={height}
                    fill="yellow"
                  />
                  <rect
                    mask={`url(#${this.mask1})`}
                    x={index}
                    y={30 - (height * 30) / 100}
                    width="1.15"
                    stroke-width="0"
                    fill="red"
                    height={height}
                  />
                </React.Fragment>
              ))}
            </svg>
          </>
        )}
      </ClassNames>
    );
  }
}
