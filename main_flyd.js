import F from 'flyd';
import lift from 'flyd/module/lift';
import R from 'ramda';
import {$, $$, getElemCSS, getElemWidth, setOffset, withLatestOnly} from './helper';

const getTouchDiff = R.curry((end, start) => Math.abs(end - start) > 10 ? (end < start ? 1 : -1) : 0);
const getOffsetStep = R.curry((step, maxOffset$, acc, dir) => {
  let nextStep = acc + (dir * step);
  let offsetModulo = nextStep % step;

  if (nextStep < 0) {
    return 0;
  } else if (nextStep > maxOffset$()) {
    return maxOffset$();
  } else if (offsetModulo > 0) {
    return acc + (offsetModulo * dir);
  } else {
    return nextStep;
  }
});

const STEP
  = parseInt(getElemCSS('margin-left', $('.carousel-item')), 10)
  + parseInt(getElemCSS('margin-right', $('.carousel-item')), 10)
  + parseInt(getElemCSS('width', $('.carousel-item')), 10);

const windowDims = F.stream(0);
const clickToLeft = F.stream();
const clickToRight = F.stream();
const touchStart = F.stream();
const touchEnd = F.stream();
const totalItemsWidth = F.stream($$('.carousel-item').length * STEP);
const carouselWidth = F.map(F.curryN(2, getElemWidth)('.carousel'), windowDims);

const maxOffset = lift(R.subtract, totalItemsWidth, carouselWidth);

const tsx = F.map(R.compose(R.prop('clientX'), R.head, R.prop('touches')), touchStart);
const tex = F.map(R.compose(R.prop('clientX'), R.head, R.prop('changedTouches')), touchEnd);

const touchDirection = withLatestOnly(getTouchDiff, tex, tsx);

const clickDirection = F.merge(
  F.map(R.always(-1), clickToLeft),
  F.map(R.always(1), clickToRight)
);

const offset = F.scan(getOffsetStep(STEP, maxOffset), 0, F.merge(clickDirection, touchDirection));

F.on(setOffset($('.carousel-wrapper')), R.map(R.negate, offset));

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  $('.left').addEventListener('touchend', clickToLeft);
  $('.right').addEventListener('touchend', clickToRight);
  $('.carousel-wrapper').addEventListener('touchstart', touchStart);
  $('.carousel-wrapper').addEventListener('touchend', touchEnd);
} else {
  $('.left').addEventListener('click', clickToLeft);
  $('.right').addEventListener('click', clickToRight);
}

$('.carousel-wrapper').style.width = totalItemsWidth() + 'px';
$('.carousel').classList.add('visible');
window.addEventListener('resize', windowDims);
