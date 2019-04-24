const {
  default: Nervos
} = require('@cryptape/cita-sdk')

const nervos = Nervos()
console.log(nervos.base.accounts.create())
