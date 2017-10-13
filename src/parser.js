import { JSDOM } from 'jsdom';

export default (data) => {
  const { document } = (new JSDOM(data)).window;
  const table = [...document.querySelectorAll('tbody tr')];

  const result = table.map(el => ({
    rate: el.children[0].innerHTML,
    name: el.children[1].querySelector('a').innerHTML,
    points: el.children[2].innerHTML,
  }));

  return result;
};
