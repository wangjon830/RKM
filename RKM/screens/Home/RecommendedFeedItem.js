import * as React from 'react';
import { StyleSheet, View, Dimensions, Image, Pressable } from 'react-native';

import DataFetcher from '../../shared/dataFetcher';

import placeholder_post_image from '../../shared/Placeholders/post_image.png'

export default function RecommendedFeedItem({ navigation, status, recipe_id}){
    
    const [post, setPost] = React.useState(null);
    const [image, setImage] = React.useState(Image.resolveAssetSource(placeholder_post_image).uri);
    const [postAuthor, setAuthor] = React.useState({});
    React.useEffect(async() => {
        var postData = await DataFetcher.getRecipeData(recipe_id);
        setPost(postData);
        var authorData = await DataFetcher.getUserData(postData.user_id);
        setAuthor(authorData);
        var image = await DataFetcher.getImage(postData.pictures[0]);
        setImage(image);
    }, []);
    
    return (
        <Pressable
        onPress={() => 
            navigation.navigate('ViewRecipeScreen', {recipe_id})}>
            <View style={styles.container}>
                <Image source={{uri: image}} style={styles.mainImage}/>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width*0.3333,
        height: Dimensions.get('screen').width*0.3333,
        padding: 0.25,
    },
    mainImage: {
        flex: 1,
        height: undefined,
        width: undefined
    }
  });

