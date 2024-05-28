import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../../shared/Styles/Colors';

import {HOST_ADDRESS} from '@env';
import { AuthContext } from '../../components/context';

function formatDate(time){
  var x=new Date(time.split(' ')[0]);
  var dd = x.getDate();
  var mm = x.getMonth()+1;
  var yy = x.getFullYear();
  return dd +"/" + mm+"/" + yy;
}

export default function Comment({ comment_info, navigation }) {
      return(
        <View style={styles.container}>
          <View style={styles.username_container}>
            <TouchableOpacity style={{flex:1}}>
              <Text style={styles.username_text}>{comment_info.username + ' '}</Text>
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={{fontSize: 8}}>{formatDate(comment_info.datetime)}</Text>
            </View>
          </View>
          <View style={styles.comment_container}>
            <Text style={styles.comment_text}>{'\t' + comment_info.comment_text}</Text>
          </View>
        </View>
      )
}

const styles = StyleSheet.create({
  container:{
    padding: 2,
    marginBottom: 5,
  },
  username_container:{
    flex:1,
    flexDirection:'row',
  },
  username_text:{
    fontWeight: 'bold',
    fontSize: 12,
    flex:1,
    justifyContent: 'flex-start',
  },
  comment_container:{
    flex:4,
    textAlign: 'left'
  },
  comment_text:{
    fontSize: 12,
    flex:1,
    justifyContent: 'flex-start'
  },
});