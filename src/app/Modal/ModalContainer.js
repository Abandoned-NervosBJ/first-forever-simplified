import React from 'react';
import Modal from 'react-responsive-modal';

export default class App extends React.Component {
  render() {
    const {
      open,
      onClose,
      body,
      btnText,
      bigBtn,
      hideConfirmBtn,
      btn,
      disabled,
    } = this.props;

    let modalClass = bigBtn ? 'modal-btn modal-btn-big' : 'modal-btn';
    if (disabled) modalClass = modalClass + ' ' + 'modal-btn-disabled';
    let confirmBtn = hideConfirmBtn ? '' : (
      <div className={modalClass} onClick={this.onAction.bind(this)}>
        <img alt={'button'} src={'./images/btn-green.png'} className={'main-btn modal-btn-bg'} />
        <div className={'btn-text modal-btn-text'}>{btnText || '确 定'}</div>
      </div>
    );
    if (!!btn) confirmBtn = btn;

    const modalProps = {
      showCloseIcon: false,
      open,
      onClose,
      center: true,
      classNames: {
        modal: 'modal',
        overlay: 'modal-overlay'
      }
    }

    return (
      <div>
        <Modal {...modalProps}>
          <img alt={'button'} src={'./images/btn-close.png'} className={'modal-close-btn'} onClick={onClose}  />
          <div className={'modal-body'}>{body}</div>
          {confirmBtn}
        </Modal>
      </div>
    );
  }

  onAction() {
    const { onClick, onClose } = this.props;
    if (typeof(onClick) === 'function') onClick();
    onClose();
  }
}
