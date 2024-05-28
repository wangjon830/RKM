import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator>
        <RootStack.Screen name="SplashScreen"  component={SplashScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
    </RootStack.Navigator>
);

export default RootStackScreen;