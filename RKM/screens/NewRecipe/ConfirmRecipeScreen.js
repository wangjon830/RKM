import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        ScrollView, 
        Dimensions,
        Image
      } from 'react-native';

import { AuthContext } from '../../components/context';
import NewRecipeHeader from './NewRecipeHeader';

import DataFetcher from '../../shared/dataFetcher';

export default function ConfirmRecipePage({navigation,
                                            tabNavigation,
                                            ingredients,
                                            instructions,
                                            recipeImg,
                                            recipeTitle,
                                            prepTime,
                                            cookTime,
                                            tags,
                                            description,
                                            resetRecipe}) {
  const { getUserToken } = React.useContext(AuthContext);

  const handleConfirm = async() => {
    var user_id = await getUserToken();
    await DataFetcher.addRecipe(user_id, recipeTitle, recipeImg, instructions, ingredients, prepTime, cookTime, description, tags);
    navigation.navigate('NewRecipeScreen');
    tabNavigation.navigate('HomeStack');
    resetRecipe();
  }

    const getTimeString = (hours, minutes) => {
        var timeString = '';
        if(hours > 0){
            timeString += hours + ' hour';
            if(hours > 1){
                timeString += 's ';
            }

            if(minutes > 0){
                timeString += ' and ';
            }
        }
        if(minutes > 0) {
            timeString += minutes + ' minute';
            if(minutes > 1){
                timeString += 's';
            }
        }
        return timeString;
    }

  return ( 
    <ScrollView>
        <NewRecipeHeader 
            navigation={navigation}
            onPress={handleConfirm} 
            disabled={recipeImg.length == 0 || recipeTitle.length == 0} 
            firstPage={false}
            lastPage={true}/>
        <View style={{alignItems: 'center'}}>
            <Image
                style={styles.recipeImage} 
                source={{uri: recipeImg}}
            /> 
               
            <Text style={{fontSize: 22, marginTop: 10}}>{recipeTitle}</Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Prep Time:</Text>
            <Text>{getTimeString(prepTime[0], prepTime[1])}</Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Cook Time:</Text>
            <Text>{getTimeString(cookTime[0], cookTime[1])}</Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Description:</Text>
            <Text>{description}</Text>
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={[styles.row, {borderBottomWidth: 1, borderBottomColor: '#ACA9A9'}]}/>
            {
                tags.map((item, i) => {
                return <View key={'ingredient' + i} style={styles.row}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.ingredientText}>{item}</Text>
                        </View>
                    </View>
                })
            }
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={[styles.row, {borderBottomWidth: 1, borderBottomColor: '#ACA9A9'}]}>
                <View style={styles.nameContainer}>
                    <Text style={[styles.ingredientText, {color: '#ACA9A9'}]}>Name</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={[styles.ingredientText, {color: '#ACA9A9'}]}>Amount</Text>
                </View>
            </View>
            {
                Object.keys(ingredients).map((item, i) => {
                var data = ingredients[item];
                return <View key={'ingredient' + i} style={styles.row}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.ingredientText}>{item}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.ingredientText}>{data['quantity'] + ' ' + data['unit']}</Text>
                    </View>
                </View>
                })
            }
        </View>

        <View style={{padding: 10}}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {
                instructions.map((step, i) => (
                    <View key={'step' + i} style={{flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10}}>
                        <Text style={styles.instructionText}>{i + 1}.</Text>
                        <Text style={[styles.instructionText, {marginLeft: 5, flex: 1}]}>{step}</Text>
                    </View>
                ))
            }
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
        width: '20%',
        marginLeft: 5
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