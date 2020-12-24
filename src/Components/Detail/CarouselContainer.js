import React, {
  useState,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Carousel from "./Carousel";
import actions from "../../Data/constant";
import { debounce } from "lodash";

const { GET_IMAGES, MOVE_BEFORE, MOVE_NEXT, END_MOVE } = actions;

const initState = {
  currentIdx: 0,
  fullArray: [],
  renderArray: [],
  count: 0,
  isMovingNext: false,
  isMovingBefore: false,
};

const reducer = (state, action) => {
  const getNextIdx = (idx) => (idx + 1 >= state.count ? 0 : idx + 1);
  const getBeforeIdx = (idx) => (idx - 1 < 0 ? state.count - 1 : idx - 1);

  switch (action.type) {
    case GET_IMAGES:
      return {
        ...state,
        fullArray: action.images,
        renderArray: [action.images[0]],
        count: action.images.length,
      };
    case MOVE_NEXT:
      const nextIdx = getNextIdx(state.currentIdx);
      return {
        ...state,
        currentIdx: nextIdx,
        isMovingNext: true,
        renderArray: [...state.renderArray, state.fullArray[nextIdx]],
      };
    case MOVE_BEFORE:
      const beforeIdx = getBeforeIdx(state.currentIdx);
      return {
        ...state,
        currentIdx: beforeIdx,
        isMovingBefore: true,
        renderArray: [state.fullArray[beforeIdx], ...state.renderArray],
      };
    case END_MOVE:
      return {
        ...state,
        renderArray: action.newArray,
        isMovingBefore: false,
        isMovingNext: false,
      };
    default:
      throw new Error("Unhandled Action");
  }
};

const CarouselContainer = ({ images, size }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const { isMovingNext, isMovingBefore, currentIdx, fullArray } = state;
  const [viewSize, setViewSize] = useState(window.innerWidth);
  const [frameWidth, getFrameWidth] = useState(null);
  const frameRef = useRef(null);

  const getImages = () => dispatch({ type: GET_IMAGES, images });
  const moveNext = useCallback(() => dispatch({ type: MOVE_NEXT }), []);
  const moveBefore = useCallback(() => dispatch({ type: MOVE_BEFORE }), []);
  const endMove = () =>
    setTimeout(
      () => dispatch({ type: END_MOVE, newArray: [images[currentIdx]] }),
      300
    );

  const getViewSize = debounce(() => setViewSize(window.innerWidth), 200);
  window.addEventListener("resize", getViewSize);

  useEffect(() => {
    !fullArray.length && getImages();
    (isMovingNext || isMovingBefore) && endMove();
  }, [isMovingNext, isMovingBefore]);

  useEffect(() => {
    frameRef.current && getFrameWidth(frameRef.current.clientWidth);
    return () => window.removeEventListener("resize", getViewSize);
  }, [frameRef.current, viewSize]);

  return (
    <Carousel
      state={state}
      size={size}
      events={{ moveNext, moveBefore }}
      frameWidth={frameWidth}
      ref={frameRef}
    />
  );
};

export default CarouselContainer;
