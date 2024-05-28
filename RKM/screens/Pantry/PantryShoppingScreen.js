import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { COLORS } from '../../shared/Styles/Colors';
import DefaultHeader from '../../shared/Headers/DefaultHeader';
import HeaderStyle from '../../shared/Headers/HeaderStyle';
import IngredientItem from './IngredientItem';
import NewIngredientModal from '../../shared/Ingredients/IngredientsModal';
import { AuthContext } from '../../components/context';
import DataFetcher from '../../shared/dataFetcher';

const PantryStack = createStackNavigator();
export default function PantryShoppingScreen() {
  return (
      <PantryStack.Navigator>
          <PantryStack.Screen 
            name='PantryScreen' 
            component={PantryShoppingTabScreen}
            options={({navigation}) => ({
              headerStyle: HeaderStyle.header ,
              headerTitle: () => <DefaultHeader navigation={navigation}/>,
            })}/>
      </PantryStack.Navigator>
  );
}

const PantryTabNavigator = createMaterialTopTabNavigator()
function PantryShoppingTabScreen({navigation}) {
  return (
    <PantryTabNavigator.Navigator 
      initialRouteName='Pantry'
      screenOptions={{
        tabBarStyle: styles.topTabBar,
        tabBarIndicatorStyle: styles.topTabBarUnderline,
        tabBarLabelStyle: styles.topTabBarText,
      }}>
      <PantryTabNavigator.Screen name='Pantry' children={()=><IngredientsList listType={'pantry'}/>} optins={{headerShown: false}}/>
      <PantryTabNavigator.Screen name='Shopping List' children={()=><IngredientsList listType={'shopping_list'}/>} options={{headerShown: false}}/>
    </PantryTabNavigator.Navigator>
  );
}

function IngredientsList({navigation, listType}) {
  const { getUserToken } = React.useContext(AuthContext);
  const [ingredients, setIngredients] = React.useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editedIngredient, setEditedIngredient] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false)

  const getIngredients = async() => {
    var user_id = await getUserToken();
    var response = await DataFetcher.getIngredients(user_id, listType);
    setIngredients(response);    
  }

  const handleAddIngredient = async(category, name, quantity, unit) => {
    var newList = {...ingredients};
    newList[category][name] = {quantity, unit};
    setIngredients(newList);
    setEditedIngredient(null);
    setModalVisible(false);      

    var user_id = await getUserToken();
    await DataFetcher.addIngredient(user_id, category, name, quantity, unit);
  }

  const handleCancelIngredient = () => {
      setModalVisible(false);
      setEditedIngredient(null);
  }

  const handleEditIngredient = async(category, name, quantity, unit) => {
    handleRemoveIngredient(editedIngredient.category, editedIngredient.name);
    handleAddIngredient(category, name, quantity, unit);
    
    var newIngredients = {...ingredients}
    delete newIngredients[editedIngredient.category][editedIngredient.name];
    newIngredients[category][name] = {quantity, unit};
    setIngredients(newIngredients);
    setEditedIngredient(null);
    setModalVisible(false);    

    var user_id = await getUserToken();
    await DataFetcher.editIngredient(user_id, category, name, quantity, unit);
  }

  const handleEdit = (category, item) => {
    setEditedIngredient({
      category, 
      name: item, 
      quantity: ingredients[category][item]['quantity'], 
      unit: ingredients[category][item]['unit']
    });
    setModalVisible(true);
  }

  const handleRemoveIngredient = async(category, name) => {
    var newIngredients = {...ingredients}
    delete newIngredients[category][name];
    setIngredients(newIngredients);   
    
    var user_id = await getUserToken();
    await DataFetcher.removeIngredient(user_id, category, name, listType);
  }
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    (async() => {
      await getIngredients();
    })();
    wait(3000).then(() => setRefreshing(false))
  }, []);

  React.useEffect(async() => {
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
      <ScrollView contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {
            Object.keys(ingredients).map((category, i) => {
              var items = [];
              items.push(
                <View key={'category'+i} style={styles.headerTextContainer}>
                  <Text style={styles.headerText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                </View>
              );
              Object.keys(ingredients[category]).map((item, j) => {
                items.push(
                  <IngredientItem key={category + j} 
                    data={{name: item, ...ingredients[category][item]}} 
                    editItem={() => {handleEdit(category, item)}}
                    removeItem={() => {handleRemoveIngredient(category, item)}}
                  />
                )
              })
              if(Object.keys(ingredients[category]).length == 0){
                items.push(
                  <View key={category + 0} style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                    <Text>No ingredients in this category</Text>
                  </View>
                )
              }

              return <View key={"section" + i} style={styles.categorySection}>{items}</View>
            })
        }
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => {setModalVisible(true)}}>
          <FontAwesome 
              name="plus"
              color={"#ffffff"}
              size={25}
          />
        </TouchableOpacity>
      </View>
      <Modal 
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >  
        <View style={styles.modalOverlay}> 
          <NewIngredientModal 
            showCategory={true}
            ingredient={editedIngredient}
            handleAdd={editedIngredient != null ? handleEditIngredient : handleAddIngredient} 
            handleCancel={handleCancelIngredient}
          />
        </View>
      </Modal>
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
  scrollContainer: {
    width: '100%',
    padding: 20,
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
  headerTextContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categorySection: {
    marginBottom: 20
  },
  addButtonContainer: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    paddingBottom: 15,
    alignItems: 'center'
  },
  addButton: {
    height: 46,
    width: 46,
    borderRadius: 23,
    backgroundColor: '#8bd7fc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: 'rgba(128, 128, 128, 0.4)'
  },
});
