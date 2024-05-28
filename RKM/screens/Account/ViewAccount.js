import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Image, TouchableOpacity, Modal } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { COLORS } from '../../shared/Styles/Colors';
import RecipeList from '../../shared/Recipes/RecipeList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { AuthContext } from '../../components/context';
import DataFetcher from '../../shared/dataFetcher';
import placeholder_image from "../../shared/Placeholders/profile_pic.png";

export default function ViewAccount({route, navigation}) {
  const { getUserToken } = React.useContext(AuthContext);
  
  const [userData, setUserData] = React.useState({});
  const [isFollowing, setFollowing] = React.useState(false);
  const [userToken, setUserToken] = React.useState(null);
  const [pfp, setPfp] = React.useState(Image.resolveAssetSource(placeholder_image).uri);
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'myRecipes', title: 'My Recipes' },
    { key: 'likedRecipes', title: 'Liked Recipes' },
  ]);
  const myRecipes = () => (<RecipeList navigation={navigation} recipes={userData.recipes}/>)
  const likedRecipes = () => (<RecipeList navigation={navigation} recipes={userData.liked_recipes}/>)

  const [refreshing, setRefreshing] = React.useState(false);

   const followUser = async() => {
      var user_id = await getUserToken();
      await DataFetcher.followUser(user_id, userData._id);
      setFollowing(true);
    }

    const unfollowUser = async() => {
      var user_id = await getUserToken();
      await DataFetcher.unfollowUser(user_id, userData._id);
      setFollowing(false);
    }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async() => {    
        var userData = await DataFetcher.getUserData(route.params.id);
        setUserData(userData);
        var userToken = await getUserToken();
        if(userToken != userData._id){
          var isFollowing = await DataFetcher.checkFollowingUser(userToken, userData._id)
          if(isFollowing != undefined){
              setFollowing(isFollowing)
          }
        }

        if(userData.profile_pic != null){
          var image = await DataFetcher.getImage(userData.profile_pic);
          setPfp(image);
        }
    })();
    wait(3000).then(() => setRefreshing(false))
  }, []);

  React.useEffect(async() => {
    var userToken = await getUserToken();
    setUserToken(userToken);
    onRefresh();
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
          animationType='fade'
          transparent={true}
          visible={refreshing}
          >
          <View style={[styles.container, {backgroundColor: 'rgba(0,0,0,0.75)', padding:20}]}>
            <View style={{backgroundColor: 'rgba(0,0,0,0)', padding: 20, alignItems: 'center', justifyContent:'center', height: '100%'}}>
              <Text style={{color:'#fff', fontSize: 15, position: 'absolute', top:'30%'}}>Loading...</Text>
            </View>
          </View>
      </Modal>
        <TouchableOpacity style={{marginLeft: 10, marginTop: 10}} onPress={() => navigation.goBack()}>
            <FontAwesome 
                name="chevron-left"
                size={25}
            />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <View style={styles.headerImageContainer}>
            <Image style={styles.pfpImage} source={{uri:pfp}}/>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.usernameText}>{userData.username}</Text>
            <View style={styles.headerTextSubcontainer}>
              <View style={styles.headerItem}>
                <Text style={styles.boldHeaderSubtext}>Recipes</Text>
                <Text style={styles.headerSubtext}>{userData.posts != undefined ? userData.posts.length : 0}</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.boldHeaderSubtext}>Followers</Text>
                <Text style={styles.headerSubtext}>{userData.followers}</Text>
              </View>
              <View style={styles.headerItem}>
                <Text style={styles.boldHeaderSubtext}>Following</Text>
                <Text style={styles.headerSubtext}>{userData.following}</Text>
              </View>
            </View>            
          </View>
        </View>
        <View style={styles.bioContainer}>
          <Text style={styles.boldHeaderSubtext}>
            {userData.first_name + ' ' + userData.last_name}
          </Text>

          {userData.bio != null ? 
          <Text style={styles.headerSubtext}>
            {userData.bio}
          </Text>  : 
          null
          }
          
        </View>
        {
            userToken == userData._id ?
            <></>
            :
            (isFollowing
            ?
            <TouchableOpacity
            style={{margin: 10,}}
            onPress={unfollowUser}>
                <View style={[styles.followButton, {backgroundColor: "rgba(0,0,0,0.5)"}]}>
                    <Text style={{color: "#ffffff"}}>Unfollow</Text>
                </View>
            </TouchableOpacity>
            :
            <TouchableOpacity
            style={{margin: 10,}}
            onPress={followUser}>
                <View style={[styles.followButton, {backgroundColor: "rgba(0,0,0,0.75)"}]}>
                  <Text style={{color: "#ffffff"}}>Follow</Text>
                </View>
            </TouchableOpacity>)
        }

        <TabView
          navigationState={{ index, routes }}
          renderTabBar={props => (
          <View style={styles.recipesHeaderContainer}>
            <TouchableOpacity style={styles.recipesTabLeft} onPress={() => setIndex(0)}>
              <Text style={{...styles.recipesHeaderText, fontWeight: index == 0 ? 'bold' : 'normal'}}>
                My Recipes
              </Text>
            </TouchableOpacity>
            <View style={styles.recipesDivider}></View>
            <TouchableOpacity style={styles.recipesTabRight} onPress={() => setIndex(1)}>
              <Text style={{...styles.recipesHeaderText, fontWeight: index == 1 ? 'bold' : 'normal'}}>
                Liked Recipes
              </Text>
            </TouchableOpacity>
          </View>
        )}
          renderScene={SceneMap({
            myRecipes,
            likedRecipes,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('screen').width }}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBgColor,
  },
  followButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  headerContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  boldHeaderSubtext: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerSubtext: {
    fontSize: 13,
  },
  headerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTextContainer: {
    justifyContent: 'center',
    flex: 1 
  },
  headerTextSubcontainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  headerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldHeaderSubtext: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerSubtext: {
    fontSize: 13,
  },
  pfpImage: {
    width: Dimensions.get('screen').width * 0.3,
    height: Dimensions.get('screen').width * 0.3,
    borderRadius: Dimensions.get('screen').width,
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
  },  
  bioContainer: {
    width: '100%',
    padding: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  recipesHeaderContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    flexDirection: 'row'
  },
  recipesTabLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipesTabRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipesDivider: {
    borderRightColor: 'rgba(0,0,0,0.1)',
    borderRightWidth: 0.5,
    height: '100%'
  },
  recipesHeaderText: {
    fontSize: 15,
    textAlign: 'center',
  }
});
