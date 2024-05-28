import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        ScrollView, 
        TouchableOpacity,
        Modal,
      } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import IngredientItem from '../Pantry/IngredientItem';
import NewRecipeHeader from './NewRecipeHeader';
import NewIngredientModal from '../../shared/Ingredients/IngredientsModal';

import { useTheme } from 'react-native-paper';

export default function AddIngredientsScreen({navigation, ingredientsList, setIngredientsList}) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalIngredient, setModalIngredient] = React.useState(null);

  const handleAddIngredient = (name, quantity, unit) => {
    var newList = {...ingredientsList}
    newList[name] = {quantity, unit};
    setIngredientsList(newList);
    setModalIngredient(null);
    setModalVisible(false);      
  }

  const handleCancelIngredient = () => {
      setModalVisible(false);
      setModalIngredient(null);
  }

  const handleEdit = (item) => {
    setModalIngredient({
      name: item, 
      quantity: ingredientsList[item]['quantity'], 
      unit: ingredientsList[item]['unit']
    });
    setModalVisible(true);
  }

  const handleRemove = (item) => {
    var newList = {...ingredientsList}
    delete newList[item];
    setIngredientsList(newList);
  }

  return ( 
    <ScrollView>
        <NewRecipeHeader 
          navigation={navigation}
          onPress={() => {navigation.navigate('WriteInstructionsScreen')}} 
          disabled={Object.keys(ingredientsList).length == 0} 
          firstPage={false}
          lastPage={false}/>
        <View style={{marginVertical: 10, padding: 10, alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>Enter ingredients</Text>
            {
              
              Object.keys(ingredientsList).length > 0 ? 
              Object.keys(ingredientsList).map((item, i) => {  
                var data = {'name': item, 'quantity': ingredientsList[item]['quantity'], 'unit': ingredientsList[item]['unit']}  
                 
                return <IngredientItem 
                          key={'ingredient' + i} 
                          data={data} 
                          handleEdit={() => {handleEdit(item)}}
                          handleRemove={() => {handleRemove(item)}}/>
              })
              :
              <Text style={{color: '#05375a', marginVertical: 10}}>Your recipe has no ingredients yet!</Text>
            }
            <TouchableOpacity style={{marginTop: 10}} onPress={() => {setModalVisible(true)}}>
                <FontAwesome 
                    name="plus-circle"
                    color={colors.text}
                    size={25}
                />
            </TouchableOpacity>
        </View>
        <Modal 
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >  
          <View style={styles.modalOverlay}> 
            <NewIngredientModal 
              showCategory={false}
              ingredient={modalIngredient}
              handleAdd={handleAddIngredient} 
              handleCancel={handleCancelIngredient}
            />
          </View>
        </Modal>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: 'rgba(128, 128, 128, 0.4)'
  },
  sectionTitle: {
    width: '100%', 
    fontSize: 18, 
    fontWeight: 'bold', 
    paddingLeft: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
});