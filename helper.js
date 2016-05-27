import F from 'flyd';
import R from 'ramda';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const getElemCSS = (prop, el) => window.getComputedStyle(el).getPropertyValue(prop);
const getElemWidth = selector => parseInt(getElemCSS('width', $(selector)), 10);
const setOffset = R.curry((el, offset) => el.style.marginLeft = offset + 'px');

const withLatestOnly = (fn, s1, s2) => F.map(f => f(s2()), F.map(fn, s1));

export {
  $, $$, getElemCSS, getElemWidth, setOffset, withLatestOnly
}
