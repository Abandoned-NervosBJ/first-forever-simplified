const {
  default: Nervos
} = require('@appchain/base')

const config = require('./config')

const nervos = Nervos(config.chain) // config.chain indicates that the address of Appchain to interact
const account = nervos.base.accounts.privateKeyToAccount(config.privateKey) //create account by private key from config

nervos.base.accounts.wallet.add(account)

module.exports = nervos