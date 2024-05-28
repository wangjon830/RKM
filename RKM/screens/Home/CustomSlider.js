
import { View, Dimensions, Image } from 'react-native';
import Carousel from "react-native-snap-carousel";
import CarouselItem from "./CarouselItem";
import React, { useState } from "react";
import CustomPaging from "./CustomPaging";
import CarouselStyle from "./CarouselStyle";

export default function CustomSlider({ data }) {
    const [slideIndex, setSlideIndex] = useState(0);

    return (
    <View style={CarouselStyle.carouselContainer}>
        <Carousel 
            inactiveSlideScale={1}
            sliderWidth={Dimensions.get("screen").width}
            sliderHeight={Dimensions.get("screen").height}
            itemWidth={Dimensions.get("screen").width}
            data={data}
            renderItem={({item, index}) => {
                return <CarouselItem item={item} index={index}/>;
            }}
            onSnapToItem={(index) => setSlideIndex(index)}/>
        <View style={CarouselStyle.paginationContainer}>
            <CustomPaging data={data} activeSlide={slideIndex} />
        </View>
    </View>

    );
}