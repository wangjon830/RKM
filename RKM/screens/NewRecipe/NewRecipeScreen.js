import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        ScrollView, 
        Dimensions,
        TouchableOpacity,
        TextInput,
        Image,
        SafeAreaViewComponent
      } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync } from 'expo-image-manipulator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useTheme } from 'react-native-paper';
import NewRecipeHeader from './NewRecipeHeader';

export default function NewRecipeScreen({navigation,
                                            recipeImg,
                                            setRecipeImg,
                                            recipeTitle,
                                            setRecipeTitle,
                                            prepTime,
                                            setPrepTime,
                                            cookTime,
                                            setCookTime}) {
    const { colors } = useTheme();
    const [prepTimeInput, setPrepTimeInput] = React.useState(['0', '0']);
    const [cookTimeInput, setCookTimeInput] = React.useState(['0', '0']);

    React.useEffect(async() => {
        setPrepTimeInput([prepTime[0].toString(), prepTime[1].toString()]);
        setCookTimeInput([cookTime[0].toString(), cookTime[1].toString()]);
    }, [])

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
                    setRecipeImg(base64)
                })
            })
        };
    }

    return ( 
    <ScrollView>
        <NewRecipeHeader 
            onPress={() => {
                setPrepTime([parseInt(prepTimeInput[0]), parseInt(prepTimeInput[1])]);
                setCookTime([parseInt(cookTimeInput[0]), parseInt(cookTimeInput[1])]);
                navigation.navigate('AddDescriptionTagsScreen');
            }} 
            disabled={recipeImg.length == 0 || 
                    recipeTitle.length == 0 ||
                    (parseInt(cookTimeInput[0]) == 0 && parseInt(cookTimeInput[1]) == 0)} 
            firstPage={true}
            lastPage={false}/>
        <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={handlePickImage} style={{justifyContent:'center', alignItems:'center'}}>
                {
                recipeImg.length > 0 ? 
                <Image
                    style={styles.recipeImage} 
                    source={{uri: recipeImg}}
                /> 
                :
                <View style={[styles.recipeImage, {justifyContent:'center', alignItems:'center'}]}>
                    <FontAwesome 
                        name="plus"
                        color={colors.text}
                        size={25}
                    />
                    <Text>Tap to add image</Text>
                </View>
                }
            </TouchableOpacity>
                
            <View style={{marginTop: 15, width: '80%'}}>
                <TextInput 
                    value={recipeTitle}
                    placeholder="Recipe title"
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    onChangeText={(val) => {setRecipeTitle(val)}}
                />
            </View>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Prep Time</Text>
            <View style={styles.timeInputRow}>
                <TextInput 
                    value={prepTimeInput[0].toString()}
                    placeholder="Hours"
                    keyboardType="numeric"
                    placeholderTextColor="#666666"
                    style={styles.timeInput}
                    onChangeText={(val) => {setPrepTimeInput([val, prepTimeInput[1]])}}
                />
                <Text style={styles.timeLabel}>H</Text>
                <TextInput 
                    value={prepTimeInput[1].toString()}
                    placeholder="Minutes"
                    keyboardType="numeric"
                    placeholderTextColor="#666666"
                    style={styles.timeInput}
                    onChangeText={(val) => {setPrepTimeInput([prepTimeInput[0], val])}}
                />
                <Text style={styles.timeLabel}>M</Text>
            </View>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Cook Time</Text>
            <View style={styles.timeInputRow}>
                <TextInput 
                    value={cookTimeInput[0].toString()}
                    placeholder="Hours"
                    keyboardType="numeric"
                    placeholderTextColor="#666666"
                    style={styles.timeInput}
                    onChangeText={(val) => {setCookTimeInput([val, cookTimeInput[1]])}}
                />
                <Text style={styles.timeLabel}>H</Text>
                <TextInput 
                    value={cookTimeInput[1].toString()}
                    placeholder="Minutes"
                    keyboardType="numeric"
                    placeholderTextColor="#666666"
                    style={styles.timeInput}
                    onChangeText={(val) => {setCookTimeInput([cookTimeInput[0], val])}}
                />
                <Text style={styles.timeLabel}>M</Text>
            </View>
        </View>
    </ScrollView>
    )
}

const {height} = Dimensions.get("screen");
const height_img = height * 0.25;
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#84D3FF'
    },
    recipeImage: {
        width: height_img,
        height: height_img,
        borderRadius: 15,
        borderColor: '#BDBABA',
        borderWidth: 1
    },
    textInput: {
      paddingLeft: 10,
      paddingVertical: 5,
      color: '#05375a',
      borderWidth: 1,
      borderColor: '#C0C0C0',
      backgroundColor: '#ffffff',
      borderRadius: 10,
      fontSize: 20
    },
    sectionTitle: {
        fontSize: 18, 
        marginTop: 10,
        marginBottom: 5, 
        fontWeight: 'bold'
    },
    timeInputRow: {
        flexDirection: "row",
        marginLeft: 20,
        alignItems: 'center'
    },
    timeInput:{
        padding: 5,
        fontSize: 16,
        marginLeft: 20,
        width: 70,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C0C0C0',
    },
    timeLabel: {
        fontSize: 20,
        marginLeft: 10
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        margin: 2,
        padding: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    nameContainer: {
        width: '70%'
    },
    amountContainer: {
        width: '30%'
    },
    instructionText: {
        marginBottom: 5,
        fontSize: 18
    },
  });