import B from 'baconjs';
import R from 'ramda';
import {$, $$, getElemCSS, getElemWidth, setOffset, withLatestOnly} from './helper';

const getTouchDiff = R.curry((end, start) => Math.abs(end - start) > 10 ? (end < start ? 1 : -1) : 0);
const getOffsetStep = R.curry((step, wrapperWidth, totalItemsWidth, acc, dir) => {
  let maxOffset = totalItemsWidth - wrapperWidth;
  let nextStep = acc + (dir * step);
  let offsetModulo = nextStep % step;

  if (nextStep < 0) {
    return 0;
  } else if (nextStep > maxOffset) {
    return maxOffset;
  } else if (offsetModulo > 0) {
    return acc + (offsetModulo * dir);
  } else {
    return nextStep;
  }
});

let tap = 'click';
if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  tap = 'touchend';
}

const STEP
  = parseInt(getElemCSS('margin-left', $('.carousel-item')), 10)
  + parseInt(getElemCSS('margin-right', $('.carousel-item')), 10)
  + parseInt(getElemCSS('width', $('.carousel-item')), 10);

const totalItemsWidth = $$('.carousel-item').length * STEP;

const clickDirection = B.fromEvent($('.left'), tap).map(-1).merge(B.fromEvent($('.right'), tap).map(1));
const touchDirection = B.zipWith(getTouchDiff, [
  B.fromEvent($('.carousel-wrapper'), 'touchend').map(R.compose(R.prop('clientX'), R.head, R.prop('changedTouches'))),
  B.fromEvent($('.carousel-wrapper'), 'touchstart').map(R.compose(R.prop('clientX'), R.head, R.prop('touches')))
]);

const offset = clickDirection.merge(touchDirection).scan(0, getOffsetStep(STEP, getElemWidth('.carousel'), totalItemsWidth)).map(R.negate).onValue( setOffset($('.carousel-wrapper')) );

$('.carousel-wrapper').style.width = totalItemsWidth + 'px';
$('.carousel').classList.add('visible');
