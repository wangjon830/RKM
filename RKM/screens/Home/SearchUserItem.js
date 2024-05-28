import * as React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Image } from 'react-native';

import DataFetcher from '../../shared/dataFetcher';

export default function SearchUserItem({ user_id, navigation }){
    const [user, setUser] = React.useState(null);

    React.useEffect(async() => {
        var userData = await DataFetcher.getUserData(user_id);
        setUser(userData);
    }, []);

    return (
        user != null ?
        <Pressable 
        style={styles.container}
        onPress={() => navigation.navigate('ViewAccountScreen', {id: user_id})}
        >
            {  user.pfp != undefined ?
            (
                <View style={styles.dropdownImageContainer}>
                    <Image style={styles.dropdownImage} source={{uri:user.pfp}}/>
                </View>
            )
            :
            (
                <View style={styles.dropdownImageContainer}>
                    <Image style={styles.dropdownImage} source={require('../../shared/Placeholders/post_image.png')} />
                </View>
            )
            }
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    {user.username}
                </Text>
            </View>

        </Pressable>
        :
        <Text>error user not found</Text>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      width: '98%',
      marginTop: 5,
      marginHorizontal: 5,
      padding: 5,
      borderWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.25)',
      alignItems: 'center',
    },
    dropdownImageContainer: {
        width: Dimensions.get('screen').width * 0.1,
        height: Dimensions.get('screen').width * 0.1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    dropdownImage: {
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
  });
  