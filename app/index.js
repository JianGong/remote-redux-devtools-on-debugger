import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import DevTools from 'remotedev-app';

// Now disabled buttonbar
// prevent setting from previous UI settings
localStorage.removeItem('s:hostname');
localStorage.removeItem('s:port');

const dockSizeKey = 'remotedev-dock-size';

class DevToolsDock extends Component {
  static propTypes = {
    size: PropTypes.number,
    options: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { size: props.size || 0.5 };
  }

  handleSizeChange = eventSize => {
    let size = eventSize > 1 ? 1 : eventSize;
    size = size < 0.1 ? 0.1 : size;
    localStorage.setItem(dockSizeKey, size);
    this.setState({ size });
  };

  render() {
    return (
      <Dock
        position="right"
        dimMode="transparent"
        size={this.state.size}
        isVisible
        onSizeChange={this.handleSizeChange}
      >
        <DevTools socketOptions={this.props.options} noButtonBar />
      </Dock>
    );
  }
}

render(
  <DevToolsDock
    size={Number(localStorage.getItem(dockSizeKey))}
    options={window.remotedevOptions}
  />,
  document.getElementById('remote-redux-devtools-on-debugger')
);
