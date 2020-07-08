import CryptoJS from 'crypto-js'

const SHA256 = CryptoJS.SHA256

type Opcodetable = {
  [key: string]: {
    name: string
    size: number
  }
}

const opcodetable: Opcodetable = {
  0x00: { name: 'PUSH0', size: 0 },
  0x01: { name: 'PUSHBYTES1', size: 1 },
  0x02: { name: 'PUSHBYTES2', size: 2 },
  0x03: { name: 'PUSHBYTES3', size: 3 },
  0x04: { name: 'PUSHBYTES4', size: 4 },
  0x05: { name: 'PUSHBYTES5', size: 5 },
  0x06: { name: 'PUSHBYTES6', size: 6 },
  0x07: { name: 'PUSHBYTES7', size: 7 },
  0x08: { name: 'PUSHBYTES8', size: 8 },
  0x09: { name: 'PUSHBYTES9', size: 9 },
  0x0a: { name: 'PUSHBYTES10', size: 10 },
  0x0b: { name: 'PUSHBYTES11', size: 11 },
  0x0c: { name: 'PUSHBYTES12', size: 12 },
  0x0d: { name: 'PUSHBYTES13', size: 13 },
  0x0e: { name: 'PUSHBYTES14', size: 14 },
  0x0f: { name: 'PUSHBYTES15', size: 15 },
  0x10: { name: 'PUSHBYTES16', size: 16 },
  0x11: { name: 'PUSHBYTES17', size: 17 },
  0x12: { name: 'PUSHBYTES18', size: 18 },
  0x13: { name: 'PUSHBYTES19', size: 19 },
  0x14: { name: 'PUSHBYTES20', size: 20 },
  0x15: { name: 'PUSHBYTES21', size: 21 },
  0x16: { name: 'PUSHBYTES22', size: 22 },
  0x17: { name: 'PUSHBYTES23', size: 23 },
  0x18: { name: 'PUSHBYTES24', size: 24 },
  0x19: { name: 'PUSHBYTES25', size: 25 },
  0x1a: { name: 'PUSHBYTES26', size: 26 },
  0x1b: { name: 'PUSHBYTES27', size: 27 },
  0x1c: { name: 'PUSHBYTES28', size: 28 },
  0x1d: { name: 'PUSHBYTES29', size: 29 },
  0x1e: { name: 'PUSHBYTES30', size: 30 },
  0x1f: { name: 'PUSHBYTES31', size: 31 },
  0x20: { name: 'PUSHBYTES32', size: 32 },
  0x21: { name: 'PUSHBYTES33', size: 33 },
  0x22: { name: 'PUSHBYTES34', size: 34 },
  0x23: { name: 'PUSHBYTES35', size: 35 },
  0x24: { name: 'PUSHBYTES36', size: 36 },
  0x25: { name: 'PUSHBYTES37', size: 37 },
  0x26: { name: 'PUSHBYTES38', size: 38 },
  0x27: { name: 'PUSHBYTES39', size: 39 },
  0x28: { name: 'PUSHBYTES40', size: 40 },
  0x29: { name: 'PUSHBYTES41', size: 41 },
  0x2a: { name: 'PUSHBYTES42', size: 42 },
  0x2b: { name: 'PUSHBYTES43', size: 43 },
  0x2c: { name: 'PUSHBYTES44', size: 44 },
  0x2d: { name: 'PUSHBYTES45', size: 45 },
  0x2e: { name: 'PUSHBYTES46', size: 46 },
  0x2f: { name: 'PUSHBYTES47', size: 47 },
  0x30: { name: 'PUSHBYTES48', size: 48 },
  0x31: { name: 'PUSHBYTES49', size: 49 },
  0x32: { name: 'PUSHBYTES50', size: 50 },
  0x33: { name: 'PUSHBYTES51', size: 51 },
  0x34: { name: 'PUSHBYTES52', size: 52 },
  0x35: { name: 'PUSHBYTES53', size: 53 },
  0x36: { name: 'PUSHBYTES54', size: 54 },
  0x37: { name: 'PUSHBYTES55', size: 55 },
  0x38: { name: 'PUSHBYTES56', size: 56 },
  0x39: { name: 'PUSHBYTES57', size: 57 },
  0x3a: { name: 'PUSHBYTES58', size: 58 },
  0x3b: { name: 'PUSHBYTES59', size: 59 },
  0x3c: { name: 'PUSHBYTES60', size: 60 },
  0x3d: { name: 'PUSHBYTES61', size: 61 },
  0x3e: { name: 'PUSHBYTES62', size: 62 },
  0x3f: { name: 'PUSHBYTES63', size: 63 },
  0x40: { name: 'PUSHBYTES64', size: 64 },
  0x41: { name: 'PUSHBYTES65', size: 65 },
  0x42: { name: 'PUSHBYTES66', size: 66 },
  0x43: { name: 'PUSHBYTES67', size: 67 },
  0x44: { name: 'PUSHBYTES68', size: 68 },
  0x45: { name: 'PUSHBYTES69', size: 69 },
  0x46: { name: 'PUSHBYTES70', size: 70 },
  0x47: { name: 'PUSHBYTES71', size: 71 },
  0x48: { name: 'PUSHBYTES72', size: 72 },
  0x49: { name: 'PUSHBYTES73', size: 73 },
  0x4a: { name: 'PUSHBYTES74', size: 74 },
  0x4b: { name: 'PUSHBYTES75', size: 75 },
  0x4c: { name: 'PUSHDATA1', size: 1 },
  0x4d: { name: 'PUSHDATA2', size: 2 },
  0x4e: { name: 'PUSHDATA4', size: 4 },
  0x4f: { name: 'PUSHM1', size: 0 },
  0x51: { name: 'PUSH1', size: 0 },
  0x52: { name: 'PUSH2', size: 0 },
  0x53: { name: 'PUSH3', size: 0 },
  0x54: { name: 'PUSH4', size: 0 },
  0x55: { name: 'PUSH5', size: 0 },
  0x56: { name: 'PUSH6', size: 0 },
  0x57: { name: 'PUSH7', size: 0 },
  0x58: { name: 'PUSH8', size: 0 },
  0x59: { name: 'PUSH9', size: 0 },
  0x5a: { name: 'PUSH10', size: 0 },
  0x5b: { name: 'PUSH11', size: 0 },
  0x5c: { name: 'PUSH12', size: 0 },
  0x5d: { name: 'PUSH13', size: 0 },
  0x5e: { name: 'PUSH14', size: 0 },
  0x5f: { name: 'PUSH15', size: 0 },
  0x60: { name: 'PUSH16', size: 0 },
  0x61: { name: 'NOP', size: 0 },
  0x62: { name: 'JMP', size: 2 },
  0x63: { name: 'JMPIF', size: 2 },
  0x64: { name: 'JMPIFNOT', size: 2 },
  0x65: { name: 'CALL', size: 2 },
  0x66: { name: 'RET', size: 0 },
  0x67: { name: 'APPCALL', size: 20 },
  0x68: { name: 'SYSCALL', size: 1 },
  0x69: { name: 'TAILCALL', size: 20 },
  0x6a: { name: 'DUPFROMALTSTACK', size: 0 },
  0x6b: { name: 'TOALTSTACK', size: 0 },
  0x6c: { name: 'FROMALTSTACK', size: 0 },
  0x6d: { name: 'XDROP', size: 0 },
  0x72: { name: 'XSWAP', size: 0 },
  0x73: { name: 'XTUCK', size: 0 },
  0x74: { name: 'DEPTH', size: 0 },
  0x75: { name: 'DROP', size: 0 },
  0x76: { name: 'DUP', size: 0 },
  0x77: { name: 'NIP', size: 0 },
  0x78: { name: 'OVER', size: 0 },
  0x79: { name: 'PICK', size: 0 },
  0x7a: { name: 'ROLL', size: 0 },
  0x7b: { name: 'ROT', size: 0 },
  0x7c: { name: 'SWAP', size: 0 },
  0x7d: { name: 'TUCK', size: 0 },
  0x7e: { name: 'CAT', size: 0 },
  0x7f: { name: 'SUBSTR', size: 0 },
  0x80: { name: 'LEFT', size: 0 },
  0x81: { name: 'RIGHT', size: 0 },
  0x82: { name: 'SIZE', size: 0 },
  0x83: { name: 'INVERT', size: 0 },
  0x84: { name: 'AND', size: 0 },
  0x85: { name: 'OR', size: 0 },
  0x86: { name: 'XOR', size: 0 },
  0x87: { name: 'EQUAL', size: 0 },
  0x8b: { name: 'INC', size: 0 },
  0x8c: { name: 'DEC', size: 0 },
  0x8d: { name: 'SIGN', size: 0 },
  0x8f: { name: 'NEGATE', size: 0 },
  0x90: { name: 'ABS', size: 0 },
  0x91: { name: 'NOT', size: 0 },
  0x92: { name: 'NZ', size: 0 },
  0x93: { name: 'ADD', size: 0 },
  0x94: { name: 'SUB', size: 0 },
  0x95: { name: 'MUL', size: 0 },
  0x96: { name: 'DIV', size: 0 },
  0x97: { name: 'MOD', size: 0 },
  0x98: { name: 'SHL', size: 0 },
  0x99: { name: 'SHR', size: 0 },
  0x9a: { name: 'BOOLAND', size: 0 },
  0x9b: { name: 'BOOLOR', size: 0 },
  0x9c: { name: 'NUMEQUAL', size: 0 },
  0x9e: { name: 'NUMNOTEQUAL', size: 0 },
  0x9f: { name: 'LT', size: 0 },
  0xa0: { name: 'GT', size: 0 },
  0xa1: { name: 'LTE', size: 0 },
  0xa2: { name: 'GTE', size: 0 },
  0xa3: { name: 'MIN', size: 0 },
  0xa4: { name: 'MAX', size: 0 },
  0xa5: { name: 'WITHIN', size: 0 },
  0xa7: { name: 'SHA1', size: 0 },
  0xa8: { name: 'SHA256', size: 0 },
  0xa9: { name: 'HASH160', size: 0 },
  0xaa: { name: 'HASH256', size: 0 },
  0xac: { name: 'CHECKSIG', size: 0 },
  0xad: { name: 'VERIFY', size: 0 },
  0xae: { name: 'CHECKMULTISIG', size: 0 },
  0xc0: { name: 'ARRAYSIZE', size: 0 },
  0xc1: { name: 'PACK', size: 0 },
  0xc2: { name: 'UNPACK', size: 0 },
  0xc3: { name: 'PICKITEM', size: 0 },
  0xc4: { name: 'SETITEM', size: 0 },
  0xc5: { name: 'NEWARRAY', size: 0 },
  0xc6: { name: 'NEWSTRUCT', size: 0 },
  0xc7: { name: 'NEWMAP', size: 0 },
  0xc8: { name: 'APPEND', size: 0 },
  0xc9: { name: 'REVERSE', size: 0 },
  0xca: { name: 'REMOVE', size: 0 },
  0xcb: { name: 'HASKEY', size: 0 },
  0xcc: { name: 'KEYS', size: 0 },
  0xcd: { name: 'VALUES', size: 0 },
  0xe0: { name: 'CALL_I', size: 4 },
  0xe1: { name: 'CALL_E', size: 22 },
  0xe2: { name: 'CALL_ED', size: 2 },
  0xe3: { name: 'CALL_ET', size: 22 },
  0xe4: { name: 'CALL_EDT', size: 2 },
  0xf0: { name: 'THROW', size: 0 },
  0xf1: { name: 'THROWIFNOT', size: 0 },
}
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
  'System.Blockchain.GetHeight',
  'System.Blockchain.GetHeader',
  'System.Blockchain.GetBlock',
  'System.Blockchain.GetTransaction',
  'System.Blockchain.GetTransactionHeight',
  'System.Blockchain.GetContract',
  'System.Header.GetIndex',
  'System.Header.GetHash',
  'System.Header.GetPrevHash',
  'System.Header.GetTimestamp',
  'System.Block.GetTransactionCount',
  'System.Block.GetTransactions',
  'System.Block.GetTransaction',
  'System.Transaction.GetHash',
  'System.Contract.Destroy',
  'System.Contract.GetStorageContext',
  'System.Storage.GetContext',
  'System.Storage.GetReadOnlyContext',
  'System.Storage.Get',
  'System.Storage.Put',
  'System.Storage.PutEx',
  'System.Storage.Delete',
  'System.StorageContext.AsReadOnly',
  'Neo.Runtime.GetTrigger',
  'Neo.Runtime.CheckWitness',
  'Neo.Runtime.Notify',
  'Neo.Runtime.Log',
  'Neo.Runtime.GetTime',
  'Neo.Runtime.Serialize',
  'Neo.Runtime.Deserialize',
  'Neo.Blockchain.GetHeight',
  'Neo.Blockchain.GetHeader',
  'Neo.Blockchain.GetBlock',
  'Neo.Blockchain.GetTransaction',
  'Neo.Blockchain.GetTransactionHeight',
  'Neo.Blockchain.GetAccount',
  'Neo.Blockchain.GetValidators',
  'Neo.Blockchain.GetAsset',
  'Neo.Blockchain.GetContract',
  'Neo.Header.GetHash',
  'Neo.Header.GetVersion',
  'Neo.Header.GetPrevHash',
  'Neo.Header.GetMerkleRoot',
  'Neo.Header.GetTimestamp',
  'Neo.Header.GetIndex',
  'Neo.Header.GetConsensusData',
  'Neo.Header.GetNextConsensus',
  'Neo.Block.GetTransactionCount',
  'Neo.Block.GetTransactions',
  'Neo.Block.GetTransaction',
  'Neo.Transaction.GetHash',
  'Neo.Transaction.GetType',
  'Neo.Transaction.GetAttributes',
  'Neo.Transaction.GetInputs',
  'Neo.Transaction.GetOutputs',
  'Neo.Transaction.GetReferences',
  'Neo.Transaction.GetUnspentCoins',
  'Neo.Transaction.GetWitnesses',
  'Neo.InvocationTransaction.GetScript',
  'Neo.Witness.GetVerificationScript',
  'Neo.Attribute.GetUsage',
  'Neo.Attribute.GetData',
  'Neo.Input.GetHash',
  'Neo.Input.GetIndex',
  'Neo.Output.GetAssetId',
  'Neo.Output.GetValue',
  'Neo.Output.GetScriptHash',
  'Neo.Account.GetScriptHash',
  'Neo.Account.GetVotes',
  'Neo.Account.GetBalance',
  'Neo.Account.IsStandard',
  'Neo.Asset.Create',
  'Neo.Asset.Renew',
  'Neo.Asset.GetAssetId',
  'Neo.Asset.GetAssetType',
  'Neo.Asset.GetAmount',
  'Neo.Asset.GetAvailable',
  'Neo.Asset.GetPrecision',
  'Neo.Asset.GetOwner',
  'Neo.Asset.GetAdmin',
  'Neo.Asset.GetIssuer',
  'Neo.Contract.Create',
  'Neo.Contract.Migrate',
  'Neo.Contract.Destroy',
  'Neo.Contract.GetScript',
  'Neo.Contract.IsPayable',
  'Neo.Contract.GetStorageContext',
  'Neo.Storage.GetContext',
  'Neo.Storage.GetReadOnlyContext',
  'Neo.Storage.Get',
  'Neo.Storage.Put',
  'Neo.Storage.Delete',
  'Neo.Storage.Find',
  'Neo.StorageContext.AsReadOnly',
  'Neo.Enumerator.Create',
  'Neo.Enumerator.Next',
  'Neo.Enumerator.Value',
  'Neo.Enumerator.Concat',
  'Neo.Iterator.Create',
  'Neo.Iterator.Key',
  'Neo.Iterator.Keys',
  'Neo.Iterator.Values',
  'Neo.Iterator.Concat',
  'Neo.Iterator.Next',
  'Neo.Iterator.Value',
  'AntShares.Runtime.CheckWitness',
  'AntShares.Runtime.Notify',
  'AntShares.Runtime.Log',
  'AntShares.Blockchain.GetHeight',
  'AntShares.Blockchain.GetHeader',
  'AntShares.Blockchain.GetBlock',
  'AntShares.Blockchain.GetTransaction',
  'AntShares.Blockchain.GetAccount',
  'AntShares.Blockchain.GetValidators',
  'AntShares.Blockchain.GetAsset',
  'AntShares.Blockchain.GetContract',
  'AntShares.Header.GetHash',
  'AntShares.Header.GetVersion',
  'AntShares.Header.GetPrevHash',
  'AntShares.Header.GetMerkleRoot',
  'AntShares.Header.GetTimestamp',
  'AntShares.Header.GetConsensusData',
  'AntShares.Header.GetNextConsensus',
  'AntShares.Block.GetTransactionCount',
  'AntShares.Block.GetTransactions',
  'AntShares.Block.GetTransaction',
  'AntShares.Transaction.GetHash',
  'AntShares.Transaction.GetType',
  'AntShares.Transaction.GetAttributes',
  'AntShares.Transaction.GetInputs',
  'AntShares.Transaction.GetOutputs',
  'AntShares.Transaction.GetReferences',
  'AntShares.Attribute.GetUsage',
  'AntShares.Attribute.GetData',
  'AntShares.Input.GetHash',
  'AntShares.Input.GetIndex',
  'AntShares.Output.GetAssetId',
  'AntShares.Output.GetValue',
  'AntShares.Output.GetScriptHash',
  'AntShares.Account.GetScriptHash',
  'AntShares.Account.GetVotes',
  'AntShares.Account.GetBalance',
  'AntShares.Asset.Create',
  'AntShares.Asset.Renew',
  'AntShares.Asset.GetAssetId',
  'AntShares.Asset.GetAssetType',
  'AntShares.Asset.GetAmount',
  'AntShares.Asset.GetAvailable',
  'AntShares.Asset.GetPrecision',
  'AntShares.Asset.GetOwner',
  'AntShares.Asset.GetAdmin',
  'AntShares.Asset.GetIssuer',
  'AntShares.Contract.Create',
  'AntShares.Contract.Migrate',
  'AntShares.Contract.Destroy',
  'AntShares.Contract.GetScript',
  'AntShares.Contract.GetStorageContext',
  'AntShares.Storage.GetContext',
  'AntShares.Storage.Get',
  'AntShares.Storage.Put',
  'AntShares.Storage.Delete',
]

