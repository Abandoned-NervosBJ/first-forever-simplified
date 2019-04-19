
import React, { Component } from 'react'
import autoscroll from 'autoscroll-react';
import './EventList.css'

class EventList extends Component {
  render() {
    const { eventList } = this.props;
    return (
      <div className={'event-list-container'}>
        {
          eventList.map(event => this.renderEvent(event))
        }
      </div>
    )
  }
  
  renderEvent(event) {
    const {
      transactionHash,
      returnValues
    } = event;
    const { from, name, treeID } = returnValues;
    let text = from.substr(from.length - 4) + '在' + (parseInt(treeID, 10) + 1) + '号地';
    if (name === 'buySeed') {
      text += '种了一棵树';
    } else if (name === 'buyKettle') {
      text += '浇了一次水';
    } else if (name === 'buyShovel') {
      text += '使用了一把铲子';
    } else {
      text += '玩了一次';
    }

    return (
      <div key={transactionHash} className={'mb5 event-item'}>{text}</div>
    )
  }
}

export default autoscroll(EventList, {
  isScrolledDownThreshold: 100
});
