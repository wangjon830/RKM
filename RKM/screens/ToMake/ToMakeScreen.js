import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, RefreshControl, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../../shared/Styles/Colors';
import DefaultHeader from '../../shared/Headers/DefaultHeader';
import HeaderStyle from '../../shared/Headers/HeaderStyle';
import ToMakeItem from './ToMakeItem';

import { AuthContext } from '../../components/context';
import DataFetcher from '../../shared/dataFetcher';

const ToMakeStack = createStackNavigator();
export default function ToMakeStackScreen() {
  return (
      <ToMakeStack.Navigator>
          <ToMakeStack.Screen 
            name='ToMakeScreen' 
            component={ToMakeScreen}
            options={{
              headerStyle: HeaderStyle.header,
              headerTitle: () => <DefaultHeader/>
            }}/>
      </ToMakeStack.Navigator>
  );
}

function ToMakeScreen({navigation}) {
  const { getUserToken } = React.useContext(AuthContext);
  // const recipes = React.useContext(Recipes);
  const [recipes, setRecipes] = React.useState({'saved_recipes':[], 'liked_recipes':[]});
  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const updateRecipes = async() => {
    const user_id = await getUserToken(); 
    var recipes = await DataFetcher.getLikedRecipes(user_id);
    setRecipes(recipes);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async() => {
      await updateRecipes();
    })();
    wait(300).then(() => setRefreshing(false))
  }, []);

  React.useEffect(async() => {
    await updateRecipes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
      <SafeAreaView style={styles.container}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              Recipes to Make
            </Text>
          </View>
          {recipes['saved_recipes'].map((recipe, i) => (<ToMakeItem key={'recipe' + i} recipe_id={recipe} navigation={navigation} updateRecipes={updateRecipes}/>))}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBgColor,
  },
  scrollContainer: {
    width: '100%',
    padding: 10,
  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
