import { _decodeSubsection, getPacketAndType, lengthType, readType4Value, decodeAny, parsePacket } from './16';

test('Decode AB2 from 2nd place onwards = 1010 1011 0010 to 21', () => {
  expect(_decodeSubsection('AB2', 2, 5)).toBe(21);
  expect(_decodeSubsection('AB2', 4, 4)).toBe(11);
  expect(_decodeSubsection('AB2', 10, 2)).toBe(2);
});

test('Decode AB2 from 2nd place onwards = 1010 1011 0010 to 21', () => {
  expect(decodeAny('AB2', 2, 5)).toBe(21);
  expect(decodeAny('AB2F789', 2, 5)).toBe(21);
  expect(() => decodeAny('AB2F789', 29, 4)).toThrow()
  expect(decodeAny('AB2F789', 24, 4)).toBe(9)
  expect(decodeAny('AB2F789', 20, 4)).toBe(8)
  expect(decodeAny('AB2F789', 0, 4)).toBe(10)
  expect(decodeAny('AB2F789', 4, 4)).toBe(11)
  expect(decodeAny('AB2F789', 8, 4)).toBe(2)
});

test('Packet and type - type 4', () => {
  expect(getPacketAndType('D2FE28').packetVersion).toBe(6);
  expect(getPacketAndType('D2FE28').typeID).toBe(4);
  expect(getPacketAndType('D2FE28').lengthTypeId).toBe(lengthType.NOT_APPLICABLE);
})

test('Packet and type - type 6', () => {
  expect(getPacketAndType('38006F45291200').packetVersion).toBe(1);
  expect(getPacketAndType('38006F45291200').typeID).toBe(6);
  expect(getPacketAndType('38006F45291200').lengthTypeId).toBe(lengthType.TOTAL_LENGTH_BITS);
})

test('read type4 values', () => {
  expect(readType4Value('D2FE28', 0).value).toBe(2021);
  expect(readType4Value('D2FE28', 0).totalLength).toBe(6 + 15);
})

test('Fail on non type4 values', () => {
  expect(() => {
    readType4Value('38006F45291200', 0)
  }).toThrow();
})

test('Read version numbers 1', () => {
  let res = parsePacket('8A004A801A8002F478', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.sumOfVersions).toBe(16);
  }
})

test('Read version numbers 2', () => {
  let res = parsePacket('C0015000016115A2E0802F182340', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.sumOfVersions).toBe(23);
  }
})

test('Read version numbers 3', () => {
  let res = parsePacket('620080001611562C8802118E34', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.sumOfVersions).toBe(12);
  }
})

test('Read version numbers 4', () => {
  let res = parsePacket('A0016C880162017C3686B18A3D4780', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.sumOfVersions).toBe(31);
  }
})

test('totallength packet parsing', () => {
  let res = parsePacket('38006F45291200', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.totalLength).toBe(7 + 15 + 27);
    expect(res.sumOfVersions).toBe(1 + 6 + 2);
  }

})

test('sum of packets packet parsing', () => {
  let res = parsePacket('EE00D40C823060', 0);
  expect(res).toBeTruthy();
  if (res) {
    expect(res.sumOfVersions).toBe(7 + 2 + 4 + 1);
  }

})