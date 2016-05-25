import F from 'flyd';
import R from 'ramda';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const getElemCSS = (prop, el) => window.getComputedStyle(el).getPropertyValue(prop);
const getCarouselWidth = _ => parseInt(getElemCSS('width', $('.carousel')), 10);
const setOffset = R.curry((el, offset) => el.style.marginLeft = offset + 'px');

export {
  $, $$, getElemCSS, getCarouselWidth, setOffset
}
