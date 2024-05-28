import React from 'react';
import { StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../Styles/Colors';

import DataFetcher from '../dataFetcher';

export default function SearchHeader({navigation, setSearchResults}) {
    const searchBar = React.useRef();
    const [searchInput, setSearchInput] = React.useState('');

    const handleSearchButton = async() => {
        if(searchInput.length == 0)
            searchBar.current.focus();
        else{
            var response = await DataFetcher.search(searchInput);
            setSearchResults(response);
            navigation.navigate('SearchResultScreen', {results: response});
        }
    }

    return (
        <View style={styles.header}>
            <View style={styles.logo}>
                <Text style={styles.headerText}>
                    RKM Logo
                </Text>
            </View>
            <View style={styles.search}>
                <TextInput 
                    placeholder="Search"
                    ref={searchBar}
                    style={{flex: 1, fontSize: 16, marginRight: 10}}
                    onChangeText={(val) => {setSearchInput(val.toLowerCase())}}
                />
                <Pressable onPress={handleSearchButton}>
                    <Ionicons name={'search-outline'} size={20} color={COLORS.primaryColor}/>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: '100%',
        flexDirection: 'row',   
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginLeft: -10,
        width: '30%'
    },
    search: {
        width: '70%',
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: COLORS.headerTextColor,
        letterSpacing: 1,
    }
});