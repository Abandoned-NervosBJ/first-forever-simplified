import React, { Component } from 'react';
import {GameContract } from './simpleStore'
import nervos from './nervos'

/////
import TreeList from './app/TreeList/TreeList';
import EventList from './app/Event/EventList';
import Countdown from 'react-countdown-now';
import BuySeed from './app/Modal/BuySeed';
import BuyKettle from './app/Modal/BuyKettle';
import BuyShovel from './app/Modal/BuyShovel';
import Ended from './app/Modal/Ended';
import WithdrawModal from './app/Modal/Withdraw';
import './App.css';
/////

window.addEventListener('citaWebDebuggerReady', () => {
    window.addMessenger(nervos);
    nervos.base.getDefaultAccount().then(defaultAccount => console.info("cita addr >>>>", defaultAccount))
})

const treeNum = 9;

const createTx = (quota, value, untilNum) => {
  let tx = {
    from: nervos.base.accounts.wallet[0].address,
    privateKey: nervos.base.accounts.wallet[0].privateKey,
    nonce: 999999,
    quota: quota*1000000,
    chainId: 1,
    version: 1,
    value: value,
    validUntilBlock: untilNum,
  };

  return tx;
}

const toFloatMoney = (strNum) => {
  const float = parseFloat(strNum);
  if (float === 0) return 0;
  if (float < 10) return float.toFixed(4);
  return float < 1000 ? float.toFixed(3) : float.toFixed(2)
}

class App extends Component {
  state = {
    treeNum: 0,
    selectedTree: 0,
    selectedTreeKettlePrice: 5,
    myExpectedReward: 0,
    web3: null,
    accounts: null,
    contract: null,
    currRoundInfo: null,
    openSeedModal: false,
    openKettleModal: false,
    openShovelModal: false,
    openWithdrawModal: false,
    eventList: [],
    openEndedModal: false,
    playerEarnings: 0,
  };

