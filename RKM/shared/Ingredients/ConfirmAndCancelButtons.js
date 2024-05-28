import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

export default function ConfirmAndCancelButtons({ style, handleConfirm, handleCancel, disabled }){

    return (
        <View style={[styles.containerRow, style]}>
            <View style={styles.button}>
                <TouchableOpacity onPress={handleCancel}>
                    <Feather 
                        name="x"
                        color={'#e65a6c'}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.button}>
                <TouchableOpacity 
                    disabled={disabled} 
                    onPress={handleConfirm}
                >
                    <Ionicons 
                        name="checkmark-sharp"
                        color={disabled ? '#D3D3D3' : '#48cf00'}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    button: {
        marginHorizontal: 10
    }
  });
  