import difBuilder from '../src/lib/dif-builder';

const data = [
  {
    rate: 3, name: 'c', points: 8, prevPoints: 6, prevRate: 3,
  },
  {
    rate: 4, name: 'd', points: 7, prevPoints: 4, prevRate: 4,
  },
  {
    rate: 1, name: 'a', points: 10, prevPoints: 8, prevRate: 2,
  },
  {
    rate: 2, name: 'b', points: 9, prevPoints: 9, prevRate: 1,
  },
  {
    rate: 5, name: 'e', points: 6,
  },
];

const expected = [
  {
    name: 'a', rateDif: '1(2)', pointsDif: '10(+2)', status: 'success',
  },
  {
    name: 'b', rateDif: '2(1)', pointsDif: '9(0)', status: 'danger',
  },
  {
    name: 'c', rateDif: '3(3)', pointsDif: '8(+2)', status: null,
  },
  {
    name: 'd', rateDif: '4(4)', pointsDif: '7(+3)', status: null,
  },
  {
    name: 'e', rateDif: '5', pointsDif: '6', status: 'success',
  },
];

test('get dif', () => {
  const res = difBuilder(data);
  expect(res).toEqual(expected);
});
