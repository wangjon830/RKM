import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        ScrollView, 
        TouchableOpacity,
        Modal,
        TextInput,
        KeyboardAvoidingView
      } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import IngredientItem from '../Pantry/IngredientItem';
import NewRecipeHeader from './NewRecipeHeader';
import NewIngredientModal from '../../shared/Ingredients/IngredientsModal';

import { useTheme } from 'react-native-paper';

const TagItem = (props) => {
  return (
    <View style={{...styles.tagContainer, borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1}}>
      <View style={styles.indexContainer}>
          <Text style={styles.index}>{props.index}</Text>
      </View>
      <View style={styles.tagContainer}>
          <Text style={styles.tag}>{props.tag}</Text>
          <TouchableOpacity onPress={() => props.deleteTag()}>
              <Ionicons style={styles.delete} name='trash-outline' size={19} color='#000'/>
          </TouchableOpacity>
      </View>
    </View>
  );
} 

const TagInputField = (props) => {
  const [tag, setTag] = React.useState();

  const handleAddTag = (value) => {
      props.addTag(value);
      setTag(null);
  }

  return (
    <View style={{marginTop: 10, width: '100%', flexDirection: 'row'}}>
      <TextInput style={{...styles.textInput, flex: 5, marginLeft: 10, margin: 5}} value={tag} onChangeText={text => setTag(text)} placeholder={'Write a tag'} placeholderTextColor={'#666666'}/>
      <TouchableOpacity onPress={() => handleAddTag(tag)} style={{flex:1}}>
        <View style={{...styles.button, marginVertical: 6}}>
            <Ionicons name='enter-outline' size={24} color='black'/>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function AddDescriptionTagsScreen({navigation, description, setDescription, tags, setTags}) {

  const addTag = (tag) => {
    if (tag == null) return;
    if(tags.length >= 10) return;
    setTags([...tags, tag])
  }

  const deleteTag = (deleteIndex) => {
    setTags(tags.filter((value, index) => index != deleteIndex));
  }

  return ( 
    <ScrollView>
        <NewRecipeHeader 
          navigation={navigation}
          onPress={() => {navigation.navigate('AddIngredientsScreen')}} 
          disabled={description == undefined || description == ''} 
          firstPage={false}
          lastPage={false}/>
        <View style={{marginVertical: 10, padding: 10, alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>Enter Description</Text>
            <View style={{marginTop: 10, width: '90%'}}>
                <TextInput 
                    value={description}
                    placeholder="Recipe Description"
                    multiline
                    numberOfLines={10}
                    placeholderTextColor="#666666"
                    style={styles.textInput}
                    onChangeText={(val) => {setDescription(val)}}
                />
            </View>
        </View>
        <View style={{paddingHorizontal: 10, alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>Enter Tags (Max 10)</Text>

            <TagInputField addTag={addTag}/>
            {
              tags.map((tag,index) => {
                return(
                  <View key={index} style={styles.tagContainer}>
                      <TagItem index={index + 1} tag={tag} deleteTag={() => deleteTag(index)}/>
                  </View>
                )
              })
            }
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#05375a',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    fontSize: 14,
    textAlignVertical:"top",
  },
  sectionTitle: {
    fontSize: 18, 
    marginTop: 10,
    marginBottom: 5, 
    fontWeight: 'bold'
  },
  tagContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  indexContainer: {
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  index: {
      color: '#000',
      fontSize: 12,
  },
  tagContainer: {
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 5,
      paddingVertical: 1,
  },
  tag: {
      color: '#000',
      width: '90%',
      fontSize: 12,
  },
  delete: {
      marginLeft: 10,
  },
  inputField: {
      color: '#fff',
      height: 50,
      flex: 1,
  },
  button: {
      height: 30,
      width: 30,
      borderRadius: 5,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
  },
});