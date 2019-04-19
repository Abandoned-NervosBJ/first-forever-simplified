import React from 'react';
import './Button.css'

export default class Button extends React.Component {
  render() {
    const {
      onClick,
      text
    } = this.props;
    const confirmBtn = (
      <div className={'btn-component'} onClick={onClick}>
        <img alt={'button'} src={'./images/btn-green.png'} className={'btn-component-bg'} />
        <div className={'btn-component-text'}>{text}</div>
      </div>
    );

    return confirmBtn;
  }
}
