import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';

import { COLORS } from '../../shared/Styles/Colors';
import SearchUserItem from './SearchUserItem.js';
import ExpandableRecipeItem from '../../shared/Recipes/ExpandableRecipeItem';

const SearchTabNavigator = createMaterialTopTabNavigator()
export default function SearchResultsScreen({navigation, route, searchResults}){
  return (
    <SearchTabNavigator.Navigator
    initialRouteName='SearchRecipes'
    screenOptions={{
      tabBarStyle: styles.topTabBar,
      tabBarIndicatorStyle: styles.topTabBarUnderline,
      tabBarLabelStyle: styles.topTabBarText,
    }}>
      <SearchTabNavigator.Screen name='Recipes'>
        {(props) => <SearchData {...props} type={'recipes'} ids={searchResults.recipes}/>}
      </SearchTabNavigator.Screen>
      <SearchTabNavigator.Screen name='Users'>
        {(props) => <SearchData {...props} type={'users'} ids={searchResults.users}/>}
      </SearchTabNavigator.Screen>
    </SearchTabNavigator.Navigator>
);
}

function ErrorSearch(){
  return(
    <Text> There was a problem getting search data</Text>
  )
}

function SearchData({navigation, type, ids}) {
  const [content, setContent] = React.useState([]);
  React.useEffect(()=>{
    var content = [];
    if(type=='recipes')
      ids.forEach((id, i) => content.push(<ExpandableRecipeItem key={'recipe' + i} recipe_id={id} navigation={navigation}/>));
    else if(type == 'users')
      ids.forEach((id, i) => content.push(<SearchUserItem key={'user'+i} user_id={id} navigation={navigation}/>));
    setContent(content);
  }, [ids])
  return(
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {content}
      </ScrollView>
    </SafeAreaView>
  )
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