// resolve all interop method names to 32-bit hash
type Interopmethod = {
  [key: string]: string | number
}
const interopmethod = {} as Interopmethod
for (let i = 0; i < methodnames.length; i++) {
  const data = Buffer.from(methodnames[i], 'utf8').toString('hex')
  const datawords = CryptoJS.enc.Hex.parse(data)
  const hashBuffer = Buffer.from(SHA256(datawords).toString(), 'hex')
  interopmethod[hashBuffer.readUInt32LE(0)] = methodnames[i]
}

export function disassemble(textScript: string): string {
  let out = ''
  const script = Buffer.from(textScript, 'hex')

  let ip = 0
  while (ip < script.length) {
    const opcode = script[ip]
    if (opcodetable.hasOwnProperty(opcode)) {
      const opcodedata = opcodetable[opcode]
      const inst = opcodedata.name

      if (opcodedata.name === 'SYSCALL') {
        if (opcodedata.name.length === 4) {
          const hash = script.readUInt32LE(ip + 1)
          let interopName = interopmethod[hash]
          if (interopName == null) interopName = hash
          out += `${inst} ${interopName}\n\n`
          ip += 4
        } else {
          ip += 1
          const methodLength = script.readUInt8(ip)
          ip += 1
          const data = script.slice(ip, ip + methodLength)
          const datawords = CryptoJS.enc.Hex.parse(data.toString('hex'))
          const hashBuffer = Buffer.from(SHA256(datawords).toString(), 'hex')
          const hash = hashBuffer.readUInt32LE(0)
          let interopName = interopmethod[hash]
          if (interopName == null) {
            interopName = '- UNKNOWN Interop: ' + data.toString('utf8')
          }
          out += `${inst} ${interopName}\n\n`
          ip += methodLength - 1 // -1 because ip always gets increased by one, whereas this is inclusive
        }
      } else if (opcodedata.size === 0) {
        out += `${inst}\n\n`
      } else {
        if (
          inst === 'PUSHDATA1' ||
          inst === 'PUSHDATA2' ||
          inst === 'PUSHDATA4' ||
          inst === 'SYSCALL'
        ) {
          let dataSize = 0
          switch (opcodedata.size) {
            case 1: {
              dataSize = script.readUInt8(ip + 1)
              break
            }
            case 2: {
              dataSize = script.readUInt16LE(ip + 1)
              break
            }
            case 4: {
              dataSize = script.readUInt32LE(ip + 1)
              break
            }
            default:
              // if you messed up the size you deserve to pay for it :-)
              out += `SOMEBODY MESSED UP THE PUSHDATA SIZE for ${opcodedata.name} at index ${ip} (size ${opcodedata.size})`
              break
          }

          const DATA_START_IDX = ip + opcodedata.size + 1
          const data = script.slice(DATA_START_IDX, DATA_START_IDX + dataSize)
          out += `${inst} ${data.toString('hex')}\n\n`
          ip += opcodedata.size + dataSize
        } else {
          const data = script.slice(ip + 1, ip + 1 + opcodedata.size)
          out += `${inst} ${data.toString('hex')}\n\n`
          ip += opcodedata.size
        }
      }
    } else {
      out += `INVALID OPCODE ${opcode.toString()}\n\n`
    }
    ip++
  }
  return out
}
