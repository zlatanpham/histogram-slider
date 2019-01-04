import * as React from 'react';
import { ClassNames, css } from '@emotion/core';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  distance: number;
  onChange?: (value: [number, number]) => void;
}

interface RangeSliderState {
  value: [number, number];
}

export class RangeSlider extends React.Component<
  RangeSliderProps,
  RangeSliderState
> {
  state: RangeSliderState = {
    value: [this.props.value[0], this.props.value[1]],
  };

  private ref = React.createRef<HTMLDivElement>();
  range = this.props.max - this.props.min;

  componentWillReceiveProps(nextProps: RangeSliderProps) {
    const { value } = nextProps;
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  triggerEventMin = () => {
    document.addEventListener('mousemove', this.dragMin);
    document.addEventListener('mouseup', this.clearDocumentEvents);
  };

  triggerEventMax = () => {
    document.addEventListener('mousemove', this.dragMax);
    document.addEventListener('mouseup', this.clearDocumentEvents);
  };

  getCordsProperties = () => {
    // @ts-ignore
    const { x, width } = this.ref.current.getBoundingClientRect();
    return { minX: x, maxX: x + width, width };
  };

  dragMin = (e: MouseEvent) => {
    const { clientX } = e;
    const { minX, width } = this.getCordsProperties();

    const percent = clientX < minX ? 0 : (clientX - minX) / width;
    let min = percent * this.range;

    this.setState(prevState => {
      const [prevStateMin, prevStateMax] = prevState.value;
      const delta = (min - prevStateMin) / this.props.step;
      let addition = 0;
      if (Math.abs(delta) >= 1) {
        addition = Math.floor(delta / this.props.step) * this.props.step;
      }
      min = prevStateMin + addition;
      if (min + this.props.distance > prevStateMax) {
        min = prevStateMax - this.props.distance;
      }
      return { value: [min, prevStateMax] };
    }, this.callback);
  };

  callback = () => {
    if (typeof this.props.onChange === 'function') {
      const { value } = this.state;
      this.props.onChange(value);
    }
  };

  handleDrag = (e: MouseEvent) => {
    const { clientX } = e;
    const { maxX, minX, width } = this.getCordsProperties();
    const percent = clientX > maxX ? 1 : (clientX - minX) / width;
    let max = percent * this.range;

    this.setState((prevState: RangeSliderState) => {
      const [prevStateMin, prevStateMax] = prevState.value;
      const delta = (max - prevStateMax) / this.props.step;
      let addition = 0;
      if (Math.abs(delta) >= 1) {
        addition = Math.floor(delta / this.props.step) * this.props.step;
      }
      max = prevStateMax + addition;
      if (max - this.props.distance < prevStateMin) {
        max = prevStateMin + this.props.distance;
      }
      return { value: [prevStateMin, max] };
    }, this.callback);
  };

  dragMax = (e: MouseEvent) => {
    const { clientX } = e;
    const { maxX, minX, width } = this.getCordsProperties();
    const percent = clientX > maxX ? 1 : (clientX - minX) / width;
    let max = percent * this.range;

    this.setState((prevState: RangeSliderState) => {
      const [prevStateMin, prevStateMax] = prevState.value;
      const delta = (max - prevStateMax) / this.props.step;
      let addition = 0;
      if (Math.abs(delta) >= 1) {
        addition = Math.ceil(delta / this.props.step) * this.props.step;
      }
      max = prevStateMax + addition;
      if (max - this.props.distance < prevStateMin) {
        max = prevStateMin + this.props.distance;
      }
      return { value: [prevStateMin, max] };
    }, this.callback);
  };

  clearDocumentEvents = () => {
    document.removeEventListener('mouseup', this.clearDocumentEvents);
    document.removeEventListener('mousemove', this.dragMin);
    document.removeEventListener('mousemove', this.dragMax);
  };

  handleMinKeydown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    console.log(e.key);
  };

  handleMaxKeydown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    console.log(e.key);
  };

  handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const point = e.clientX;
    const { minX, width } = this.getCordsProperties();
    const range = Math.round(((point - minX) * this.range) / width);

    this.setState((prevState: RangeSliderState) => {
      const [prevStateMin, prevStateMax] = prevState.value;

      if (range <= prevStateMin) {
        return { value: [range, prevStateMax] };
      } else if (range >= prevStateMax) {
        return { value: [prevStateMin, range] };
      }

      if (Math.abs(range - prevStateMin) >= Math.abs(range - prevStateMax)) {
        const nextMaxState =
          range - prevStateMin < this.props.distance
            ? prevStateMin + this.props.distance
            : range;
        return { value: [prevStateMin, nextMaxState] };
      } else {
        const nextMinState =
          prevStateMax - range < this.props.distance
            ? prevStateMax - this.props.distance
            : range;
        return { value: [nextMinState, prevStateMax] };
      }
    }, this.callback);
  };

  render() {
    const [min, max] = this.state.value;
    const right = 100 - (max * 100) / this.range;
    const left = (min * 100) / this.range;

    return (
      <ClassNames>
        {({ css }) => (
          <div className={css({})}>
            <div
              className={css({ width: '100%', position: 'relative' })}
              ref={this.ref}
            >
              <div
                className={css({
                  width: '100%',
                  height: '4px',
                  borderRadius: '999px',
                  backgroundColor: '#d8d8d8',
                })}
                onClick={this.handleBarClick}
              />
              <div
                className={css({
                  position: 'absolute',
                  top: '0px',
                  height: '4px',
                  borderRadius: '999px',
                  backgroundColor: '#d8d8d8',
                })}
                onClick={this.handleBarClick}
                style={{
                  left: left + '%',
                  right: right + '%',
                }}
              >
                <Button
                  className={css({
                    position: 'absolute',
                    top: '-13px',
                    left: '-10px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'rgb(235, 235, 235) 0px 2px 2px',
                    border: '1px solid #d9d9d9',
                  })}
                  role="slider"
                  tabIndex={0}
                  aria-valuenow={min}
                  aria-valuemax={this.props.max}
                  aria-valuemin={this.props.min}
                  aria-disabled="false"
                  onMouseDown={this.triggerEventMin}
                  onKeyDown={this.handleMinKeydown}
                />
                <Button
                  className={css({
                    position: 'absolute',
                    top: '-13px',
                    right: '-10px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'rgb(235, 235, 235) 0px 2px 2px',
                    border: '1px solid #d9d9d9',
                  })}
                  role="slider"
                  tabIndex={0}
                  aria-valuenow={max}
                  aria-valuemax={this.props.max}
                  aria-valuemin={this.props.min}
                  aria-disabled="false"
                  onKeyDown={this.handleMaxKeydown}
                  onMouseDown={this.triggerEventMax}
                />
              </div>
            </div>

            <div className={css({ marginTop: '40px' })}>
              {min} : {max}
            </div>
          </div>
        )}
      </ClassNames>
    );
  }
}

const Button = (props: React.HTMLAttributes<HTMLButtonElement>) => (
  <ClassNames>
    {({ css }) => (
      <button {...props}>
        {[1, 2, 3].map(index => (
          <span
            key={index}
            className={css({
              height: '9px',
              width: '1px',
              backgroundColor: 'rgb(216, 216, 216)',
              marginLeft: '1px',
              marginRight: '1px',
              display: 'inline-block',
            })}
          />
        ))}
      </button>
    )}
  </ClassNames>
);