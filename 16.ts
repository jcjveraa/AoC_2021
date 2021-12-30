import { readLines, reRunWithInput } from './helpers';

runner_star_one(31);


async function runner_star_one(expectedTestResult: number, run = 'test', day = __filename.replace('.ts', '')) {
  // INIT
  const lines = await readLines(day, run);

  // LINES

  const result = parsePacket(lines[0], 0).sumOfVersions;
  if (run === 'test') {
    return reRunWithInput(result, expectedTestResult, runner_star_one);
  }
  console.log(`Star 1 - input result: ${result}`);

}

export enum lengthType {
  NOT_APPLICABLE, TOTAL_LENGTH_BITS, NUMBER_OF_SUB_PACKETS_CONTAINED

}

export function decoder(input: string) {
  let currentBitPos = 0;
  let scanning = true;

  while (scanning) {
    const currentPacket = getPacketAndType(input, currentBitPos);
  }

}

export function getPacketAndType(input: string, startBit = 0) {
  const packetVersion = decodeAny(input, startBit, 3);
  const typeID = decodeAny(input, startBit + 3, 3);

  let lengthTypeId = lengthType.NOT_APPLICABLE;
  if (typeID !== 4) {
    const ltype = decodeAny(input, startBit + 6, 1);
    if (ltype === 0) {
      lengthTypeId = lengthType.TOTAL_LENGTH_BITS
    } else {
      lengthTypeId = lengthType.NUMBER_OF_SUB_PACKETS_CONTAINED
    }
  }
  return { packetVersion: packetVersion, typeID: typeID, lengthTypeId: lengthTypeId }
}

export function decodeAny(hexString: string, startBit: number, numbits: number): number {
  const bitsRequested = startBit + numbits;
  const bitsAvailable = 4 * hexString.length;
  if (bitsRequested > bitsAvailable) {
    throw new Error(`Can't access bits ${startBit} to ${startBit + numbits} of a ${bitsAvailable} length input.`);

  }
  const startHexChar = Math.floor(startBit / 4);
  const endHexChar = startHexChar + Math.ceil(numbits / 4) + 1;

  const newStartBit = startBit - startHexChar * 4;

  return _decodeSubsection(hexString.substring(startHexChar, endHexChar), newStartBit, numbits);
}

export function _decodeSubsection(hexString: string, startBit: number, numBits = 5): number {
  const input = parseInt(hexString, 16);
  const totalBits = 4 * hexString.length;
  const bitShift = totalBits - (startBit + numBits)
  const bitMask = bitmask(numBits)

  return (input >> bitShift) & bitMask;
}

export function readType4Value(input: string, startBitPos: number) {
  const packetInfo = getPacketAndType(input, startBitPos);
  if (packetInfo.typeID !== 4) {
    throw new Error('This is not a type 4 packet but a ' + getPacketAndType(input).typeID);
  }

  let out_value = 0;

  let bitPos = startBitPos + 6; // We start at bit 6
  const bitMask = 0b1111;
  let continueScan = true;
  while (continueScan) {
    const raw_value = decodeAny(input, bitPos, 5);
    out_value = (out_value << 4) | (raw_value & bitMask)
    continueScan = (raw_value >> 4) === 1

    bitPos += 5;

  }

  return {
    totalLength: bitPos - startBitPos,
    value: out_value,
    sumOfVersions: packetInfo.packetVersion,
    version: packetInfo.packetVersion
  }
}

export function parsePacket(input: string, startBitPos: number) {
  const packetInfo = getPacketAndType(input, startBitPos);
  if(packetInfo.typeID === 4){
    return readType4Value(input, startBitPos);
  }
  else {
    return readOperatorValue(input, startBitPos);
  }

  throw new Error("Should not reach end of parsePacket");
}

export function readOperatorValue(input: string, startBitPos: number) {
  const packetInfo = getPacketAndType(input, startBitPos);
  if (packetInfo.typeID === 4) {
    throw new Error('This is not a type 4 packet but a ' + getPacketAndType(input).typeID);
  }

  if(packetInfo.lengthTypeId === lengthType.TOTAL_LENGTH_BITS){
    return readTotalLengthBits(input, startBitPos);
  }
  if(packetInfo.lengthTypeId === lengthType.NUMBER_OF_SUB_PACKETS_CONTAINED){
    return readSumOfPackets(input, startBitPos);
  }

  throw new Error("Should not reach end of readOperatorValue");  
}

export function readTotalLengthBits(input: string, startBitPos: number){
  const packetInfo = getPacketAndType(input, startBitPos);
  const totalLength = decodeAny(input, startBitPos+7, 15);
  let currentPosition = startBitPos+7+15;
  const endposition = currentPosition + totalLength;

  let sumOfVersions = packetInfo.packetVersion;

  while(currentPosition < endposition){
    const packet = parsePacket(input, currentPosition);
    if(!packet){
      throw new Error("Result is void");
      
    }
    currentPosition += packet.totalLength;
    sumOfVersions += packet.sumOfVersions;
  }

  return {
    totalLength: totalLength+7+15,
    version: packetInfo.packetVersion,
    sumOfVersions: sumOfVersions
  }
}

export function readSumOfPackets(input: string, startBitPos: number){
  const packetInfo = getPacketAndType(input, startBitPos);
  const sumOfPackets = decodeAny(input, startBitPos+7, 11);
  let currentPosition = startBitPos+7+11;
  let totalLength = 7+11;

  let sumOfVersions = packetInfo.packetVersion;

  for (let i = 0; i < sumOfPackets; i++) {
    const packet = parsePacket(input, currentPosition);
    currentPosition += packet.totalLength;
    totalLength += packet.totalLength;
    sumOfVersions += packet.sumOfVersions;
  }

  return {
    totalLength: totalLength,
    version: packetInfo.packetVersion,
    sumOfVersions: sumOfVersions
  }
}

function bitmask(width: number) {
  return Math.pow(2, width) - 1;
}