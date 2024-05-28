import React, { useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

import RootStackScreen from './screens/Login/RootStackScreen';
import MainContainer from './MainContainer';

import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const storeUser = async(userData) => {
    try {
      await AsyncStorage.setItem('userToken', userData.userToken);
      await AsyncStorage.setItem('username', userData.username);
      await AsyncStorage.setItem('firstName', userData.firstName);
      await AsyncStorage.setItem('lastName', userData.lastName);
    } catch(e) {
      console.log(e);
    }
  }
  const removeUser = async() => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
    } catch(e) {
      console.log(e);
    }
  }

  const authContext = React.useMemo(() => ({
    signIn: async(foundUser) => {
      await storeUser(foundUser);
      dispatch({ type: 'LOGIN', token: foundUser.userToken });
    },
    signOut: async() => {
      await removeUser();
      dispatch({ type: 'LOGOUT' });
    },
    signUp: async(newUser) => {
      await storeUser(newUser);
      dispatch({ type: 'LOGIN', token: newUser.userToken });
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    },
    getUserData: async() => {
      const username = await AsyncStorage.getItem('username');
      const firstName = await AsyncStorage.getItem('firstName');
      const lastName = await AsyncStorage.getItem('lastName');
      const userToken = await AsyncStorage.getItem('userToken');
      return {
        username,
        firstName,
        lastName,
        userToken
      }
    },
    getUserToken: async() => {
      const userToken = await AsyncStorage.getItem('userToken');
      return userToken;
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
        <StatusBar backgroundColor='#000000' barStyle="light-content"/>
        <NavigationContainer theme={theme}>
          { loginState.userToken !== null ? (
            <MainContainer/>
          )
          :
            <RootStackScreen/>
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default App;