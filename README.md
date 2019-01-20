最终的代码可以参考：[https://github.com/NervosBeijingCommunity/first-forever-simplified](https://github.com/NervosBeijingCommunity/first-forever-simplified)
遇到问题如果短时间搞不定，可以参考上面的代码，运行命令：
```
npm i && npm start
```
应该就可以将app跑起来了。
## 0 环境安装
### 操作系统
推荐使用Mac或者Ubuntu。

如果使用 **Windows， 可以使用虚拟机在Windows系统中安装一个Linux的Ubunut系统，** 2种做法都可以：
* 虚拟机VirtualBox官网下载 [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)， 并安装ubunut镜像。
* 开启 Windows 10 的 Linux 子系统并安装Ubunut镜像，切记是Windows10，不是Windows8，也不是Windows7，版本不能低于Window10，参考： [https://www.jianshu.com/p/UpwXzQ](https://www.jianshu.com/p/UpwXzQ)。
### 安装node
[Node.js](https://nodejs.org/)
### 安装代码编辑器
[https://code.visualstudio.com/](https://code.visualstudio.com/)
## 1 创建项目
在命令行运行如下命令，安装 create-react-app 工具：
```
npm install create-react-app -g
```
**教练**：解释一下什么是npm和package？上面的命令做了什么？

在命令行运行如下命令，创建项目：
```
create-react-app first-forever
```
会创建一个名字为first-forever的项目文件夹。

**教练**：解释一下上面都做了什么？

在命令行运行如下命令，运行项目：
```
cd first-forever
npm i --save @appchain/base
npm start
```
几秒钟后会自动打开一个网页，表明项目初始化并运行成功。

**教练**：介绍一下一个网页从输入网址到显示内容都经历了什么？介绍一下什么是React和HTML有什么关系？

## 2 申请测试链代币

### 生成账户

访问网址获取私钥和地址：

[https://service-exvd0ctl-1258120565.ap-beijing.apigateway.myqcloud.com/release/addr](https://service-exvd0ctl-1258120565.ap-beijing.apigateway.myqcloud.com/release/addr)

将生成的私钥和地址保存好，后面会用到。
特别注意，私钥 privateKey 是不能泄露给任何人的。上面这个账户就是临时用一下，所以无所谓了。
于是， account 就到手了。

**教练**：解释一下什么是加密货币钱包？冷钱包和热钱包有啥区别？地址和私钥是什么？为什么私钥很重要？如何保存私钥？

参考：[https://learning.nervos.org/nerv-first/6-wallet](https://learning.nervos.org/nerv-first/6-wallet)

### 充值 

使用浏览器打开网页 [https://dapp.cryptape.com/faucet/](https://dapp.cryptape.com/faucet/) ，然后输入上一步生成的地址（address），点击 Get Testnet Token 按钮就可以获取免费的代币了。

![图片](https://img.haoqicat.com/2018091201.jpg)

然后，到 AppChain 的区块链浏览器，也就是 [microscope.cryptape.com](http://microscope.cryptape.com/) 上，输入账户地址（address），就可以查询到账户余额了，数值是 0x 打头的，也就是8进制表示的。

这样账户中就有了余额，后续操作就都可以顺利进行了。

![图片](https://img.haoqicat.com/2018091202.jpg)

**教练**：解释一下什么是Nervos？解释一下什么是区块链浏览器？

参考：[https://learning.nervos.org/nerv-first/2-nervos](https://learning.nervos.org/nerv-first/2-nervos)
Nervos 是一个网络，分上下两层，底层的 CKB 负责安全和共识，上层的各种方案保证性能。Nervos 要为各个企业搭建自己的公链和开发 DApp 提供成套的基础设施，让大家直接上手就能实现自己的想法，而不必重新造轮子。

## 3 部署智能合约

使用代码编辑器打开创建的first-forever文件夹，在文件夹src/下创建一个文件config.js，添加如下代码：

```
const config = {
  chain: 'https://node.cryptape.com',
  contractAddress: '', // 暂时留空，后面会添加
  fromAddress: 'YOUR_ADDRESS',
  privateKey: 'YOUR_PRIVATE_KEY'
}
module.exports = config
```
将fromAddress, privateKey(私钥)替换成自己的，contractAddress在后面部署合约成功后再添加。

这样配置文件就写好了。

在文件夹src/下创建一个文件nervos.js，添加如下代码：
```
const {
  default: Nervos
} = require('@appchain/base')

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact
const account = nervos.base.accounts.privateKeyToAccount(config.privateKey) //create account by private key from config

nervos.base.accounts.wallet.add(account)

module.exports = nervos
```
创建 nervos.js 文件，初始化 nervos 对象。通过使用 config.chain ，指定了要跟哪条区块链进行交互。privateKeyToAccount 用私钥生成 account 。通过 wallet.add 接口把 account 添加到了 nervos 对象中并最终导出。

在文件夹src/下创建一个文件simpleStore.js，添加如下代码：
```
const nervos = require('./nervos')
const {
  abi
} = require('./contracts/compiled.js')
const {
  contractAddress
} = require('./config')

const transaction = require('./contracts/transaction')
const simpleStoreContract = new nervos.base.Contract(abi, contractAddress)
module.exports = {
  transaction,
  simpleStoreContract
}
```

打开网址 [https://remix.ethereum.org/](https://remix.ethereum.org/) 将下面的代码粘贴到remix的代码编辑区域中，代码也可以从这个网址得到：[https://github.com/NervosBeijingCommunity/first-forever-simplified/blob/master/src/contracts/SimpleStore.sol](https://github.com/NervosBeijingCommunity/first-forever-simplified/blob/master/src/contracts/SimpleStore.sol)

**教练**：介绍一下智能合约和Solidity？Solidity有哪些优点更适合做智能合约开发？

参考：[https://learning.nervos.org/nerv-first/3-dev](https://learning.nervos.org/nerv-first/3-dev)
[https://learning.nervos.org/nerv-first/4-sol](https://learning.nervos.org/nerv-first/4-sol)
```
pragma solidity ^0.4.24;  // 版本要高于0.4.24才可以编译

contract SimpleStore {
    mapping (address => mapping (uint256 => string)) private records;
    /*
        mapping类型 理解为字典
        0x81acb7ffda65c125646ac9b8d98cf47c170c01a9 => {1231006505 => "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"}
     */

    mapping (address => uint256[]) private categories;
    /*
        0x81acb7ffda65c125646ac9b8d98cf47c170c01a9 => 235833
        0x398ca5cf715201c8c3ebf301ce8f0ed577a3f258 => 623735
    */

    event Recorded(address _sender, string indexed _text, uint256 indexed _time); // 定义事件

    function _addToList(address from, uint256 time) private { // 私有方法
        categories[from].push(time); // mapping 添加一个元素
    }

    function getList()
    public // public是公共方法
    view // view 表示这个查询方法,不改变数据的状态
    returns (uint256[])// 返回的数据类型
    {
        return categories[msg.sender];
    }

    function add(string text, uint256 time) public { // 公共方法, 外部可以调用
        records[msg.sender][time]=text; // 赋值
        _addToList(msg.sender, time); // 调用方法
        emit Recorded(msg.sender, text, time); // 触发事件
    }

    function get(uint256 time) public view returns(string) { // 公共方法, 外部可以调用
        return records[msg.sender][time];
    }
}
```

![图片](https://uploader.shimo.im/f/wTAoWHk5oEQ2NjW9.png!thumbnail)

然后点右侧的 start to compile进行编译。这里需要注意，有的时候需要稍微提高一下合约声明的版本号，才能编译通过。

![图片](https://img.haoqicat.com/2018091204.jpg)

编译的输出可以通过点 details 按钮得到。
这样合约就编译好了。

在文件夹src下创建文件夹contracts，然后再文件夹中创建一个文件compiled.js，并添加如下代码：
```
// deploy/compiled.js
const bytecode = '稍后替换成真正的值'
const abi = '稍后替换成真正的值'
module.exports = {
    abi,
    bytecode
}
```
其中 bytecode 一项，就是 remix 最终编译结果中 bytecode 一项下的 **object 那个字段的值**，是一个长长的字符串，这点要注意，不要把全部内容都复制过来。如下图所示，就是 "6080..." 开始的这个双引号中的值。

![图片](https://uploader.shimo.im/f/h0FDy0TqDgAGu6nk.png!thumbnail)

而 abi 一项就是一个数组，就直接在 remix 界面中的 abi 一项下，直接点 copy 图标。

![图片](https://uploader.shimo.im/f/iDx1G9x7pTUlqqWq.png!thumbnail)

然后把拷贝到的内容粘贴到 compiled.js 文件中即可。

我在 Github 上也上传了一个真实可用的版本供大家参考：[https://github.com/NervosBeijingCommunity/first-forever-simplified/blob/master/src/contracts/compiled.js](https://github.com/NervosBeijingCommunity/first-forever-simplified/blob/master/src/contracts/compiled.js) 。

在文件夹src/contracts/下创建一个文件transaction.js，添加如下代码：
```
const nervos = require('../nervos')

const transaction = {
  from: nervos.base.accounts.wallet[0].address,
  privateKey: nervos.base.accounts.wallet[0].privateKey,
  nonce: 999999,
  quota: 1000000,
  chainId: 1,
  version: 1,
  validUntilBlock: 999999,
  value: '0x0'
};

module.exports = transaction
```
创建 transaction.js 文件。from 一项指定了我们自己账户的地址。注意这里没有 to 也就是没有接收方。privateKey 一项用来指定私钥。特别说明一下，私钥是不能暴露给任何人的，这里为了演示方便，我们直接把私钥写到了代码中，但是实际的 DApp 一般都是开源软件，所以私钥是不能写到代码中的。AppChain 的解决方式是把私钥保存到 Neuron 钱包中，需要进行交易的时候，让代码跟 Neuron 交互来完成签名。当然，我们这里还是先不涉及 Neuron ，暂时把私钥写到了代码中。value 是交易数额，这里设置为0。后面的 quota，nonce ，chainId ，version ，validUntilBlock 都是跟交易安全相关的设置，可以到 AppChain 的核心，也就是 CITA 的官方文档上，找到各自的含义：[https://docs.nervos.org/cita/#/rpc_guide/rpc](https://docs.nervos.org/cita/#/rpc_guide/rpc) 。

在文件夹src/contracts/下创建一个文件deploy.js，添加如下代码：
```
const nervos = require('../nervos')
const {
  abi,
  bytecode
} = require('./compiled.js')

const transaction = require('./transaction')
let _contractAddress = ''
// contract contract instance
const myContract = new nervos.base.Contract(abi)

nervos.base.getBlockNumber().then(current => {
    transaction.validUntilBlock = +current + 88 // update transaction.validUntilBlock
    // deploy contract
    return myContract.deploy({
      data: bytecode,
      arguments: [],
    }).send(transaction)
  }).then(txRes => {
    if (txRes.hash) {
      // get transaction receipt
      return nervos.listeners.listenToTransactionReceipt(txRes.hash)
    } else {
      throw new Error("No Transaction Hash Received")
    }
  })
  .then(res => {
    const {
      contractAddress,
      errorMessage,
    } = res
    if (errorMessage) throw new Error(errorMessage)
    console.log(`contractAddress is: ${contractAddress}`)
    _contractAddress = contractAddress
    return nervos.base.storeAbi(contractAddress, abi, transaction) // store abi on the chain
  }).then(res => {
    if (res.errorMessage) throw new Error(res.errorMessage)
    return nervos.base.getAbi(_contractAddress,'pending').then(console.log) // get abi from the chain
  }).catch(err => console.error(err))
```
创建 deploy.js 。用来 deploy 字节码，然后就可以从 receipt 也就是回执中，得到合约地址并打印出来。通过 storeAbi 接口把合约 ABI 发送到链上。具体各个接口的描述可以参考 Nervos.js 的 npm 主页：[https://www.npmjs.com/package/@appchain/base](https://www.npmjs.com/package/@appchain/base)。

在命令行运行命令：
```
node src/contracts/deploy.js
```
部署成功，可以看到打印出了合约地址和 ABI 信息。

然后打开连接 [https://microscope.cryptape.com/](https://microscope.cryptape.com/) 搜索打印出的合约地址，发现出现的就是一个 Account ，下面有 contract 一项。点开，可以看到合约代码中对应的三个接口的相关界面。

打开src/config.js文件，修改contractAddress的值为上面得到的合约地址：
```
const config = {
  chain: 'https://node.cryptape.com',
  contractAddress: '上面得到的合约地址',  // 修改这一行
  fromAddress: 'YOUR_ADDRESS',
  privateKey: 'YOUR_PRIVATE_KEY'
}
module.exports = config
```

这样我们合约部分的代码就完成了。

## 4 与合约交互

清空src/App.js文件内容，添加如下代码：
```
// src/App.js
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
```

清空src/App.css文件内容，添加如下代码：
```
// src/App.css
.add__content--container {
  padding: 0 15px;
}

.add__content--container>div,
.add__content--container>input,
.add__content--container>textarea,
.add__content--container>button {
  margin: 15px 0;
}

.add__content--container>textarea {
  margin-bottom: 31px;
}

.add__content--container>div {
  margin-bottom: 0;
}

.add__time--container {
  background: #fff;
  border-radius: 4px;
  text-align: center;
  padding: 23px 0;
  box-shadow: 0 10px 10px 0 rgba(254, 121, 43, 0.05);
}

.add__time--year,
.add__time--month,
.add__time--day,
.add__time--hour,
.add__time--min {
  font-weight: bold;
  border: 1px solid #e3e3e3;
  padding: 9px 8px;
  font-size: 22px;
  border-radius: 4px;
  margin: 0 6px;
}

.add__content--prompt {
  color: #828181;
  font-size: 12px;
}

.add__content--prompt svg {
  margin-right: 8px;
}

.add__content--textarea {
  display: block;
  width: 100%;
  border-radius: 4px;
  border: none;
  background: #fff;
  box-shadow: 0 10px 10px 0 rgba(254, 121, 43, 0.05);
  resize: none;
  padding: 12px;
}

.add__content--pic {
  position: relative;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 10px 0 rgba(254, 121, 43, 0.05);
  resize: none;
  padding: 11px 18px;
}

.add__content--pic input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.list__record--page {
  margin: 22px;
  border-left: 2px solid rgba(254, 121, 43, 0.2);
  margin-bottom: 70px;
}

.list__record--container {
  font-size: 14px;
  margin-right: 0;
  padding: 22px;
}

.list__record--container span {
  position: relative;
  color: #828181;
  line-height: 2;
}

.list__record--container span::before {
  display: block;
  content: '';
  position: absolute;
  top: 6px;
  left: -27px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fb7f5b;
  opacity: 0.5;
}

.list__record--container div {
  background: #FFF;
  border-radius: 4px;
  padding: 16px 10px 20px;
  color: #1E1E21;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 10px 10px 0 rgba(254, 121, 43, 0.05);
}

.list__record--container div.list__record--year {
  position: relative;
  padding: 0;
  background: none;
  box-shadow: none;
  overflow: visible;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 900;
}

.list__record--container div.list__record--year::before {
  display: block;
  content: '';
  position: absolute;
  top: 13px;
  left: -27px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fb7f5b;
}

.list__record--container div.list__record--year::after {
  display: block;
  content: '';
  position: absolute;
  top: 9px;
  left: -31px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fb7f5b;
  opacity: 0.5;
}

.confirm__button--primary {
  display: block;
  margin: 3.8vh 0;
  width: 100%;
  border: none;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  color: #fff;
  background: #fe792b;
  box-shadow: 0 0 10px 0 #fe792b;
}

.confirm__button--disabled {
  color: #aaa !important;
  background: #eee !important;
  box-shadow: 0 0 10px 0 #eee !important;
}
```

回到浏览器中，查看页面，如下图所示。这时就可以添加文字并提交到区块链了，刷新页面后就可以看到最新添加的文字了。

![图片](https://uploader.shimo.im/f/GzBlhJST2UUS6ur2.png!thumbnail)

恭喜你，完成了一个完整的DApp！（完）
