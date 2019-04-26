import React from 'react';
import ModalContainer from './ModalContainer';

export default class App extends React.Component {
  render() {
    const { treeID, price } = this.props;
    const body =(
      <div>
        <div className={'mb10'}>对{treeID + 1}号田种下一颗种子</div>
        <div className={'mb10'}>种子价格：{price}wei/个</div>
        <div className={'mb10'}>(种一颗种子，消耗{price}wei)</div>
      </div>
    )
    return <ModalContainer {...this.props} body={body} />;
  }
}
