import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    StyleSheet ,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../../components/context';

import DataFetcher from '../../shared/dataFetcher';

const LoginScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        email: '',
        password: '',
        validEmailIndicator: false,
        secureTextEntry: true,
        isValidEmail: true,
    });

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);
    const verifyEmail = (val) => {
        return val.trim().toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }
    const emailInputChange = (val) => {
        if( verifyEmail(val) ) {
            setData({
                ...data,
                email: val,
                validEmailIndicator: true,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                email: val,
                validEmailIndicator: false,
            });
        }
    }

    const handleValidEmail = (val) => {
        if( verifyEmail(val) ) {
            setData({
                ...data,
                isValidEmail: true
            });
        } else {
            setData({
                ...data,
                isValidEmail: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val
            });
        } else {
            setData({
                ...data,
                password: val
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const loginHandle = async(email, password) => {
        if ( data.email.length == 0 || data.password.length == 0 ) {
            Alert.alert('Wrong Input!', 'Email or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        var userInfo = await DataFetcher.login(email, password);
        signIn(userInfo);
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={{marginLeft: 10, marginTop: 15}} onPress={() => navigation.goBack()}>
            <FontAwesome 
                name="chevron-left"
                color={colors.text}
                size={25}
            />
        </TouchableOpacity>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Email"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => emailInputChange(val)}
                    onEndEditing={(e)=>handleValidEmail(e.nativeEvent.text)}
                />
                {data.validEmailIndicator ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            { data.isValidEmail ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Please enter a valid email.</Text>
            </Animatable.View>
            }
            
            <View style={[styles.action, {marginTop: 20}]}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>
            
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {loginHandle( data.email, data.password )}}
                >
                    <View style={[styles.signIn, {backgroundColor: "#000000"}]}>
                      <Text style={[styles.textSign, {color: "#ffffff"}]}>Log in</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={{color: '#000000', marginTop:15, fontWeight:'bold'}}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#84D3FF'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        padding: 10,
        borderRadius: 15
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: -5,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });