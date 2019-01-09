import * as React from 'react';
import { ClassNames } from '@emotion/core';

interface HistogramProps {
  data: number[];
  maxHeightPx?: number;
  value: [number, number];
  min: number;
  max: number;
  colors: {
    in: string;
    out: string;
  };
}

interface HistogramState {
  data: number[];
}

export class Histogram extends React.Component<HistogramProps, HistogramState> {
  static defaultProps = {
    maxHeightPx: 20,
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

  mask1: string = Date.now() + '';
  mask2: string = Date.now() + 1 + '';
  numOfColumn: number = this.props.data.length;

  componentWillReceiveProps({ data }: HistogramProps) {
    if (data !== this.props.data) {
      const max = Math.max(...data);
      const heightPxPerUnit = this.props.maxHeightPx! / max;
      const heightData = data.map(v => Math.round(heightPxPerUnit * v));

      this.numOfColumn = data.length;

      this.setState({
        data: heightData,
      });
    }
  }

  render() {
    const { min, max, value, colors, maxHeightPx } = this.props;
    const [vMin, vMax] = value;
    const range = max - min;
    const start = ((vMin - min) * this.numOfColumn) / range;
    const end = start + ((vMax - vMin) * this.numOfColumn) / range;

    return (
      <ClassNames>
        {({ css }) => (
          <>
            <svg
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${this.numOfColumn} ${maxHeightPx}`}
            >
              <defs>
                <mask
                  id={this.mask1}
                  x="0"
                  y="0"
                  width={this.numOfColumn}
                  height={maxHeightPx}
                >
                  >
                  <rect
                    x={start}
                    y="0"
                    fill="white"
                    width={end - start}
                    height={maxHeightPx}
                  />
                </mask>
                <mask
                  id={this.mask2}
                  x="0"
                  y="0"
                  width={this.numOfColumn}
                  height={maxHeightPx}
                >
                  >
                  <rect
                    x="0"
                    y="0"
                    fill="white"
                    width={start}
                    height={maxHeightPx}
                  />
                  <rect
                    x={start}
                    y="0"
                    fill="black"
                    width={end - start}
                    height={maxHeightPx}
                  />
                  <rect
                    x={end}
                    y="0"
                    fill="white"
                    width={this.numOfColumn - end}
                    height={maxHeightPx}
                  />
                </mask>
              </defs>
              {this.state.data.map((height, index) => (
                <React.Fragment key={index}>
                  <rect
                    mask={`url(#${this.mask2})`}
                    x={index}
                    y={maxHeightPx! - height}
                    width="1.2"
                    stroke-width="0"
                    height={height}
                    fill={colors.out}
                  />
                  <rect
                    mask={`url(#${this.mask1})`}
                    x={index}
                    y={maxHeightPx! - height}
                    width="1.2"
                    stroke-width="0"
                    fill={colors.in}
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
