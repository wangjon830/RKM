import * as React from 'react';
import { Dimensions,
        StyleSheet, 
        Text, 
        TextInput,
        View,
        TouchableOpacity,
        Image 
      } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import placeholder_image from "../../shared/Placeholders/profile_pic.png";

export default function AccountModal({userData, prevPfp, handleCancel, handleConfirm}) {
  const [pfp, setPfp] = React.useState(Image.resolveAssetSource(placeholder_image).uri);
  const [pfpChanged, setPfpChanged] = React.useState(false);
  const [username, setUsername] = React.useState(userData.username);
  const [firstName, setFirstName] = React.useState(userData.first_name);
  const [lastName, setLastName] = React.useState(userData.last_name);
  const [disabled, setDisabled] = React.useState(true);
  const [bio, setBio] = React.useState(userData.bio);

  const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
  }))
    
  const handlePickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });

      if(!result.cancelled){
          const manipResult = await manipulateAsync(
              result.uri,
              [{resize: { width: 1000, height: 1000}}],
              { base64: true, format:'png'}
          )
          .then(result => {
              toDataURL(result.uri)
              .then(base64 => {
                  setPfp(base64)
              })
          })
      };

      setPfpChanged(true);
  }

  const handleInputChange = () => {
    if(username != undefined && username.length && 
      firstName != undefined && firstName.length &&
      lastName != undefined && lastName.length)
      setDisabled(false);
    else
      setDisabled(true);
  }

  React.useEffect(() => {
    handleInputChange();
    if(prevPfp != null)
      setPfp(prevPfp);
  }, [userData, prevPfp])

  return (
    <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={handleCancel}>
                <Feather 
                    name="x"
                    color={'#e65a6c'}
                    size={30}
                />
            </TouchableOpacity>
            <Text style={{marginLeft: 10, fontSize: 20}}>Edit profile</Text>
          </View>
          <TouchableOpacity 
              disabled={disabled} 
              onPress={() => {
                handleConfirm(userData.profile_pic == null && !pfpChanged ? null : pfp, username, firstName, lastName, bio)
              }}
          > 
              <Ionicons 
                  name="checkmark-sharp"
                  color={disabled ? '#D3D3D3' : '#48cf00'}
                  size={30}
              />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Image style={styles.pfpImage} source={{uri:pfp}}/>
          <TouchableOpacity
              style={{margin: 10,}}
              onPress={handlePickImage}
          >
            <View style={styles.pfpButton}>
              <Text style={{color: "#69a1fa"}}>Change profile picture</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputItem}>
            <Text style={styles.inputHeader}>Username</Text>
            <TextInput 
                value={username}
                placeholder="Username"
                placeholderTextColor="#666666"
                style={styles.textInput}
                onChangeText={(val) => {
                  setUsername(val);
                  handleInputChange();
                }}
            /> 
          </View>
          
          <View style={styles.inputItem}>
            <Text style={styles.inputHeader}>Name</Text>
            <View style={{flexDirection: 'row'}}>
              <TextInput 
                value={firstName}
                placeholder="First"
                placeholderTextColor="#666666"
                style={[styles.textInput, {flex: 1}]}
                onChangeText={(val) => {
                  setFirstName(val);
                  handleInputChange();
                }}
              />
              <TextInput 
                value={lastName}
                placeholder="Last"
                placeholderTextColor="#666666"
                style={[styles.textInput, {flex: 1}]}
                onChangeText={(val) => {
                  setLastName(val);
                  handleInputChange();
                }}
              />
            </View>
          </View>
          
          <View style={styles.inputItem}>
            <Text style={styles.inputHeader}>Bio</Text>
            <TextInput 
                value={bio}
                placeholder="Bio"
                placeholderTextColor="#666666"
                style={styles.textInput}
                onChangeText={(val) => setBio(val)}
            /> 
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%', 
    height: '100%',
    backgroundColor: '#ffffff', 
  },
  modalHeader: {
    padding: 10,
    flexDirection: 'row', 
    alignItems:'center', 
    justifyContent: 'space-between'
  },
  inputContainer: {
    alignItems: 'center', 
    flex: 1, 
    paddingTop: 20
  },
  pfpImage: {
    width: Dimensions.get('screen').width * 0.3,
    height: Dimensions.get('screen').width * 0.3,
    borderRadius: Dimensions.get('screen').width,
  },
  inputItem: {
    width: '100%',
    padding: 10,
  },
  inputHeader:{
    fontSize: 18
  },
  textInput: {
      color: '#05375a',
      borderWidth: 1,
      borderColor: '#888888',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      paddingLeft: 10
  },
  resultItem: {
    paddingLeft: 10,
    paddingVertical: 3,
    backgroundColor: '#ffffff'
  },
  containerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  dropdownContainer: {
      width: '25%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginRight: '5%',
      overflow:'visible', 
      height: 160,
      zIndex: 100,
  }
});