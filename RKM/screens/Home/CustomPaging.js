import * as React from 'react';
import { Pagination } from 'react-native-snap-carousel';
import CarouselStyle from './CarouselStyle';


export default function CustomPaging({ data, activeSlide }) {
  const settings = {
    dotsLength: data.length,
    activeDotIndex: activeSlide,
    containerStyle: CarouselStyle.carouselDotContainer,
    dotStyle: CarouselStyle.carouselDotStyle,
    inactiveDotStyle: CarouselStyle.carouselInactiveDotStyle,
    inactiveDotOpacity: 0.4,
    inactiveDotScale: 0.6,
  };
  return <Pagination {...settings} />;
}