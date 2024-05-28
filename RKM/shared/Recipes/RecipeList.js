import * as React from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ExpandableRecipeItem from '../../shared/Recipes/ExpandableRecipeItem';

export default function RecipeList({ navigation, recipes }){
    const [content, setContent] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    
    const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
    }
  
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      (async() => {
        if(recipes == undefined)
          return;
        var content = [];
        recipes.forEach((id, i) => content.push(<ExpandableRecipeItem key={'recipe' + i} recipe_id={id} navigation={navigation}/>));
        setContent(content);
      })();
      wait(3000).then(() => setRefreshing(false))
    }, []);
  
    React.useEffect(()=>{
      onRefresh();
    }, [recipes])
  
    return(
      <ScrollView contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
        {content}
      </ScrollView>
    )
  }
  
const styles = StyleSheet.create({
    scrollContainer: {
        padding: 10,
        flexGrow: 1,
    },
});