import React from 'react';
import { Image, SafeAreaView } from 'react-native';
import CarouselStyle from "./CarouselStyle";

import placeholder_post_image from '../../shared/Placeholders/post_image.png';

import { HOST_ADDRESS } from '@env';
import DataFetcher from '../../shared/dataFetcher';

export default function CarouselItem({ item, index }) {
  const [image, setImage] = React.useState(Image.resolveAssetSource(placeholder_post_image).uri);

  React.useEffect(async() => {
    var img = await DataFetcher.getImage(item);
    setImage(img);

        // data.forEach(async(imageId) => {
        //     var response = await fetch('http://' + HOST_ADDRESS + '/getImg?_id=' + imageId, {
        //         method: 'GET'
        //     })
        //     .then(response=>response.json())
        //     .then(data =>{
        //         if(data && data.success){
        //             newImages.push('data:image/png;base64,' + data.img);
        //             return;
        //         }
        //         else{
        //             console.log('Could not get image');
        //         }
        //     })  

        //     setImages(newImages);
        // })
  }, [])

  return (
    <SafeAreaView style={CarouselStyle.carouselItem}>
        <Image
        source={{ uri: image }}
        containerStyle={CarouselStyle.carouselImageContainer}
        style={CarouselStyle.carouselImage}
        />
    </SafeAreaView>
    );
}