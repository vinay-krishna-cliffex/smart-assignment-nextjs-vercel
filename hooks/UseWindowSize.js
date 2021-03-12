import React, { Component } from 'react';

const isClient = typeof window === 'object';
export default class useWindowSize extends Component {


  constructor(props) {
    super(props);
    this.state = {
      windowSize: {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      }
    }
  }

  useEffectUse = () => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      this.useState({ windowSize: this.state.windowSize });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }; // Empty array ensures that effect is only run on mount and unmount

  componentDidMount() {
    this.useEffectUse();
  }

  render() {
    return windowSize;
  }
}
