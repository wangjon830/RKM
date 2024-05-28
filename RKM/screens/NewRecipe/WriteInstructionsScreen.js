import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        ScrollView, 
        TouchableOpacity,
        TextInput,
        Modal
      } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from 'react-native-paper';
import ConfirmAndCancelButtons from '../../shared/Ingredients/ConfirmAndCancelButtons';
import NewRecipeHeader from './NewRecipeHeader';

export default function WriteInstructionsScreen({navigation, instructionsList, setInstructionsList}) {
  const { colors } = useTheme();
  const [instructionsInput, setInstructionsInput] = React.useState('');
  const [editIndex, setEditIndex] = React.useState(-1);
  const [modalVisible, setModalVisible] = React.useState(false);

  const resetInput = () => {
    setEditIndex(-1);
    setInstructionsInput('');
  }

  const handleAddInstruction = () => {
    var newInstructions = [...instructionsList];
    if(editIndex >= 0)
        newInstructions[editIndex] = instructionsInput
    else
        newInstructions.push(instructionsInput);
    setInstructionsList(newInstructions);
    resetInput();
    setModalVisible(false);
  }

  const handleCancelInstruction = () => {
    setModalVisible(false);
    resetInput();
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    setInstructionsInput(instructionsList[index]);
    setModalVisible(true);
  }

  const handleRemove = (index) => {
    var newInstructions = [...instructionsList];
    newInstructions.splice(index, 1);
    setInstructionsList(newInstructions);
  }

  return ( 
    <ScrollView>
        <NewRecipeHeader 
            navigation={navigation}
            onPress={() => {navigation.navigate('ConfirmRecipeScreen')}}
            disabled={instructionsList.length == 0} 
            firstPage={false}
            lastPage={false}/>
        <View style={{marginVertical: 10, padding: 10, alignItems: 'center'}}>
            <Text style={styles.sectionTitle}>Write instructions</Text>
            <View style={{width: '100%', marginLeft: 10}}>
                {
                instructionsList.length > 0 ? 
                instructionsList.map((step, i) => (
                    <View key={'step' + i} style={{flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10}}>
                        <Text style={styles.instructionText}>{i + 1}.</Text>
                        <Text style={[styles.instructionText, {marginLeft: 5, flex: 1}]}>{step}</Text>
                        <TouchableOpacity style={styles.itemButton}>
                            <Ionicons name={'pencil-sharp'} size={20} onPress={() => {handleEdit(i)}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemButton} onPress={() => {handleRemove(i)}}>
                            <Ionicons name={'trash-outline'} size={20}/>
                        </TouchableOpacity>
                    </View>
                ))
                :
                <Text style={{color: '#05375a', marginVertical: 10}}>Your recipe has no instructions yet!</Text>
                }
            </View>
            <TouchableOpacity style={{marginTop: 10}} onPress={() => {setModalVisible(true)}}>
                <FontAwesome 
                    name="plus-circle"
                    color={colors.text}
                    size={25}
                />
            </TouchableOpacity>
            <Modal 
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
            >  
                <View style={styles.modalOverlay}> 
                    <View style={styles.modalContainer}>
                        <View style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
                            <TextInput
                                style={[styles.textInput, {textAlignVertical: 'top'}]}
                                placeholder={'Write an instruction'}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(val) => setInstructionsInput(val)}
                                value={instructionsInput}/>
                        </View>
                        <ConfirmAndCancelButtons
                        handleConfirm={handleAddInstruction}
                        handleCancel={handleCancelInstruction}
                        disabled={instructionsInput.length == 0}/>
                    </View>
                </View>
            </Modal>
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
      width: '100%', 
      fontSize: 18, 
      fontWeight: 'bold', 
      paddingLeft: 5,
      paddingBottom: 5,
      borderBottomWidth: 1,
    },
    itemButton: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    collapsible: {
      flex: 1, 
      width: '100%', 
      paddingVertical: 10, 
      backgroundColor: '#a1c8e6'
    },
    instructionText: {
        marginBottom: 5,
        fontSize: 18
    },
    textInput: {
      flex: 1,
      padding: 10,
      marginHorizontal: 10,
      color: '#05375a',
      borderWidth: 1,
      borderColor: '#f2f2f2',
      backgroundColor: '#ffffff',
      borderRadius: 10
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: 'rgba(128, 128, 128, 0.4)'
    },
    modalContainer: {
        width: '100%', 
        backgroundColor: '#a1c8e6', 
        marginTop: '-25%', 
        paddingTop: 30,
    },
  });