import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'; 

import NewRecipeScreen from './NewRecipeScreen';
import AddDescriptionTagsScreen from './AddDescriptionTagsScreen';
import AddIngredientsScreen from './AddIngredientsScreen';
import WriteInstructionsScreen from './WriteInstructionsScreen';
import ConfirmRecipeScreen from './ConfirmRecipeScreen';

const NewRecipeStack = createStackNavigator();
export default function NewRecipeStackScreen({navigation}) {
  const [recipeImg, setRecipeImg] = React.useState('');
  const [recipeTitle, setRecipeTitle] = React.useState('');
  const [prepTime, setPrepTime] = React.useState([0, 0]);
  const [cookTime, setCookTime] = React.useState([0, 0]);
  const [description, setDescription] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [ingredientsList, setIngredientsList] = React.useState({});
  const [instructionsList, setInstructionsList] = React.useState([]);

  const resetRecipe = () => {
    setRecipeImg('');
    setRecipeTitle('');
    setPrepTime([0, 0])
    setCookTime([0, 0]);
    setTags([]);
    setIngredientsList([]);
    setInstructionsList([]);
  }
  return (
      <NewRecipeStack.Navigator 
        screenOptions={{
          headerShown: false
        }}>
          <NewRecipeStack.Screen name='NewRecipeScreen'>
            {props => <NewRecipeScreen {...props} 
              recipeImg={recipeImg} 
              setRecipeImg={setRecipeImg}
              recipeTitle={recipeTitle}
              setRecipeTitle={setRecipeTitle}
              prepTime={prepTime}
              setPrepTime={setPrepTime}
              cookTime={cookTime}
              setCookTime={setCookTime} />}
          </NewRecipeStack.Screen>
          <NewRecipeStack.Screen name='AddDescriptionTagsScreen'>
            {props => <AddDescriptionTagsScreen {...props} description={description} setDescription={setDescription} tags={tags} setTags={setTags}/>}
          </NewRecipeStack.Screen>
          <NewRecipeStack.Screen name='AddIngredientsScreen'>
            {props => <AddIngredientsScreen {...props} ingredientsList={ingredientsList} setIngredientsList={setIngredientsList} />}
          </NewRecipeStack.Screen>
          <NewRecipeStack.Screen name='WriteInstructionsScreen'>
            {props => <WriteInstructionsScreen {...props} instructionsList={instructionsList} setInstructionsList={setInstructionsList} />}
          </NewRecipeStack.Screen>
          <NewRecipeStack.Screen name='ConfirmRecipeScreen'>
            {props => <ConfirmRecipeScreen {...props} 
              tabNavigation={navigation} 
              ingredients={ingredientsList}
              instructions={instructionsList}
              recipeImg={recipeImg}
              recipeTitle={recipeTitle}
              prepTime={prepTime}
              cookTime={cookTime}
              description={description}
              tags={tags}
              resetRecipe={resetRecipe}
              />}
          </NewRecipeStack.Screen>
      </NewRecipeStack.Navigator>
  );
}