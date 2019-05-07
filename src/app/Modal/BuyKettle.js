import React from 'react';
import ModalContainer from './ModalContainer';

export default class App extends React.Component {
  constructor() {
    super();
    this.inputRef = React.createRef();
  }

  state = {
    kettleNum: 1
  }

  componentDidMount() {
    this.updateInput();
  }

  componentWillUnmount() {
    this.setState({
      kettleNum: 1
    })
  }

  render() {
    const {
      treeID,
      price,
      kettleTime,
    } = this.props;

    const { kettleNum } = this.state;

    const input = (
      <div className={'kettle-input-container'}>
        <img alt={'button'} src={'./images/btn-substract.png'} className={'kettle-input-btn btn-substract'} onClick={this.substract} />
        <input onChange={this.onChange} className={'kettle-input'} ref={this.inputRef} defaultValue={1} />
        <img alt={'button'} src={'./images/btn-add.png'} className={'kettle-input-btn btn-add'} onClick={this.add} />
      </div>
    )

    const body =(
      <div>
        <div className={'mb10'}>对{treeID + 1}号树进行第{kettleTime + 1}次浇水</div>
        <div className={'mb10'}>水壶价格：{price}wei/次</div>
        <div className={'mb10'}>输入数量</div>
        {input}
        <div  className={'mt10'}>(浇{kettleNum}次水，消耗{kettleNum * price}wei)</div>
      </div>
    )

    return <ModalContainer {...this.props} onClick={this.onAction()} body={body} />;
  }

  onAction = () => {
    console.log('buykettle, onclick: ', this.state.kettleNum)
    this.props.onClick(this.state.kettleNum, this.props.treeID);
  }

  substract = () => {
    let value = parseInt(this.state.kettleNum, 10) - 1;
    console.log('substract', value)
    if (value < 1) value = 1;
    this.setState({
      kettleNum: value
    }, this.updateInput);
  }

  add = () => {
    const value = parseInt(this.state.kettleNum, 10) + 1;
    console.log('add', value)
    this.setState({
      kettleNum: value
    }, this.updateInput);
  }

  updateInput(num = 1) {
    if (!this.inputRef.current) return;
    this.inputRef.current.value = parseInt(this.state.kettleNum, 10) || num;
  }

  onChange = (e) => {
    console.log('onchange', e.target.value)
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1;
    this.setState({
      kettleNum: value
    }, this.updateInput);
  }

}
