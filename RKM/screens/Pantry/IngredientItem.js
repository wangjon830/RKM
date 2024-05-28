import * as React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../shared/Styles/Colors';

export default function IngredientItem({ data, editItem, removeItem }){
    return (
        <View style={styles.container}>
            <View style={styles.nameContainer}>
                <Text style={styles.ingredientText}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</Text>
            </View>
            <View style={styles.quantityContainer}>
                <Text style={styles.ingredientText}>{data.quantity + ' ' + data.unit}</Text>
            </View>
            <Pressable style={styles.addContainer} onPress={editItem}>
                <Ionicons name={'pencil-sharp'} size={20} color={COLORS.primaryColor}/>
            </Pressable>
            <Pressable style={styles.removeContainer} onPress={removeItem}>
                <Ionicons name={'trash-outline'} size={20} color={COLORS.primaryColor}/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      margin: 2,
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(0,0,0,0.1)'
    },
    nameContainer: {
        width: '60%',
    },
    quantityContainer: {
        width: '18%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addContainer: {
        width: '9%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeContainer: {
        width: '9%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ingredientText: {
        fontSize: 15,
        fontWeight: "200",
    }
  });
  