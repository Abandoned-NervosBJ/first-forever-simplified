import React from 'react';
import Countdown from 'react-countdown-now';
import Modal from 'react-responsive-modal';

export default class App extends React.Component {
  render() {
    const endTime = Date.now() + 180000;
    const { open } = this.props;
    const modalProps = {
      showCloseIcon: false,
      open,
      // onClose,
      center: true,
      classNames: {
        modal: 'modal-ended',
      }
    };

    const body =(
        <div className={'ended-countdown'}>
          <div className={'ended-text'}>本局游戏结束，距离下一局开始还有：</div>
          <Countdown daysInHours date={endTime} onComplete={this.refreshPage} />
          <div className={'ended-text'}>（如果时间为00:00:00还未开始下一局，<br/>请你点击提取货币，或者种一颗种子，<br/>还可以刷新你的页面和清理缓存哦！）</div>
        </div>
    )
    return (
      <Modal {...modalProps}>
        {body}
      </Modal>
    );
  }
  refreshPage() {
    window.location.reload();
  }
}
