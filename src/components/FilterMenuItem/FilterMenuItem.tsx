import * as React from 'react';
import { ClassNames } from '@emotion/core';

interface StateAndHelpersType {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

type Partial<T> = { [P in keyof T]?: T[P] };

interface FilterMenuItemProps {
  isOpen?: boolean;
  getButtonText?: (isOpen: boolean) => string;
  getButtonActiveStatus?: (isOpen: boolean) => boolean;
  children: (arg: StateAndHelpersType) => JSX.Element;
}

interface FilterMenuItemState {
  isOpen: boolean;
}

type StateToSetType =
  | ((prevState: FilterMenuItemState) => Partial<FilterMenuItemState>)
  | Partial<FilterMenuItemState>;

export class FilterMenuItem extends React.Component<FilterMenuItemProps> {
  state: FilterMenuItemState = {
    isOpen: false,
  };

  constructor(props: FilterMenuItemProps) {
    super(props);
  }

  static defaultProps = {
    stateReducer: (
      state: FilterMenuItemState,
      stateToSet: FilterMenuItemState,
    ) => stateToSet,
  };

  toggle = () => {
    this.setState((prevState: FilterMenuItemState) => ({
      isOpen: !prevState.isOpen,
      active: !prevState.isOpen,
    }));
  };

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  getStateAndHelpers(): StateAndHelpersType {
    return {
      toggle: this.toggle,
      open: this.open,
      close: this.close,
      isOpen: this.state.isOpen,
    };
  }

  getButtonText = () => {
    if (typeof this.props.getButtonText === 'function') {
      return this.props.getButtonText(this.state.isOpen);
    }

    return 'My Buttoon';
  };

  getButtonActiveStatus = () => {
    if (typeof this.props.getButtonActiveStatus === 'function') {
      return this.props.getButtonActiveStatus(this.state.isOpen);
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
            {this.state.isOpen && (
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
