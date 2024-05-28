import * as React from 'react';
import { StyleSheet, 
        Text, 
        View,
        TouchableOpacity,
      } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useTheme } from 'react-native-paper';

export default function NewRecipeHeader({navigation, onPress, firstPage, lastPage, disabled}) {
  const { colors } = useTheme();

  return ( 
    <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {!firstPage && 
                <TouchableOpacity style={{marginLeft: 10, justifyContent: 'center'}} onPress={() => navigation.goBack()}>
                    <FontAwesome 
                        name="chevron-left"
                        color={colors.text}
                        size={20}
                    />
                </TouchableOpacity>
            }
            <Text style={{marginLeft: firstPage ? 0 : 10, fontSize: 20}}>Create Recipe</Text>
        </View>
            {lastPage ? 
                <TouchableOpacity style={styles.postButton} onPress={onPress} disabled={disabled}>
                    <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={{marginLeft: 10}} onPress={onPress} disabled={disabled}>
                    <Ionicons 
                        name="arrow-forward"
                        color={disabled ? '#D3D3D3' : colors.text}
                        size={25}
                    />
                </TouchableOpacity>
            }
    </View>
    )
}

const styles = StyleSheet.create({
  header:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  postButton: {
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#6ca5eb'
  },
  postText: {
      color: '#ffffff',
      fontSize: 16
  }
});