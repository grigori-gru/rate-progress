import { JSDOM } from 'jsdom';

export default (data) => {
  const { document } = (new JSDOM(data)).window;
  const table = [...document.querySelectorAll('tbody tr')];

  const getInner = el => (el.querySelector('a') ? el.querySelector('a').innerHTML : el.innerHTML);
  const result = table.map(el => ({
    rate: el.children[0].innerHTML,
    name: getInner(el.children[1]),
    points: el.children[2].innerHTML,
  }));

  return result;
};
