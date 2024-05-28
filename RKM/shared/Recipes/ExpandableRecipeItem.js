import * as React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import { COLORS } from '../Styles/Colors';

import placeholder_post_image from '../../shared/Placeholders/post_image.png';
import DataFetcher from '../dataFetcher';

export default function ExpandableRecipeItem({ recipe_id, navigation }){
    const [recipeData, setRecipeData] = React.useState(null);
    const [image, setImage] = React.useState(Image.resolveAssetSource(placeholder_post_image).uri);
    const [authorData, setAuthorData] = React.useState(null);
    const [collapsed, setCollapsed] = React.useState(true);

    React.useEffect(async() => {
        var recipeData = await DataFetcher.getRecipeData(recipe_id);
        setRecipeData(recipeData);
        var authorData = await DataFetcher.getUserData(recipeData.user_id);
        setAuthorData(authorData);
        var image = await DataFetcher.getImage(recipeData.pictures[0]);
        setImage(image);
    }, [recipe_id]);

    return (
        recipeData != null && authorData != null ?
        <View>
            <TouchableOpacity style={styles.headerContainer} onPress={() => setCollapsed(!collapsed)}>
                <View style={styles.headerImageContainer}>
                    <Image style={styles.headerImage} source={{uri: image}}/>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        {recipeData.title}
                    </Text>
                    <Text style={styles.authorText}>
                        {authorData.username}
                    </Text>
                </View>
                <View style={styles.linkContainer}>
                    <Pressable style={styles.linkButton} 
                        onPress={() => navigation.navigate('ViewRecipeScreen', {recipe_id})}>
                        <Text style={styles.linkText}>View</Text>
                    </Pressable>
                    <Pressable>
                        {collapsed ?
                        <Ionicons name={'caret-down-outline'} size={20} color={COLORS.primaryColor}/>
                        :
                        <Ionicons name={'caret-up-outline'} size={20} color={COLORS.primaryColor}/>
                        }
                    </Pressable>
                </View>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed} align="center">
                <View style={styles.container}>
                    <View style={styles.dropdownImageContainer}>
                        <Image style={styles.dropdownImage} source={{uri: image}} />
                    </View>
                    <View style={styles.textContainer}>
                        <View style={styles.textBodyContainer}>
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionText} numberOfLines={5}>
                                    {recipeData.description}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.textTimeContainer}>
                                    <Text style={styles.timeTextBold}>Prep </Text>
                                    <Text style={styles.timeText}>{DataFetcher.getTimeString(recipeData.prep_time[0], recipeData.prep_time[1])}</Text>
                                </View>
                                <View style={styles.textTimeContainer}>
                                    <Text style={styles.timeTextBold}>Cook </Text>
                                    <Text style={styles.timeText}>{DataFetcher.getTimeString(recipeData.cook_time[0], recipeData.cook_time[1])}</Text>
                                </View>
                                <View style={styles.textTimeContainer}>
                                    <Text style={styles.timeTextBold}>Total </Text>
                                    <Text style={styles.timeText}>
                                        {DataFetcher.getTimeString(parseInt(recipeData.prep_time[0]) + parseInt(recipeData.cook_time[0]), 
                                        parseInt(recipeData.prep_time[1]) + parseInt(recipeData.cook_time[1]))}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Collapsible>
        </View>
        :
        <></>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      width: '98%',
      marginTop: 5,
      padding: 5,
      borderWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.25)',
      alignItems: 'center',
    },
    headerImageContainer: {
        width: Dimensions.get('screen').width * 0.1,
        height: Dimensions.get('screen').width * 0.1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    headerImage: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    titleContainer:{
        width: '60%',
        paddingHorizontal: 10,
    },
    titleText:{
        fontSize: 15,
    },
    authorText:{
        fontSize: 10,
        color: 'rgba(0,0,0,0.75)'
    },
    linkContainer:{
        width: '40%',
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
    },
    linkButton:{
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)'
    },
    linkText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '98%',
        height: 'auto',
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
      },
    dropdownImageContainer: {
        flex: 1
    },
    dropdownImage: {
        flex: 1,
        width: Dimensions.get('screen').width * 0.28,
        height: Dimensions.get('screen').width * 0.28,
    },
    textContainer:{
        flex: 2,
        flexDirection: 'column',
        paddingHorizontal: 10,
    },
    textBodyContainer:{
        flex: 4,
    }, 
    descriptionContainer:{
        paddingVertical: 5
    },
    descriptionText:{
        fontSize: 12,
        color: 'rgba(0,0,0,0.8)'
    },
    textTimeContainer:{
        flex: 1,
        flexDirection:'row',
    },
    timePrep:{
        flex: 1,
        flexDirection: 'row',
    },
    timeCook:{
        flex: 1,
        flexDirection: 'row',
    },
    timeTotal:{
        flex: 1,
        flexDirection: 'row',
    },
    timeTextBold:{
        fontSize: 10,
        fontWeight: 'bold',
    },
    timeText:{
        fontSize: 10,
    },
  });
  