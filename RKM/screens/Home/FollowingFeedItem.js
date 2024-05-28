import * as React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';

import { COLORS } from '../../shared/Styles/Colors';
import CustomSlider from './CustomSlider'

import { AuthContext } from '../../components/context';
import DataFetcher from '../../shared/dataFetcher';

function renderViewMore(onPress){
    return(
        <Text onPress={onPress} style={{fontSize:10, color: 'grey'}}>View more</Text>
    )
}

function renderViewLess(onPress){
    return(
        <Text onPress={onPress} style={{fontSize:10, color: 'grey'}}>View less</Text>
    )
}

export default function FollowingFeedItem({ recipe_id, navigation }){
    const { getUserToken } = React.useContext(AuthContext);

    const [post, setPost] = React.useState(null);
    const [postAuthor, setAuthor] = React.useState({});
    const [user, setUser] = React.useState('');

    React.useEffect(async() => {
        var userData = await getUserToken();
        setUser(userData);

        var postData = await DataFetcher.getRecipeData(recipe_id);
        setPost(postData);

        var authorData = await DataFetcher.getUserData(postData.user_id);
        setAuthor(authorData);
    }, []);

    return (
        post != null && postAuthor != null ?
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ViewRecipeScreen', {recipe_id})}>
                        <Text style={styles.titleText}>{post.title}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.authorContainer}>
                    <View style={styles.authorPfpContainer}>
                        {
                            postAuthor.profile_pic != undefined ?
                            (
                                <Image style={styles.authorPfpImage} source={{uri:postAuthor.profile_pic}}/>
                            ):
                            (   
                                <Image style={styles.authorPfpImage} source={require('../../shared/Placeholders/profile_pic.png')} />
                            )
                        }
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('ViewAccountScreen', {id: postAuthor._id})}>
                        <Text style={styles.authorText}>{' ' + postAuthor.username}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {
                        post.pictures != undefined && post.pictures.length > 0 ?
                        (
                            <CustomSlider data={post.pictures} />
                        ):
                        (
                            <CustomSlider data={[]} />
                        )
                    }
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoSubitem}>
                        <Text style={styles.infoTextBold}>Prep Time</Text>
                        <Text style={styles.infoText}>{DataFetcher.getTimeString(post.prep_time[0], post.prep_time[1])}</Text>
                    </View>
                    <View style={styles.infoSubitem}>
                        <Text style={styles.infoTextBold}>Cook Time</Text>
                        <Text style={styles.infoText}>{DataFetcher.getTimeString(post.cook_time[0], post.cook_time[1])}</Text>
                    </View>
                    <View style={styles.infoSubitem}>
                        <Text style={styles.infoTextBold}>Total Time</Text>
                        <Text style={styles.infoText}>
                            {DataFetcher.getTimeString(parseInt(post.prep_time[0]) + parseInt(post.cook_time[0]), 
                                parseInt(post.prep_time[1]) + parseInt(post.cook_time[1]))}
                        </Text>
                    </View>
                </View>
                <View style={styles.linkContainer}>
                    <Pressable style={styles.linkButton} 
                        onPress={() => 
                            navigation.navigate('ViewRecipeScreen', {recipe_id})}>
                        <Text style={styles.linkText}>View Recipe</Text>
                    </Pressable>
                </View>
                <View style={styles.descriptionContainer}>
                    <ViewMoreText
                        numberOfLines={1}
                        renderViewMore={renderViewMore}
                        renderViewLess={renderViewLess}
                        textStyle={styles.descriptionText}
                    >
                        <Text style={{fontWeight:'bold'}}>
                            {postAuthor.username}:
                        </Text>
                        <Text>
                            {' ' + post.description}
                        </Text>
                    </ViewMoreText>
                </View>
            </View>
            :
            <></>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        height: 'auto',
        paddingBottom: 20,
    },
    titleContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    authorContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        flex: 1,
        flexDirection: 'row',
    },
    authorText: {
        fontSize: 15,
    },
    authorPfpContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    authorPfpImage: {
        flex:1,
        height: 20,
        width: 20,
        borderRadius: 10,
    },
    imageContainer: {
        width: '100%',
        height: 'auto',
        borderWidth: 2,
        borderColor: 'black',
    },
    infoContainer: {
        width: '100%',
        flex: 3,
        flexDirection: 'row',
    },
    infoSubitem: {
        width: '33.33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.2)',
        paddingTop: 10,
        paddingBottom: 10,
    },
    infoTextBold: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 15,
    },
    descriptionContainer: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
    },
    descriptionBoldText:{
        fontSize: 12,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 12,
        textAlign: 'left',
    },
    linkContainer: {
        width: '100%',
        padding:5,
        flex: 1,
        flexDirection: 'row',
    },
    linkButton:{
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)'
    },
    linkText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    linkLikeButton: {
        position: 'absolute',
        right: 40,
        top: 5,
    },
    linkSaveButton: {
        position: 'absolute',
        right: 10,
        top: 5,
    }
  });

