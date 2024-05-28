import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';

import DataFetcher from '../../shared/dataFetcher';

const RegisterScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        displayname: '',
        password: '',
        confirm_password: '',
        isValidEmail: true,
        isValidDisplayName: false,
        passwordLengthReq: false,
        passwordUppercaseReq: false,
        passwordNumberReq: false,
        secureTextEntry: true,
        confirmSecureTextEntry: true,
        displayNameWarning: false,
        displayDisplayNameWarning: false,
        displayEmailWarning: false,
        displayPasswordWarning: false,
        displayConfirmPasswordWarning: false,
        displayTakenEmailWarning: false,
        displayTakenDisplayNameWarning: false,
    });

    const { colors } = useTheme();

    const verifyEmail = (val) => {
        return val.trim().toLowerCase()
        .match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
    }

    const verifyDisplayName = (val) => {
        return val && val.trim().toLowerCase().match(/^[a-zA-Z0-9_]+$/i) && val.trim().length >= 6
    }

    const handleFirstNameChange = (val) => {
        setData({
            ...data,
            firstName: val
        });
    }

    const handleLastNameChange = (val) => {
        setData({
            ...data,
            lastName: val
        });
    }

    const emailInputChange = (val) => {
        if( verifyEmail(val) ) {
            setData({
                ...data,
                email: val,
                isValidEmail: true,
            });
        } else {
            setData({
                ...data,
                email: val,
                isValidEmail: false,
            });
        }
    }

    const displaynameInputChange = (val) => {
        if( verifyDisplayName(val) ) {
            setData({
                ...data,
                displayname: val,
                isValidDisplayName: true,
            });
        } else {
            setData({
                ...data,
                displayname: val,
                isValidDisplayName: false,
            });
        }
    }
    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val,
            passwordLengthReq: val && val.length > 8,
            passwordUppercaseReq: /[A-Z]/.test(val),
            passwordNumberReq: /\d/.test(val)
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirmSecureTextEntry: !data.confirmSecureTextEntry
        });
    }

    const validateInput = () => {
        let validName = !(data.firstName && data.firstName.length == 0 || data.lastName && data.lastName.length == 0);
        let validDisplayName = data.isValidDisplayName
        let validEmail = data.isValidEmail;
        let validPassword = data.passwordLengthReq && data.passwordNumberReq && data.passwordUppercaseReq;
        let validConfirm = data.password == data.confirm_password;
        setData({
            ...data,
            displayNameWarning: !validName,
            displayEmailWarning: !validEmail,
            displayDisplayNameWarning: !validDisplayName,
            displayPasswordWarning:!validPassword,
            displayConfirmPasswordWarning: !validConfirm
        });
        return validName && validEmail && validPassword && validConfirm && validDisplayName
    }

    const handleRegister = async(firstname, lastname, email, username, password) => {
        var response = await DataFetcher.register(firstname, lastname, email, username, password);
        if(response.success)
            navigation.navigate('SplashScreen');
        else{
            if(response.message.includes('email')){
                setData({
                    ...data,
                    displayTakenEmailWarning:true
                })
            } else if(response.message.includes('username')){
                setData({
                    ...data,
                    displayTakenDisplayNameWarning:true
                })
            } else {
                setData({
                    ...data,
                    displayTakenDisplayNameWarning:false,
                    displayTakenEmailWarning:false
                })
            }
        }    
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
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView>
                { data.displayTakenDisplayNameWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>This display name is already in use.</Text>
                    </Animatable.View>
                    :
                    null
                }
                { data.displayTakenEmailWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>This email is already in use.</Text>
                    </Animatable.View>
                    :
                    null
                }
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Name</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.action, {flex: 1}]}>
                        <TextInput 
                            placeholder="First"
                            placeholderTextColor="#666666"
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleFirstNameChange(val)}
                        />
                    </View>
                    <View style={[styles.action, {flex: 1}]}>
                        <TextInput 
                            placeholder="Last"
                            placeholderTextColor="#666666"
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            autoCapitalize="words"
                            onChangeText={(val) => handleLastNameChange(val)}
                        />
                    </View>
                </View>
                { data.displayNameWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>First and last name cannot be empty.</Text>
                    </Animatable.View>
                    :
                    null
                }

                <View style={styles.action}>
                    <FontAwesome 
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput 
                        placeholder="Display Name"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => displaynameInputChange(val)}
                    />
                    {data.isValidDisplayName ? 
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
                <View>
                    <View style={{flexDirection: "row"}}>
                        { data.displayname && data.displayname.length >= 6 ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            :
                            <Foundation 
                                name="alert"
                                color="#fcba03"
                                size={20}
                            />
                        }
                        <Text style={styles.passwordReq}>6 characters minimum</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        {verifyDisplayName(data.displayname) ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            :
                            <Foundation 
                                name="alert"
                                color="#fcba03"
                                size={20}
                            />
                        }
                        <Text style={styles.passwordReq}>Only letters and numbers</Text>
                    </View>
                </View>
                { data.displayDisplayNameWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please enter a name.</Text>
                    </Animatable.View>
                    :
                    null
                }

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
                    />
                    {data.isValidEmail ? 
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
                { data.displayEmailWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please enter a valid email.</Text>
                    </Animatable.View>
                    :
                    null
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
                <View>
                    <View style={{flexDirection: "row"}}>
                        {data.passwordLengthReq ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            :
                            <Foundation 
                                name="alert"
                                color="#fcba03"
                                size={20}
                            />
                        }
                        <Text style={styles.passwordReq}>8 characters minimum</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        {data.passwordUppercaseReq ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            :
                            <Foundation 
                                name="alert"
                                color="#fcba03"
                                size={20}
                            />
                        }
                        <Text style={styles.passwordReq}>At least one uppercase character</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        {data.passwordNumberReq ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather 
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            :
                            <Foundation 
                                name="alert"
                                color="#fcba03"
                                size={20}
                            />
                        }
                        <Text style={styles.passwordReq}>At least one numeric character</Text>
                    </View>
                </View>
                { data.displayPasswordWarning ?  
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Please use a password that fulfills all the requirements.</Text>
                    </Animatable.View>
                    :
                    null
                }
                <View style={[styles.action, {marginTop: 20}]}>
                    <Feather 
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput 
                        placeholder="Confirm password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        onChangeText={(val) => handleConfirmPasswordChange(val)}
                    />
                    <TouchableOpacity
                        onPress={updateConfirmSecureTextEntry}
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
                { data.displayConfirmPasswordWarning ? 
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Passwords do not match.</Text>
                    </Animatable.View>
                    :
                    null
                }

                <View style={styles.textPrivate}>
                    <Text style={styles.color_textPrivate}>
                        By signing up you agree to our{" "}
                    </Text>
                    <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>Terms of service{" "}</Text>
                    <Text style={styles.color_textPrivate}>and{" "}</Text>
                    <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>Privacy policy</Text>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.register}
                        onPress={() => {
                            if(validateInput()){
                                handleRegister(data.firstName, data.lastName, data.email, data.displayname, data.password);
                                return;
                            } else {
                                return;
                            }
                        }}
                    >
                    <View style={[styles.register, {backgroundColor: "#000000"}]}>
                        <Text style={[styles.textSign, {
                            color:'#fff'
                        }]}>Register</Text>
                    </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default RegisterScreen;

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
        flex: Platform.OS === 'ios' ? 3 : 5,
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
        fontSize: 16
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        padding: 10,
        borderRadius: 15
    },
    textInput: {
        flex: 1,
        marginTop: -5,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    register: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },
    passwordReq: {
        marginLeft: 5
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
  });