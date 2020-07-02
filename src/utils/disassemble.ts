import SHA256 from 'crypto-js/sha256'

const maxarglen = 128

const methodnames = [
  'System.ExecutionEngine.GetScriptContainer',
  'System.ExecutionEngine.GetExecutingScriptHash',
  'System.ExecutionEngine.GetCallingScriptHash',
  'System.ExecutionEngine.GetEntryScriptHash',
  'System.Runtime.Platform',
  'System.Runtime.GetTrigger',
  'System.Runtime.CheckWitness',
  'System.Runtime.Notify',
  'System.Runtime.Log',
  'System.Runtime.GetTime',
  'System.Runtime.Serialize',
  'System.Runtime.Deserialize',
  'System.Runtime.GetInvocationCounter',
  'System.Runtime.GetNotifications',
  'System.Crypto.Verify',
  'System.Blockchain.GetHeight',
  'System.Blockchain.GetBlock',
  'System.Blockchain.GetTransaction',
  'System.Blockchain.GetTransactionHeight',
  'System.Blockchain.GetTransactionFromBlock',
  'System.Blockchain.GetContract',
  'System.Contract.Call',
  'System.Contract.Destroy',
  'System.Storage.GetContext',
  'System.Storage.GetReadOnlyContext',
  'System.Storage.Get',
  'System.Storage.Put',
  'System.Storage.PutEx',
  'System.Storage.Delete',
  'System.StorageContext.AsReadOnly',
  'Neo.Native.Deploy',
  'Neo.Crypto.CheckSig',
  'Neo.Crypto.CheckMultiSig',
  'Neo.Account.IsStandard',
  'Neo.Contract.Create',
  'Neo.Contract.Update',
  'Neo.Storage.Find',
  'Neo.Enumerator.Create',
  'Neo.Enumerator.Next',
  'Neo.Enumerator.Value',
  'Neo.Enumerator.Concat',
  'Neo.Iterator.Create',
  'Neo.Iterator.Key',
  'Neo.Iterator.Keys',
  'Neo.Iterator.Values',
  'Neo.Iterator.Concat',
  'Neo.Json.Serialize',
  'Neo.Json.Deserialize',
]

type Opcodetable = {
  [key: string]: {
    name: string
    size: number
    type: string
  }
}

const opcodetable: Opcodetable = {
  '00': { name: 'PUSH0', size: 0, type: '' },
  '01': { name: 'PUSHBYTES1', size: 1, type: 'bytes' },
  '02': { name: 'PUSHBYTES2', size: 2, type: 'bytes' },
  '03': { name: 'PUSHBYTES3', size: 3, type: 'bytes' },
  '04': { name: 'PUSHBYTES4', size: 4, type: 'bytes' },
  '05': { name: 'PUSHBYTES5', size: 5, type: 'bytes' },
  '06': { name: 'PUSHBYTES6', size: 6, type: 'bytes' },
  '07': { name: 'PUSHBYTES7', size: 7, type: 'bytes' },
  '08': { name: 'PUSHBYTES8', size: 8, type: 'bytes' },
  '09': { name: 'PUSHBYTES9', size: 9, type: 'bytes' },
  '0a': { name: 'PUSHBYTES10', size: 10, type: 'bytes' },
  '0b': { name: 'PUSHBYTES11', size: 11, type: 'bytes' },
  '0c': { name: 'PUSHBYTES12', size: 12, type: 'bytes' },
  '0d': { name: 'PUSHBYTES13', size: 13, type: 'bytes' },
  '0e': { name: 'PUSHBYTES14', size: 14, type: 'bytes' },
  '0f': { name: 'PUSHBYTES15', size: 15, type: 'bytes' },
  '10': { name: 'PUSHBYTES16', size: 16, type: 'bytes' },
  '11': { name: 'PUSHBYTES17', size: 17, type: 'bytes' },
  '12': { name: 'PUSHBYTES18', size: 18, type: 'bytes' },
  '13': { name: 'PUSHBYTES19', size: 19, type: 'bytes' },
  '14': { name: 'PUSHBYTES20', size: 20, type: 'bytes' },
  '15': { name: 'PUSHBYTES21', size: 21, type: 'bytes' },
  '16': { name: 'PUSHBYTES22', size: 22, type: 'bytes' },
  '17': { name: 'PUSHBYTES23', size: 23, type: 'bytes' },
  '18': { name: 'PUSHBYTES24', size: 24, type: 'bytes' },
  '19': { name: 'PUSHBYTES25', size: 25, type: 'bytes' },
  '1a': { name: 'PUSHBYTES26', size: 26, type: 'bytes' },
  '1b': { name: 'PUSHBYTES27', size: 27, type: 'bytes' },
  '1c': { name: 'PUSHBYTES28', size: 28, type: 'bytes' },
  '1d': { name: 'PUSHBYTES29', size: 29, type: 'bytes' },
  '1e': { name: 'PUSHBYTES30', size: 30, type: 'bytes' },
  '1f': { name: 'PUSHBYTES31', size: 31, type: 'bytes' },
  '20': { name: 'PUSHBYTES32', size: 32, type: 'bytes' },
  '21': { name: 'PUSHBYTES33', size: 33, type: 'bytes' },
  '22': { name: 'PUSHBYTES34', size: 34, type: 'bytes' },
  '23': { name: 'PUSHBYTES35', size: 35, type: 'bytes' },
  '24': { name: 'PUSHBYTES36', size: 36, type: 'bytes' },
  '25': { name: 'PUSHBYTES37', size: 37, type: 'bytes' },
  '26': { name: 'PUSHBYTES38', size: 38, type: 'bytes' },
  '27': { name: 'PUSHBYTES39', size: 39, type: 'bytes' },
  '28': { name: 'PUSHBYTES40', size: 40, type: 'bytes' },
  '29': { name: 'PUSHBYTES41', size: 41, type: 'bytes' },
  '2a': { name: 'PUSHBYTES42', size: 42, type: 'bytes' },
  '2b': { name: 'PUSHBYTES43', size: 43, type: 'bytes' },
  '2c': { name: 'PUSHBYTES44', size: 44, type: 'bytes' },
  '2d': { name: 'PUSHBYTES45', size: 45, type: 'bytes' },
  '2e': { name: 'PUSHBYTES46', size: 46, type: 'bytes' },
  '2f': { name: 'PUSHBYTES47', size: 47, type: 'bytes' },
  '30': { name: 'PUSHBYTES48', size: 48, type: 'bytes' },
  '31': { name: 'PUSHBYTES49', size: 49, type: 'bytes' },
  '32': { name: 'PUSHBYTES50', size: 50, type: 'bytes' },
  '33': { name: 'PUSHBYTES51', size: 51, type: 'bytes' },
  '34': { name: 'PUSHBYTES52', size: 52, type: 'bytes' },
  '35': { name: 'PUSHBYTES53', size: 53, type: 'bytes' },
  '36': { name: 'PUSHBYTES54', size: 54, type: 'bytes' },
  '37': { name: 'PUSHBYTES55', size: 55, type: 'bytes' },
  '38': { name: 'PUSHBYTES56', size: 56, type: 'bytes' },
  '39': { name: 'PUSHBYTES57', size: 57, type: 'bytes' },
  '3a': { name: 'PUSHBYTES58', size: 58, type: 'bytes' },
  '3b': { name: 'PUSHBYTES59', size: 59, type: 'bytes' },
  '3c': { name: 'PUSHBYTES60', size: 60, type: 'bytes' },
  '3d': { name: 'PUSHBYTES61', size: 61, type: 'bytes' },
  '3e': { name: 'PUSHBYTES62', size: 62, type: 'bytes' },
  '3f': { name: 'PUSHBYTES63', size: 63, type: 'bytes' },
  '40': { name: 'PUSHBYTES64', size: 64, type: 'bytes' },
  '41': { name: 'PUSHBYTES65', size: 65, type: 'bytes' },
  '42': { name: 'PUSHBYTES66', size: 66, type: 'bytes' },
  '43': { name: 'PUSHBYTES67', size: 67, type: 'bytes' },
  '44': { name: 'PUSHBYTES68', size: 68, type: 'bytes' },
  '45': { name: 'PUSHBYTES69', size: 69, type: 'bytes' },
  '46': { name: 'PUSHBYTES70', size: 70, type: 'bytes' },
  '47': { name: 'PUSHBYTES71', size: 71, type: 'bytes' },
  '48': { name: 'PUSHBYTES72', size: 72, type: 'bytes' },
  '49': { name: 'PUSHBYTES73', size: 73, type: 'bytes' },
  '4a': { name: 'PUSHBYTES74', size: 74, type: 'bytes' },
  '4b': { name: 'PUSHBYTES75', size: 75, type: 'bytes' },
  '4c': { name: 'PUSHDATA1', size: 1, type: 'read' },
  '4d': { name: 'PUSHDATA2', size: 2, type: 'read' },
  '4e': { name: 'PUSHDATA4', size: 4, type: 'read' },
  '4f': { name: 'PUSHM1', size: 0, type: '' },
  '50': { name: 'PUSHNULL', size: 0, type: '' },
  '51': { name: 'PUSH1', size: 0, type: '' },
  '52': { name: 'PUSH2', size: 0, type: '' },
  '53': { name: 'PUSH3', size: 0, type: '' },
  '54': { name: 'PUSH4', size: 0, type: '' },
  '55': { name: 'PUSH5', size: 0, type: '' },
  '56': { name: 'PUSH6', size: 0, type: '' },
  '57': { name: 'PUSH7', size: 0, type: '' },
  '58': { name: 'PUSH8', size: 0, type: '' },
  '59': { name: 'PUSH9', size: 0, type: '' },
  '5a': { name: 'PUSH10', size: 0, type: '' },
  '5b': { name: 'PUSH11', size: 0, type: '' },
  '5c': { name: 'PUSH12', size: 0, type: '' },
  '5d': { name: 'PUSH13', size: 0, type: '' },
  '5e': { name: 'PUSH14', size: 0, type: '' },
  '5f': { name: 'PUSH15', size: 0, type: '' },
  '60': { name: 'PUSH16', size: 0, type: '' },
  '61': { name: 'NOP', size: 0, type: '' },
  '62': { name: 'JMP', size: 2, type: 'int' },
  '63': { name: 'JMPIF', size: 2, type: 'int' },
  '64': { name: 'JMPIFNOT', size: 2, type: 'int' },
  '65': { name: 'CALL', size: 2, type: 'int' },
  '66': { name: 'RET', size: 0, type: '' },
  '67': { name: 'APPCALL', size: 0, type: '' },
  '68': { name: 'SYSCALL', size: 0, type: 'int' },
  '69': { name: 'TAILCALL', size: 0, type: 'int' },
  '6b': { name: 'TOALTSTACK', size: 0, type: '' },
  '6c': { name: 'FROMALTSTACK', size: 0, type: '' },
  '6d': { name: 'DUPFROMALTSTACK', size: 0, type: '' },
  '6e': { name: 'DUPFROMALTSTACKBOTTOM', size: 0, type: '' },
  '70': { name: 'ISNULL', size: 0, type: '' },
  '71': { name: 'XDROP', size: 0, type: '' },
  '72': { name: 'XSWAP', size: 0, type: '' },
  '73': { name: 'XTUCK', size: 0, type: '' },
  '74': { name: 'DEPTH', size: 0, type: '' },
  '75': { name: 'DROP', size: 0, type: '' },
  '76': { name: 'DUP', size: 0, type: '' },
  '77': { name: 'NIP', size: 0, type: '' },
  '78': { name: 'OVER', size: 0, type: '' },
  '79': { name: 'PICK', size: 0, type: '' },
  '7a': { name: 'ROLL', size: 0, type: '' },
  '7b': { name: 'ROT', size: 0, type: '' },
  '7c': { name: 'SWAP', size: 0, type: '' },
  '7d': { name: 'TUCK', size: 0, type: '' },
  '7e': { name: 'CAT', size: 0, type: '' },
  '7f': { name: 'SUBSTR', size: 0, type: '' },
  '80': { name: 'LEFT', size: 0, type: '' },
  '81': { name: 'RIGHT', size: 0, type: '' },
  '82': { name: 'SIZE', size: 0, type: '' },
  '83': { name: 'INVERT', size: 0, type: '' },
  '84': { name: 'AND', size: 0, type: '' },
  '85': { name: 'OR', size: 0, type: '' },
  '86': { name: 'XOR', size: 0, type: '' },
  '87': { name: 'EQUAL', size: 0, type: '' },
  '8b': { name: 'INC', size: 0, type: '' },
  '8c': { name: 'DEC', size: 0, type: '' },
  '8d': { name: 'SIGN', size: 0, type: '' },
  '8f': { name: 'NEGATE', size: 0, type: '' },
  '90': { name: 'ABS', size: 0, type: '' },
  '91': { name: 'NOT', size: 0, type: '' },
  '92': { name: 'NZ', size: 0, type: '' },
  '93': { name: 'ADD', size: 0, type: '' },
  '94': { name: 'SUB', size: 0, type: '' },
  '95': { name: 'MUL', size: 0, type: '' },
  '96': { name: 'DIV', size: 0, type: '' },
  '97': { name: 'MOD', size: 0, type: '' },
  '98': { name: 'SHL', size: 0, type: '' },
  '99': { name: 'SHR', size: 0, type: '' },
  '9a': { name: 'BOOLAND', size: 0, type: '' },
  '9b': { name: 'BOOLOR', size: 0, type: '' },
  '9c': { name: 'NUMEQUAL', size: 0, type: '' },
  '9e': { name: 'NUMNOTEQUAL', size: 0, type: '' },
  '9f': { name: 'LT', size: 0, type: '' },
  a0: { name: 'GT', size: 0, type: '' },
  a1: { name: 'LTE', size: 0, type: '' },
  a2: { name: 'GTE', size: 0, type: '' },
  a3: { name: 'MIN', size: 0, type: '' },
  a4: { name: 'MAX', size: 0, type: '' },
  a5: { name: 'WITHIN', size: 0, type: '' },
  c0: { name: 'ARRAYSIZE', size: 0, type: '' },
  c1: { name: 'PACK', size: 0, type: '' },
  c2: { name: 'UNPACK', size: 0, type: '' },
  c3: { name: 'PICKITEM', size: 0, type: '' },
  c4: { name: 'SETITEM', size: 0, type: '' },
  c5: { name: 'NEWARRAY', size: 0, type: '' },
  c6: { name: 'NEWSTRUCT', size: 0, type: '' },
  c7: { name: 'NEWMAP', size: 0, type: '' },
  c8: { name: 'APPEND', size: 0, type: '' },
  c9: { name: 'REVERSE', size: 0, type: '' },
  ca: { name: 'REMOVE', size: 0, type: '' },
  cb: { name: 'HASKEY', size: 0, type: '' },
  cc: { name: 'KEYS', size: 0, type: '' },
  cd: { name: 'VALUES', size: 0, type: '' },
  f0: { name: 'THROW', size: 0, type: '' },
  f1: { name: 'THROWIFNOT', size: 0, type: '' },
  ac: { name: 'CHECKSIG', size: 0, type: '' },
}

