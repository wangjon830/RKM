import * as React from 'react';
import RecommendedFeedItem from './RecommendedFeedItem';
import { StyleSheet, Text, View, Dimensions, Image, Pressable } from 'react-native';

export default function RecommendedFeedRow({ recipe_ids, navigation, status}){
    var row = []
    for(let i = 0; i < recipe_ids.length; i++){
        row.push(
            <RecommendedFeedItem key={'item'+recipe_ids[i]} recipe_id={recipe_ids[i]} navigation={navigation}/>
        )
    }

    return(
        <View style={styles.recommendedRow}>{row}</View>
    )
}

const styles = StyleSheet.create({
    recommendedRow: {
      flex: 1,
      flexDirection: 'row',
    }
  });