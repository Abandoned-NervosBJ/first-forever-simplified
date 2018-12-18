import React from 'react'
import './App.css'
import { transaction, simpleStoreContract } from './simpleStore'
import nervos from './nervos'

const Submit = ({ text = '愿此刻永恒', onClick, disabled = false }) => (
  <button
    onClick={onClick}
    className={`confirm__button--primary ${disabled ? 'confirm__button--disabled' : ''}`}
    disabled={disabled}
  >
    {text}
  </button>
)

const Record = ({ time, text, hasYearLabel }) => {
  const _time = new Date(+time);
  const timeFormatter = time => ('' + time).padStart(2, '0');

  return (
    <div className="list__record--container">
      {hasYearLabel ? <div className="list__record--year">{_time.getFullYear()}</div> : null}
      <span>{`${_time.getMonth() + 1}-${timeFormatter(_time.getDate())} ${timeFormatter(_time.getHours())}:${timeFormatter(_time.getMinutes())}`}</span>
      <div>{text}</div>
    </div>
  )
}

const timeFormatter = time => ('' + time).padStart(2, '0')

const submitTexts = {
  normal: '愿此刻永恒',
  submitting: '保存中',
  submitted: '保存成功',
}

class App extends React.Component {
  state = {
    text: '',
    time: new Date(),
    submitText: submitTexts.normal,
    errorText: '',
    times: [],
    texts: [],
  }
  componentDidMount() {
    this.fetchList();
  }
  handleInput = e => {
    this.setState({ text: e.target.value })
  }
  handleSubmit = e => {
    const { time, text } = this.state
    nervos.base
      .getBlockNumber()
      .then(current => {
        const tx = {
          ...transaction,
          validUntilBlock: +current + 88,
        }
        this.setState({
          submitText: submitTexts.submitting,
        })
        return simpleStoreContract.methods.add(text, +time).send(tx)
      })
      .then(res => {
        if (res.hash) {
          return nervos.listeners.listenToTransactionReceipt(res.hash)
        } else {
          throw new Error('No Transaction Hash Received')
        }
      })
      .then(receipt => {
        if (!receipt.errorMessage) {
          this.setState({ submitText: submitTexts.submitted })
        } else {
          throw new Error(receipt.errorMessage)
        }
      })
      .then(() => {
        // FIXME: seems it does not work
        this.fetchList();
      })
      .catch(err => {
        this.setState({ errorText: JSON.stringify(err) })
      })
  }
  fetchList() {
    const from = nervos.base.accounts.wallet[0] ? nervos.base.accounts.wallet[0].address : '';
    simpleStoreContract.methods
      .getList()
      .call({
        from,
      })
      .then(times => {
        times.reverse()
        this.setState({ times })
        return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({ from })))
      })
      .then(texts => {
        this.setState({ texts })
      })
      .catch(console.error)
  }
  render() {
    const { times, texts, time, text, submitText, errorText } = this.state
    console.log('render: ', texts)
    const List = (
      <div className="list__record--page">
        {times.map((time, idx) => (
          <Record
            time={time}
            text={texts[idx]}
            key={time}
            hasYearLabel={idx === 0 || new Date(+time).getFullYear() !== new Date(+times[idx - 1]).getFullYear()}
          />
        ))}
      </div>
    );
    const Add = (
      <div className="add__content--container">
        <div className="add__time--container">
          <span className="add__time--year">{time.getFullYear()}</span>
          :
          <span className="add__time--month">{time.getMonth() + 1}</span>
          :
          <span className="add__time--day">{timeFormatter(time.getDate())}</span>
          :
          <span className="add__time--hour">{timeFormatter(time.getHours())}</span>
          :
          <span className="add__time--min">{timeFormatter(time.getMinutes())}</span>
        </div>
        <div className="add__content--prompt">
          <span>把你觉得重要的一刻，存放在链上，永远保存，随时查看</span>
        </div>
        <textarea
          cols="32"
          rows="10"
          className="add__content--textarea"
          placeholder="留下你的时光吧..."
          onChange={this.handleInput}
          value={text}
        />
        <Submit text={submitText} onClick={this.handleSubmit} disabled={submitText !== submitTexts.normal} />
        {errorText && <span className="warning">{errorText}</span>}
      </div>
    )
    return (
      <div>
        {Add}
        {List}
      </div>
    )
  }
}


export default App
