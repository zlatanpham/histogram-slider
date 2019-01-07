import * as React from 'react';
import { ClassNames } from '@emotion/core';

interface StateAndHelpersType {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

interface FilterMenuItemProps {
  isOpen?: boolean;
  getButtonText?: (isOpen: boolean) => string;
  getButtonActiveStatus?: (isOpen: boolean) => boolean;
  children: (arg: StateAndHelpersType) => JSX.Element;
  onToggle?: (state: boolean, stateAndHelpers: StateAndHelpersType) => void;
}

interface FilterMenuItemState {
  isOpen: boolean;
}
export class FilterMenuItem extends React.Component<FilterMenuItemProps> {
  state: FilterMenuItemState = {
    isOpen: false,
  };

  getIsOpen = (
    state: FilterMenuItemState = this.state,
    props: FilterMenuItemProps = this.props,
  ): boolean => {
    return props.isOpen !== undefined ? props.isOpen : state.isOpen;
  };

  isOnControlled = (): boolean => {
    return this.props.isOpen !== undefined;
  };

  setIsOpenState = (state = !this.getIsOpen()) => {
    const cb =
      this.getIsOpen() === state
        ? () => {}
        : () => {
            typeof this.props.onToggle === 'function' &&
              this.props.onToggle(state, this.getStateAndHelpers());
          };
    this.setState({ isOpen: state }, cb);
  };

  setIsOpenOn = this.setIsOpenState.bind(this, true);
  setIsOpenOff = this.setIsOpenState.bind(this, false);
  toggle = this.setIsOpenState.bind(this, undefined);

  getStateAndHelpers(): StateAndHelpersType {
    return {
      toggle: this.toggle,
      open: this.setIsOpenOn,
      close: this.setIsOpenOff,
      isOpen: this.getIsOpen(),
    };
  }

  getButtonText = () => {
    if (typeof this.props.getButtonText === 'function') {
      return this.props.getButtonText(this.state.isOpen);
    }

    return 'My Button';
  };

  getButtonActiveStatus = () => {
    if (typeof this.props.getButtonActiveStatus === 'function') {
      return this.props.getButtonActiveStatus(this.getIsOpen());
    }

    return this.state.isOpen;
  };

  render() {
    return (
      <ClassNames>
        {({ css }) => (
          <div>
            <button
              onClick={this.toggle}
              className={css(
                this.getButtonActiveStatus()
                  ? { color: '#ffffff', backgroundColor: '#232323' }
                  : {},
              )}
            >
              {this.getButtonText()}
            </button>
            {this.getIsOpen() && (
              <div
                className={css({
                  position: 'absolute',
                  top: 50,
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #d9d9d9',
                  backgroundColor: '#ffffff',
                  zIndex: 9999,
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                })}
              >
                {this.props.children(this.getStateAndHelpers())}
              </div>
            )}
          </div>
        )}
      </ClassNames>
    );
  }
}
