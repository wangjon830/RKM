import * as React from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../../shared/Styles/Colors';
import Comment from './Comment';
import DataFetcher from '../dataFetcher';

import {HOST_ADDRESS} from '@env';
import { AuthContext } from '../../components/context';

export default function CommentSection({ recipe_id, user_id, navigation }) {
    const [comments, setComments] = React.useState([]);
    const [input, setInput] = React.useState('');

    const onRefresh = async() => {
        var comments = await DataFetcher.getComments(recipe_id);
        setComments(comments)
    }
    React.useEffect(async() => {
        await onRefresh()
    }, []);

    const items = comments.map((d) => <Comment key={d._id} comment_info={d}></Comment>)
    return(
        <View style={{flex:1}}>
        <ScrollView style={styles.view_comments} nestedScrollEnabled={true}>
            {items}
        </ScrollView>

        <View style={styles.post_comment}>
            <TextInput
                style={styles.post_comment_text}
                placeholder='Let the chef know how you feel!'
                multiline={true}
                value={input}
                onChangeText={text => {setInput(text)}}
            />
            <TouchableOpacity 
                onPress={async() => {
                    if(input != ''){
                        await DataFetcher.postComment(user_id, input, false, recipe_id)
                        setInput('')
                        await onRefresh()
                    }
                }}
                styles={styles.post_comment_submit}
            >
                <Text style={styles.post_comment_submit_text}>Post</Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    view_comments:{
        width: '100%',
        maxHeight: Dimensions.get('screen').height*0.6,
        padding: 5,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        marginBottom:5,
    },
    post_comment:{
        width: '100%',
        minHeight: 30,
        height: 'auto',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        padding:5,
        borderRadius: 7,
        borderWidth:1,
        borderColor: 'rgba(0,0,0,0.1)'
    },
    post_comment_text:{
        fontSize: 15,
        flex: 5,
        paddingHorizontal: 5,
    },
    post_comment_submit:{
        flex:1,
    },
    post_comment_submit_text:{
        fontSize:15,
        color: 'rgb(49, 108, 163)',
    }
});