  componentDidMount = async() => {
    try {
      // Use web3 to get the user's accounts. Take account into the old version of web3.
      // const accounts = await web3.eth.getAccounts();
      // const accounts = await web3.eth.getAccounts() || [this.web3.eth.defaultAccount];

      const self = this;
      const accounts = nervos.base.accounts;
      // Get the contract instance.
      const instance = GameContract;
      const web3 = nervos;
      this.setState({ web3, accounts, contract: instance }, this.updateCurrRoundInfo);

    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (!this.state.currRoundInfo) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const {
      myExpectedReward,
      currRoundInfo,
      selectedTree
    } = this.state;

    const {
      currRoundNum,
      endTime,
      currPot,
      treeLevels,
      kettleNums,
      kettleTimes,
      kettlePrices,
    } = currRoundInfo;

    const eventList = this.renderEventList();

    const withdrawBtn = (
      <div className={'withdraw-btn'} onClick={(e) => this.onOpenModal('openWithdrawModal')}>
        <img alt={'button'} src={'./images/btn-green.png'} className={'main-btn withdraw-btn-bg'} />
        <div className={'btn-text withdraw-btn-text'}>提现</div>
      </div>
    );

    console.log('myExpectedReward is: ', myExpectedReward);
    const lastOneReward = this.getLastOneReward();

    const ruleBtn = (
      <div className={'rule-btn'}>
        <img alt={'button'} src={'./images/btn-green.png'} className={'main-btn rule-btn-bg'} />
        <div className={'btn-text rule-btn-text'}><a href='#' target='_blank'></a></div>
      </div>
    );

    const btnGroup = this.renderBtnGroup();
    const treeProps = {
      treeLevels,
      kettleNums,
      kettleTimes,
      treeNum,
      kettlePrices,
      selectedTree,
      onClick: this.onClick.bind(this),
    }

    const countDown = (
      <div className={'header-info countdown'}>
        <Countdown daysInHours date={endTime} onComplete={this.openEndedModal} />
      </div>
    );

    const treeList = <TreeList {...treeProps} />;
    const buySeed = this.renderBuySeedModal();
    const buyKettle = this.renderBuyKettleModal();
    const buyShovel = this.renderBuyShovelModal();
    const endedModal = this.renderEndedModal();
    const withdrawModal = this.renderWithdrawModal();

    return (
      <div className='main'>
        <img alt={'bg'} src={'./images/bg.png'} className={'bg'} />
        <div className={'header-info round-num'}>{currRoundNum}</div>
        <div className={'header-info reward yellow-gradient'}>{toFloatMoney(currPot * 0.9)}</div>
        <div className={'header-info last-reward'}>{toFloatMoney(lastOneReward)}wei</div>
        {countDown}
        {eventList}
        {withdrawBtn}
        {btnGroup}
        {treeList}
        <div className={'my-expected-reward yellow-gradient'}>
          { toFloatMoney(myExpectedReward) }
        </div>
        {buySeed}
        {buyKettle}
        {buyShovel}
        {endedModal}
        {withdrawModal}
        {ruleBtn}
      </div>
    );
  }

  // convert bignumber wei to ether, return string
  convertBNWeiToEth = (bnWei) => {
    return nervos.utils.fromWei(bnWei.toString())
  }

  handleTx = async(tx) => {
    if (tx.hash) {
        let receipt = await nervos.listeners.listenToTransactionReceipt(tx.hash);
        if (!receipt.errorMessage) {
          return true;
        } else {
          console.error(receipt.errorMessage)
          return false;
        }
      } else {
        console.error('No Transaction Hash Received')
          return false;
      }

  }

  updateSelectedTreeKettlePrice() {
    const { selectedTree, selectedTreeKettlePrice, currRoundInfo } = this.state;

    if (!currRoundInfo) return;

    const newPrice = currRoundInfo.kettlePrices[selectedTree];
    if (newPrice !== selectedTreeKettlePrice) {
      this.setState({ selectedTreeKettlePrice: newPrice })
    }
  }

  getPlayerEarnings = async() => {
    const { accounts, contract } = this.state;

    const response = await contract.methods.getPlayerEarnings(accounts.wallet[0].address).call();
    console.log('getPlayerEarnings response is: ', response);

    this.setState({
      playerEarnings: parseFloat(this.convertBNWeiToEth(response[0])) + parseFloat(this.convertBNWeiToEth(response[1])) + parseFloat(this.convertBNWeiToEth(response[2]))
    });
  }

  openEndedModal = () => {
    const { playerEarnings } = this.state;
    if (playerEarnings) {
      this.setState({ openWithdrawModal: true })
    } else {
      this.setState({ openEndedModal: true })
    }
  }

  renderBtnGroup() {
    const { currShovelPrice, treeLevels } = this.state.currRoundInfo;
    const { selectedTree } = this.state;
    const seedPrice = this.getSeedPrice();
    const kettlePrice = this.getKettlePrice();
    const treeLevel = treeLevels[selectedTree];
    const seedClass = treeLevel === 0 ? '' : ' btn-disabled';
    const kettleClass = treeLevel > 0 ? '' : ' btn-disabled';
    const shovelClass = treeLevel > 0 ? '' : ' btn-disabled';
    const seedProps = {
      alt: 'button',
      src: './images/btn-seed.png',
      className: 'btn btn-seed' + seedClass,
    }
    const kettleProps = {
      alt: 'button',
      src: './images/btn-kettle.png',
      className: 'btn btn-kettle' + kettleClass,
    }
    const shovelProps = {
      alt: 'button',
      src: './images/btn-shovel.png',
      className: 'btn btn-shovel' + shovelClass,
    }
    if (treeLevel === 0) {
      seedProps.onClick = (e) => this.onOpenModal('openSeedModal');
    } else {
      kettleProps.onClick = (e) => this.onOpenModal('openKettleModal');
      shovelProps.onClick = (e) => this.onOpenModal('openShovelModal');
    }
    const btnGroup = (
      <div className={'btn-group'}>
        <img {...seedProps} />
        <div className={'price seed-price'}>{seedPrice}wei</div>
        <img {...kettleProps} />
        <div className={'price kettle-price'}>{kettlePrice}wei</div>
        <img {...shovelProps} />
        <div className={'price shovel-price'}>{currShovelPrice}wei</div>
      </div>
    );
    return btnGroup;
  }

  renderEndedModal() {
    const {
      openEndedModal,
    } = this.state;
    const endedProps = {
      open: openEndedModal,
      hideConfirmBtn: true,
    };
    return openEndedModal ? <Ended {...endedProps} /> : '';
  }

  renderBuySeedModal() {
    const {
      openSeedModal,
      selectedTree,
    } = this.state;

    const seedProps = {
      open: openSeedModal,
      onClose: (e) => this.onCloseModal('openSeedModal'),
      price: 1,
      onClick: this.buySeed,
      treeID: selectedTree,
    };
    return openSeedModal ? <BuySeed {...seedProps} /> : '';
  }

  renderBuyKettleModal() {
    const {
      openKettleModal,
      selectedTree,
      selectedTreeKettlePrice,
      currRoundInfo,
    } = this.state;
    const { kettleTimes, } = currRoundInfo;

    const kettleProps = {
      open: openKettleModal,
      onClose: (e) => this.onCloseModal('openKettleModal'),
      price: selectedTreeKettlePrice,
      onClick: this.buyKettle,
      treeID: selectedTree,
      kettleTime: kettleTimes[selectedTree],
    };

    return openKettleModal ? <BuyKettle {...kettleProps} /> : '';
  }

  renderBuyShovelModal() {
    const {
      openShovelModal,
      selectedTree,
      currRoundInfo,
    } = this.state;
    const { currShovelPrice } = currRoundInfo;
    const shovelProps = {
      open: openShovelModal,
      onClose: (e) => this.onCloseModal('openShovelModal'),
      price: currShovelPrice,
      onClick: this.buyShovel,
      treeID: selectedTree,
    };
    return openShovelModal ? <BuyShovel {...shovelProps} /> : '';
  }

  renderWithdrawModal() {
    const {
      accounts,
      contract,
      openWithdrawModal
    } = this.state;

    const withdrawProps = {
      open: this.state.openWithdrawModal,
      onClose: (e) => this.onCloseModal('openWithdrawModal'),
      accounts,
      contract,
      convertBNWeiToEth: this.convertBNWeiToEth,
    };

    return openWithdrawModal ? <WithdrawModal {...withdrawProps} /> : '';
  }

  renderEventList() {
    return <EventList eventList={this.state.eventList}/>
  }

  // use seed to create a tree
  buySeed = async(treeID) => {
    const { accounts, contract } = this.state;
    const value = 1;

    let utilNum = await nervos.base.getBlockNumber() + 88;
    let tx = await contract.methods.buySeed(this.state.selectedTree).send(createTx(1, value, utilNum));

    if (tx.hash) {
        let receipt = await nervos.listeners.listenToTransactionReceipt(tx.hash);
        if (!receipt.errorMessage) {
          this.updateCurrRoundInfo();

          let addr = nervos.base.accounts.wallet[0].address;
          let inform = {transactionHash: tx.hash, returnValues: {from: addr, name: "buySeed", treeID: treeID } };
          this.setState({ eventList: this.state.eventList.concat([inform]) });

        } else {
          console.error(receipt.errorMessage)
        }
      } else {
        console.error('No Transaction Hash Received')
      }
  };

  buyKettle = async (selectedKettleNum, treeID) => {
    const {
      accounts,
      contract,
      selectedTree,
      selectedTreeKettlePrice,
    } = this.state;

    try {
      let utilNum = await nervos.base.getBlockNumber() + 88;
      const value =  selectedTreeKettlePrice * selectedKettleNum;
      let tx = await contract.methods.buyKettle(selectedTree).send(createTx(1,value,utilNum));

      if (tx.hash) {
        let receipt = await nervos.listeners.listenToTransactionReceipt(tx.hash);
        if (!receipt.errorMessage) {

          this.updateCurrRoundInfo();
          let addr = nervos.base.accounts.wallet[0].address;
          let inform = {transactionHash: tx.hash, returnValues: {from: addr, name: "buyKettle", treeID: treeID } };
          this.setState({ eventList: this.state.eventList.concat([inform]) });
        } else {
          console.error(receipt.errorMessage)
        }
      } else {
        console.error('No Transaction Hash Received')
      }
    } catch (error) {
      console.error('buyKettle error: ', error);
    }
  };

  buyShovel = async(treeID) => {
    console.log('buyShovel');
    const {
      accounts,
      contract,
      selectedTree,
      currRoundInfo,
    } = this.state;

    const value = parseInt(currRoundInfo.currShovelPrice);

    try {
        let utilNum = await nervos.base.getBlockNumber() + 88;
        let tx = await contract.methods.buyShovel(selectedTree).send(createTx(1, value, utilNum));

      if (tx.hash) {
        let receipt = await nervos.listeners.listenToTransactionReceipt(tx.hash);
        if (!receipt.errorMessage) {
          this.updateCurrRoundInfo();
          let addr = nervos.base.accounts.wallet[0].address;
          let inform = {transactionHash: tx.hash, returnValues: {from: addr, name: "buyShovel", treeID: treeID } };
          this.setState({ eventList: this.state.eventList.concat([inform]) });
        } else {
          console.error(receipt.errorMessage)
        }
      } else {
        console.error('No Transaction Hash Received')
      }

    } catch (error) {
      console.error('buyShovel error: ', error);
    }

  }

  getTreeKettleNum() {
    const {
      selectedTree,
      currRoundInfo
    } = this.state.currRoundInfo;
    return currRoundInfo.kettleNums[selectedTree];
  };

  onClick(id, level, kettlePrice) {
    console.log('app container: id, level, kettlePrice: ', id, level, kettlePrice)

    this.setState({
      selectedTree: id,
      selectedTreeKettlePrice: kettlePrice
    });
  }

  updateCurrRoundInfo() {
    alert(/更新中/)
    this.getCurrRoundInfo();
    this.getPlayerExpectedReward();
    this.getPlayerEarnings();
  };

  getCurrRoundInfo = async () => { // 获取信息

    const { contract } = this.state;
    let response;
    try {
      response = await contract.methods.getCurrRoundInfo().call();
      console.log('getCurrRoundInfo response is: ', response);
    } catch (error) {
      console.log('getCurrRoundInfo error: ', error)
    }

    if (!response) return null;

    const result = {
      currRoundNum: parseInt(response[0]),
      currPot:  response[1],
      endTime: parseInt(response[2]),
      currShovelPrice: response[3],
      treeLevels: response[4].map(x => parseInt(x)),
      kettleNums: response[5].map(x => parseInt(x)),
      kettleTimes: response[6].map(x => parseInt(x)),
      kettlePrices: response[7],
      isRoundEnded: response[8],
    }

    this.setState({
      currRoundInfo: result,
    }, this.updateSelectedTreeKettlePrice);

    return result;
  }

  getPlayerExpectedReward = async() => {
    const { contract, accounts } = this.state;
    const reward = await contract.methods.getPlayerExpectedReward(accounts.wallet[0].address).call();

    if (!reward) reward = 0;

    this.setState({
      myExpectedReward: this.convertBNWeiToEth(reward),
    });
  }

  getLastOneReward() {
    return this.state.currRoundInfo && this.state.currRoundInfo.currPot * 0.1;
  }

  getSeedPrice() {
    return 1;
  }

  getKettlePrice() {
    return this.state.selectedTreeKettlePrice || 5;
  }

  getShovelPrice() {
    return this.state.currShovelPrice;
  }

  // modalType: openSeedModal, openKettleModal, openShovelModal
  onOpenModal = (modalType) => {
    console.log('onOpenModal, modalType is: ', modalType);
    this.setState({ [modalType]: true });
  };

  onCloseModal = (modalType) => {
    console.log('onCloseModal, modalType is: ', modalType);
    this.setState({ [modalType]: false });
  };

  startNextRound = async() => {
    const { contract, accounts } = this.state;
    const from = this.myAccount;
    try {
      contract.methods.startNextRound({ from: accounts.wallet[0].address }); /////
    } catch (error) {
      console.log('startNextRound error: ', error);
    }
  }

}

export default App;