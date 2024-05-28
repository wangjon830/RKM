import * as React from 'react';
import { StyleSheet, SafeAreaView, FlatList, RefreshControl, Modal, View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS } from '../../shared/Styles/Colors';
import SearchHeader from '../../shared/Headers/SearchHeader';
import FollowingFeedItem from './FollowingFeedItem';
import HeaderStyle from '../../shared/Headers/HeaderStyle';
import RecommendedFeedRow from './RecommendedFeedRow';
import ViewRecipe from '../../shared/Recipes/ViewRecipe';
import SearchResultScreen from './SearchResultScreen';
import ViewAccount from '../Account/ViewAccount';

import { AuthContext } from '../../components/context';
import DataFetcher from '../../shared/dataFetcher';

const HomeStack = createStackNavigator();
export default function HomeStackScreen() {
  const [searchResults, setSearchResults] = React.useState([]);

  return (
      <HomeStack.Navigator>
          <HomeStack.Screen 
            name='HomeScreen' 
            component={HomeScreen}
            options={({navigation}) => ({
              headerStyle: HeaderStyle.header ,
              headerTitle: () => <SearchHeader navigation={navigation} setSearchResults={setSearchResults}/>,
            })}/>
          <HomeStack.Screen
            name='ViewRecipeScreen'
            component={ViewRecipe}
            options={{
              headerShown: false,
            }}
          />
          <HomeStack.Screen
            name='ViewAccountScreen'
            component={ViewAccount}
            options={{
              headerShown: false,
            }}
          />
          <HomeStack.Screen
            name='SearchResultScreen'
            options={({navigation}) => ({
              headerStyle: HeaderStyle.header ,
              headerTitle: () => <SearchHeader navigation={navigation} setSearchResults={setSearchResults}/>,
            })}
          >
            {(props) => <SearchResultScreen {...props} searchResults={searchResults}/>}
          </HomeStack.Screen>
          
      </HomeStack.Navigator>
  );
}

const FeedTabNavigator = createMaterialTopTabNavigator()

function HomeScreen({navigation}) {
  return (
    <FeedTabNavigator.Navigator 
      initialRouteName='FollowingFeed'
      screenOptions={{
        tabBarStyle: styles.topTabBar,
        tabBarIndicatorStyle: styles.topTabBarUnderline,
        tabBarLabelStyle: styles.topTabBarText,
      }}>
      <FeedTabNavigator.Screen name='Following' component={FollowingFeed} />
      <FeedTabNavigator.Screen name='Recommended' component={RecommendedFeed} />
    </FeedTabNavigator.Navigator>
  );
}

function FollowingFeed({navigation}) {
  const { getUserToken } = React.useContext(AuthContext);

  const [refreshing, setRefreshing] = React.useState(false);
  const [postList, setPostList] = React.useState([]);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const renderFeed = async() => {
    const user_id = await getUserToken();
    var data = await DataFetcher.getFollowingRecipes(user_id);
    setPostList(data);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async() => {
      await renderFeed()
    })();
    wait(1500).then(() => setRefreshing(false))
  }, []);

  React.useEffect(async() =>{
    await renderFeed();
  }, []);
  
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
      <FlatList
        data={postList}
        renderItem={(item) => (
          <FollowingFeedItem recipe_id={item.item} navigation={navigation}/>
        )}
        keyExtractor={item => item}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        extraData={postList}
      />
    </SafeAreaView>
  );
}

function RecommendedFeed({navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [postList, setPostList] = React.useState({});

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async() => {
      await renderFeed();
    })();
    wait(3000).then(() => setRefreshing(false))
  }, []);
  
  const renderFeed = async() => {
    var data = await DataFetcher.getAllRecipes();
    setPostList(data);
  }

  React.useEffect(async() => {
    onRefresh()
  }, [])
  
  var rows = []
  var row = []
  for(let i = 0; i < postList.length; i++){
    if(i%3 == 0 && row.length > 0){
      rows.push(row)
      row = []
    }
    row.push(postList[i])
  }
  if(row.length > 0){
    rows.push(row)
    row = []
  }
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
      <FlatList
        data={rows}
        renderItem={(item) => (
          <RecommendedFeedRow recipe_ids={item.item} navigation={navigation}/>
        )}
        keyExtractor={item => item}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBgColor,
    width: '100%',
    height: '100%',
  },
  topTabBarText: {
    fontSize: 10,
  },
  topTabBar: {
    backgroundColor: COLORS.primaryBgColor,
  },
  topTabBarUnderline: {
    backgroundColor: COLORS.primaryColor,
  },
  recommendedRow: {
    flex: 1,
    flexDirection: 'row',
  }
});
