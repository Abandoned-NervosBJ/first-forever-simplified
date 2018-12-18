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