export function disassemble(script: string): string {
  let out = ''

  type Interopmethod = {
    [key: string]: string
  }

  // resolve all interop method names to 32-bit hash
  const interopmethod = {} as Interopmethod
  for (let i = 0; i < methodnames.length; i++) {
    const hash = SHA256(methodnames[i]).toString().slice(0, 8)
    interopmethod[hash] = methodnames[i]
  }

  // disassemble
  for (let i = 0; i < script.length; i += 2) {
    const opcode = script.slice(i, i + 2)

    const opcodedata = opcodetable[opcode] || {
      name: 'parsing error:',
      size: 0,
      type: '',
    }
    let inst = opcodedata.name

    if (opcodedata.name === 'SYSCALL') {
      const hash = script.slice(i + 2, i + 10)
      inst += ' ' + interopmethod[hash]
    } else if (opcodedata.type === 'int') {
      inst +=
        ' ' + parseInt(script.slice(i + 2, i + 2 + opcodedata.size * 2), 16)
    } else if (opcodedata.type === 'bytes') {
      const fulldata = script.slice(i + 2, i + 2 + opcodedata.size * 2)
      if (fulldata.length > maxarglen) {
        inst += ' ' + fulldata.slice(0, maxarglen) + '...'
      } else {
        inst += ' ' + fulldata
      }
    } else if (opcodedata.type === 'read') {
      const datalen = parseInt(
        script.slice(i + 2, i + 2 + opcodedata.size * 2),
        16,
      )
      const start = i + 2 + opcodedata.size * 2
      const fulldata = script.slice(start, start + datalen)
      if (fulldata.length > maxarglen) {
        inst += ' ' + fulldata.slice(0, maxarglen) + '...'
      } else {
        inst += ' ' + fulldata
      }
    }
    out += inst + '\n'
    // eslint-disable-next-line
    // @ts-ignore
    i += parseInt(opcodedata.size) * 2
  }
  return out
}
