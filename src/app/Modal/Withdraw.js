import React from 'react';
import ModalContainer from './ModalContainer';

export default class App extends React.Component {
  state = {
    ethBalance: 0,
    vipBalance: 0,
    commBalance: 0,
    isAdmin: false,
  }
  componentDidMount() {
    this.getPlayerEarnings();
  }
  render() {
    const { ethBalance, vipBalance, commBalance, isAdmin } = this.state;
    console.log('withdraw: ', ethBalance, vipBalance, commBalance, isAdmin)
    const adminNode = isAdmin ? <div className={'mb10'}>社区返还eth: {commBalance.toFixed(5)} eth</div> : '';
    const total = ethBalance + vipBalance + commBalance;
    const body =(
      <div>
        <div className={'mb10'}>游戏中剩余eth: {ethBalance.toFixed(5)} eth</div>
        {adminNode}
        <div className={'mb10'}>合计: {total.toFixed(5)} eth</div>
      </div>
    )
    const disabled = !total;
    const modalProps = {
      ...this.props,
      onClick: disabled ? null : this.withdraw,
      body,
      btnText: '全部提取至钱包',
      bigBtn: true,
      disabled,
    }
    return <ModalContainer {...modalProps} />;
  }

  withdraw = async() => {
    const {
      accounts,
      contract,
    } = this.props;
    const { isAdmin } = this.state;
    const withdrawFunc = isAdmin ? contract.withdrawComm : contract.withdraw;
    try {
      await withdrawFunc({
        from: accounts[0],
        gas: 800000,
      });
    } catch (error) {
      console.error('withdraw error: ', error);
    }
  }

  getPlayerEarnings = async() => {
    const { contract, accounts, convertBNWeiToEth } = this.props;
    const response = await contract.getPlayerEarnings(accounts[0]);
    console.log('getPlayerEarnings response is: ', response);
    this.setState({
      ethBalance: parseFloat(convertBNWeiToEth(response[0])),
      vipBalance: parseFloat(convertBNWeiToEth(response[1])),
      commBalance: parseFloat(convertBNWeiToEth(response[2])),
      isAdmin: response[3],
    });
  }
}
