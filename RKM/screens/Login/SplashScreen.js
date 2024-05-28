import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@react-navigation/native';

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer]}
            animation="fadeInUpBig"
        >
            <Text style={[styles.title, {
                color: colors.text
            }]}>Welcome to RKM!</Text>
            <View style={[styles.button, {marginTop: 80}]}>
              <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
                  <View style={[styles.signIn, {backgroundColor: "#000000"}]}>
                      <Text style={[styles.textSign, {color: "#ffffff"}]}>Log in</Text>
                  </View>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity onPress={()=>navigation.navigate('RegisterScreen')}>
                  <View style={[styles.signIn, {backgroundColor: "#ffffff"}]}>
                      <Text style={[styles.textSign, {color: "#000000"}]}>Register</Text>
                  </View>
              </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#ffffff'
  },
  header: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#84D3FF',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  button: {
      alignItems: 'center',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  }
});