
import React, { Component } from 'react'
import './TreeList.css'

class TreeList extends Component {
  state = {
    selected: null,
    selectedTree: this.props.selectedTree
  }
  render() {
    const {
      treeNum,
      treeLevels,
      kettleNums,
      kettleTimes,
      kettlePrices
    } = this.props;
    if (!treeLevels) return <div></div>;
    const trees = [];
    for(var i = 0; i < treeNum; i++) {
      trees.push(this.renderTree(i, treeLevels[i], kettleNums[i], kettleTimes[i], kettlePrices[i]));
    }
    return (
      <div>
        {trees}
      </div>
    )
  }

  onClick(e, id, level, kettlePrice) {
    // console.log('clicked: ', id, level);
    this.props.onClick(id, level, kettlePrice);
    this.setState({selectedTree: id});
  }

  renderTree(id, level, kettleNum, kettleTime, kettlePrice) {
    const selected = this.state.selectedTree === id ? 'selected' : '';
    const className = 'field-tree field-tree-' + id + ' ' + selected;
    const treeSrc = './images/field-tree-lv' + level + '.png';
    const onclick = (e) => this.onClick(e, id, level, kettlePrice);
    const tree = <img alt={'button'} src={treeSrc} className={className} onClick={onclick} />
    const kettleIconSrc = './images/icon-kettle.png';
    const kettleClassName = 'tree-kettle-level ' + (level > 1 ? 'display' : 'hide');
    // const kettleNum = this.getKettleTimes();
    // const meterNum = this.getMeterNum();
    const kettleIcon = (
      <div className={kettleClassName}>
        <img alt={'icon'} key={id} src={kettleIconSrc} className={'tree-kettle-icon'} />
        <span className={'tree-kettle-time'}>{kettleTime}</span>
        <span className={'tree-kettle-num'}>{kettleNum}米</span>
      </div>
    );
    return (
      <div key={id} className={'field field-' + id}>
        {tree}
        {kettleIcon}
      </div>
    );
  }

  getKettleTimes() {
    return 3;
  }
  getMeterNum() {
    return 10;
  }
}

export default TreeList
