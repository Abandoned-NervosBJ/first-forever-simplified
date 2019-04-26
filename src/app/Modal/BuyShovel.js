import React from 'react';
import ModalContainer from './ModalContainer';

export default class App extends React.Component {
  render() {
    const { treeID, price } = this.props;
    const body =(
      <div>
        <div className={'mb10'}>对{treeID + 1}号田使用一次铲子</div>
        <div className={'mb10'}>铲子价格：{price}wei/个</div>
        <div className={'mb10'}>(用铲子将{treeID + 1}号田植物铲除，消耗{price}wei)</div>
      </div>
    )
    return <ModalContainer {...this.props} body={body} />;
  }
}
