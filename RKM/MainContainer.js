import * as React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

// Screens
import HomeStackScreen from './screens/Home/HomeFeedScreen';
import PantryShoppingStackScreen from './screens/Pantry/PantryShoppingScreen';
import AccountStackScreen from './screens/Account/AccountScreen';
import NewRecipeStackScreen from './screens/NewRecipe/NewRecipeStack';
import ToMakeStackScreen from './screens/ToMake/ToMakeScreen';

import { COLORS } from './shared/Styles/Colors';

// Screen names
const homeName = 'HomeStack';
const pantryName = 'PantryStack';
const accountName = 'AccountStack';
const newRecipeName = 'NewRecipeStack';
const toMakeName = 'ToMakeStack';

const Tab = createMaterialBottomTabNavigator();

export default function MainContainer(){
    return(
        <Tab.Navigator
            initialRouteName={homeName}
            labeled={ false }
            barStyle={{
                backgroundColor: COLORS.primaryColor,
            }}
            screenOptions={({route}) => ({
                tabBarShowLabel: false,
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let routeName = route.name;
                    size = 20;

                    if (routeName === homeName){
                        iconName = focused ? 'home' : 'home-outline';
                        return <Ionicons name={iconName} size={size} color={color}/>
                    } else if (routeName === pantryName){
                        iconName = focused ? 'cart' : 'cart-outline';
                        return <Ionicons name={iconName} size={size} color={color}/>
                    } else if (routeName === accountName){
                        iconName = focused ? 'user-circle' : 'user-circle-o';
                        return <FontAwesome name={iconName} size={size} color={color}/>
                    } else if (routeName === newRecipeName){
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                        return <Ionicons name={iconName} size={size} color={color}/>
                    } else if (routeName === toMakeName){
                        iconName = focused ? 'bookmark' : 'bookmark-o';
                        return <FontAwesome name={iconName} size={size} color={color}/>
                    }
                },
            })}>
            <Tab.Screen name={homeName} component={HomeStackScreen} options={{headerShown: false}}/>
            <Tab.Screen name={toMakeName} component={ToMakeStackScreen} options={{headerShown: false}}/>
            <Tab.Screen name={newRecipeName} component={NewRecipeStackScreen} options={{headerShown: false}}/>
            <Tab.Screen name={pantryName} component={PantryShoppingStackScreen} options={{headerShown: false}}/>
            <Tab.Screen name={accountName} component={AccountStackScreen} options={{headerShown: false}}/>

        </Tab.Navigator>
    )
}
