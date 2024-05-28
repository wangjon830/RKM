import React from 'react';
import { Dimensions, StyleSheet, Text, View} from 'react-native';
import { COLORS } from '../Styles/Colors';

export default function DefaultHeader() {
    return (
        <View style={styles.header}>
            <View style={styles.logo}>
                <Text style={styles.headerText}>
                    RKM Logo
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: Dimensions.get('screen').width,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        position: 'absolute',
        left: 0,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: COLORS.headerTextColor,
        letterSpacing: 1,
    }
});