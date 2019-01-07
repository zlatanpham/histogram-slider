import * as React from 'react';
import { ClassNames } from '@emotion/core';

export interface DataModel {
  data: number[];
  min: number;
  max: number;
  step: number;
}

class FakeSearchBar extends React.Component<
  { onChange: (data: DataModel) => void },
  { value: string }
> {
  state = {
    value: '',
  };

  debounceDelay: number | undefined;

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });

    if (this.debounceDelay) {
      window.clearTimeout(this.debounceDelay);
    }

    window.setTimeout(() => {
      if (typeof this.props.onChange === 'function') {
        const min = Math.floor(Math.random() * 400) + 60;
        const data = {
          data: Array.from({ length: 50 }, (v, i) => {
            if (i < 15) {
              return Math.floor(Math.random() * 400);
            }

            if (i > 35) {
              return Math.floor(Math.random() * 100);
            }

            return Math.floor(Math.random() * 700);
          }),
          max: min + Math.floor(Math.random() * 5000) + 5000,
          step: 1,
          min,
        };

        this.props.onChange(data);
      }
    }, 500);
  };
  render() {
    return (
      <ClassNames>
        {({ css }) => (
          <div className={css({ marginBottom: '20px' })}>
            <input
              className={css({
                width: '100%',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                height: '30px',
                boxSizing: 'border-box',
                padding: '2px 10px',
              })}
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
        )}
      </ClassNames>
    );
  }
}

export default FakeSearchBar;
