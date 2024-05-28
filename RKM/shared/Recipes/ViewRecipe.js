import React from 'react';
import { 
    View, 
    Text, 
    Image,
    TouchableOpacity, 
    StyleSheet ,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from 'react-native-paper';
import { AuthContext } from '../../components/context';
import DataFetcher from '../dataFetcher';
import placeholder_post_image from '../../shared/Placeholders/post_image.png';
import CommentSection from './CommentSection'

// checklist constants
const NOT_OWNED = 0
const OWNED = 1;
const ADDED = 2;

const ViewRecipe = ({route, navigation}) => {
    const { colors } = useTheme();
    const { getUserToken } = React.useContext(AuthContext);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Animatable.View 
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                >
                    <TouchableOpacity style={{marginLeft: 10, marginBottom: 10}} onPress={() => navigation.goBack()}>
                        <FontAwesome 
                            name="chevron-left"
                            color={colors.text}
                            size={25}
                        />
                    </TouchableOpacity>
                    <ViewRecipeMain getUserToken={getUserToken} recipe_id={route.params.recipe_id} navigation={navigation} colors={colors}/>
                </Animatable.View>
            </View>
        </ScrollView>
    )
}

class ViewRecipeMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            authorData: null,
            recipeData: null,
            recipeImages: [],
            checklist: [],
            ingredientsTable: [],
            recipeSaved: false,
            recipeLiked: false,
            modalVisible: false,
            userRating: 0,
            userPrevRating: 0
        };

        this.handleSaveRecipe = this.handleSaveRecipe.bind(this);
        this.handleAddIngredient = this.handleAddIngredient.bind(this);
    }

    async loadData() {
        var user_id = await this.props.getUserToken();
        var recipeRes = await DataFetcher.getRecipeData(this.props.recipe_id);
        var authorRes = await DataFetcher.getUserData(recipeRes.user_id);
        var ratingRes = await DataFetcher.getRating(user_id, this.props.recipe_id);
        var recipeSaved = await DataFetcher.checkRecipeSaved(user_id, this.props.recipe_id, 'saved_recipes');
        var recipeLiked = await DataFetcher.checkRecipeSaved(user_id, this.props.recipe_id, 'liked_recipes');

        // get images
        var recipeImages = [];
        for(var i = 0; i < recipeRes.pictures.length; i++){
            var image = await DataFetcher.getImage(recipeRes.pictures[i]);
            recipeImages.push(image);
        }

        // TODO: populate pantry checklist
        var checklist = [];
        Object.keys(recipeRes.ingredients).forEach((item) => {
            checklist.push(NOT_OWNED);
        })

        var ingredientsTable = [];
        var ingredients = recipeRes.ingredients;
        Object.keys(ingredients).forEach((item, i) => {
            var ingredientsRow = [];
            ingredientsRow.push(item);
            ingredientsRow.push(ingredients[item].quantity + ' ' + ingredients[item].unit);
            if(checklist[i] != OWNED)
                ingredientsRow.push(this.addToShoppingListButton(checklist, i));
            else
                ingredientsRow.push('')

            ingredientsTable.push(ingredientsRow);
        })
        
        // populate data
        this.setState({
            user_id: user_id,
            recipeData: recipeRes,
            authorData: authorRes,
            recipeSaved,
            recipeLiked,
            recipeImages,
            checklist,
            ingredientsTable,
            userRating: ratingRes,
            userPrevRating: ratingRes
        })
    }

    async componentDidMount() {
        await this.loadData();
    }

    createRatingStars() {
        let ratings = [];

        for (let i = 0; i < 5; i++) {
            ratings.push(
                <FontAwesome 
                    name="star"
                    color={i < this.state.recipeData.rating ? '#FFDB20' : this.props.colors.text}
                    size={25}
                    key={"ratingStar" + i}
                />
            )
        }
        
        return ratings
    }

    createRatingStarButtons() {
        let ratings = [];
        for (let i = 0; i < 5; i++) {
            ratings.push(
                <TouchableOpacity 
                    key={"ratingStarButton" + i}
                    onPress={()=>this.setState({userRating: i + 1})}>
                    <FontAwesome 
                        name="star"
                        color={i < this.state.userRating ? '#FFDB20' : this.props.colors.text}
                        size={45}
                    />
                </TouchableOpacity>
            )
        }
        return ratings;
    }

    addToShoppingListButton(checklist, index) {
        return <TouchableOpacity key={'addButton' + index} onPress={() => {this.handleAddIngredient(index)}}>
            {
                checklist[index] == NOT_OWNED ?
                <FontAwesome 
                    name="shopping-cart"
                    color={"#000000"}
                    size={25}
                    key={"cartButton" + index}
                />
                :
                <FontAwesome 
                    name="check"
                    color={"#000000"}
                    size={25}
                    key={"cartButton" + index}
                />
            }
        </TouchableOpacity>
    };

    getTable() {
        var rows = [];
        this.state.ingredientsTable.forEach((rowData, i) => (
            rows.push(<Row key={'ingredient' + i} data={rowData} flexArr={[3, 1, 1]} style={{backgroundColor: this.state.checklist[i] == OWNED ? '#C4ECB2' : '#ffffff'}}/>)
        ))
        return rows;
    }

    async handleSaveRecipe(type) {
        const user_id = await this.props.getUserToken();
        await DataFetcher.saveRecipe(user_id, this.props.recipe_id, type);
    }

    async handleUnsaveRecipe(type) {
        const user_id = await this.props.getUserToken();
        await DataFetcher.unsaveRecipe(user_id, this.props.recipe_id, type);
    }

    async handleAddRating() { 
        const user_id = await this.props.getUserToken();
        await DataFetcher.addRating(user_id, this.props.recipe_id, this.state.userRating);
        this.setState({userPrevRating: this.state.userRating});
        await this.loadData();
        this.setState({modalVisible: false});
    }

    async handleEditRating(){
        const user_id = await this.props.getUserToken();
        await DataFetcher.editRating(user_id, this.props.recipe_id, this.state.userRating, this.state.userPrevRating);
        this.setState({userPrevRating: this.state.userRating});
        await this.loadData();
        this.setState({modalVisible: false});
    }

    handleAddIngredient(index) {
        let checklist = [...this.state.checklist];
        checklist[index] = checklist[index] == NOT_OWNED ? ADDED : NOT_OWNED;            
        let ingredientsTable = [...this.state.ingredientsTable];
        ingredientsTable[index][ingredientsTable[index].length - 1] = this.addToShoppingListButton(checklist, index);
        this.setState({ 
            checklist,
            ingredientsTable
        })
    }

    render() {
        return this.state.recipeData != null && this.state.authorData != null ?
        <>
            <View style={{flexDirection: "row"}}>
                <Image
                    style={styles.recipeImage} 
                    source={{uri: this.state.recipeImages.length > 0 ? 
                                this.state.recipeImages[0]
                                :
                                Image.resolveAssetSource(placeholder_post_image).uri}}/>   
                <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.recipeData.title}</Text>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Text>posted by </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewAccountScreen', {id: this.state.authorData._id})}>
                            <Text style={{color: '#00A2D6'}}>{this.state.authorData.username}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row", alignItems: 'center', marginTop: 5}}>
                        {this.createRatingStars()}
                        <Text>({this.state.recipeData.num_ratings})</Text>
                        <TouchableOpacity
                            style={{marginLeft: 10}}
                            onPress={() => this.setState((prevState) => ({userRating: prevState.userPrevRating, modalVisible: !prevState.modalVisible}))}>
                            <Text style={{color: '#00A2D6'}}>Rate</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{marginTop: 5}} onPress={() => {
                        this.setState((prevState) => {
                            if(!prevState.recipeSaved)
                                this.handleSaveRecipe('saved_recipes');
                            else
                                this.handleUnsaveRecipe('saved_recipes');
                            return {recipeSaved: !prevState.recipeSaved}
                        })
                    }}>
                        <View style={styles.saveButton}>
                            {
                                this.state.recipeSaved ? 
                                <MaterialCommunityIcons 
                                name="check-bold"
                                color={'#ffffff'}
                                size={25}
                                />
                                :
                                <MaterialCommunityIcons 
                                name="bookmark"
                                color={'#ffffff'}
                                size={25}
                                />
                            }
                            <Text style={styles.saveButtonText}>
                                {
                                    this.state.recipeSaved ? 
                                    "Saved"
                                    :
                                    "Save recipe"
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop: 5}} onPress={() => {
                        this.setState((prevState) => {
                            if(!prevState.recipeSaved)
                                this.handleSaveRecipe('liked_recipes');
                            else
                                this.handleUnsaveRecipe('liked_recipes');
                            return {recipeLiked: !prevState.recipeLiked}
                        })
                    }}>
                        <View style={styles.saveButton}>
                            {
                                this.state.recipeLiked ? 
                                <MaterialCommunityIcons 
                                name="check-bold"
                                color={'#ffffff'}
                                size={25}
                                />
                                :
                                <MaterialCommunityIcons 
                                name="bookmark"
                                color={'#ffffff'}
                                size={25}
                                />
                            }
                            <Text style={styles.saveButtonText}>
                                {
                                    this.state.recipeLiked ? 
                                    "Liked"
                                    :
                                    "Like recipe"
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text>
                {this.state.recipeData.description == null || this.state.recipeData.description == ''
                ? 'None'
                : this.state.recipeData.description}
                </Text>
            </View>
            <View>
                <Text style={styles.sectionTitle}>Tags</Text>
                <Text>
                {this.state.recipeData.tags == null || this.state.recipeData.tags == '' || this.state.recipeData.tags == []
                ? 'None'
                : this.state.recipeData.tags.map((step, i) => (
                    <Text>{step + ', '}</Text>
                ))
                }
                </Text>
            </View>
            <View>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <Table>
                    <Row data={['Name', 'Amount', '']} flexArr={[3, 1, 1]} style={{...styles.tableHeader, color: '#ACA9A9'}}/>
                    {
                        this.getTable()
                    }
                </Table>
            </View>
            <View>
                <Text style={styles.sectionTitle}>Instructions</Text>
                
                {
                    this.state.recipeData.instructions.map((step, i) => (
                        <View key={'step' + String(i)} style={{flexDirection: 'row'}}>
                            <Text style={styles.instructionText}>{i + 1}.</Text>
                            <Text style={[styles.instructionText, {marginLeft: 5}]}>{step}</Text>
                        </View>
                    ))
                }
            </View>
            <View>
                <Text style={styles.sectionTitle}>Comments</Text>
                <CommentSection recipe_id={this.props.recipe_id} user_id={this.state.user_id}/>
            </View>

            <Modal 
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState((prevState) => ({modalVisible: !prevState.modalVisible}));
                }}
            >  
                <View style={styles.modalOverlay}> 
                    <View style={styles.modalContainer}>
                        <View style={styles.starButtonContainer}>
                            {this.createRatingStarButtons()}
                        </View>
                        <TouchableOpacity 
                            style={{marginTop: 20}} 
                            disabled={this.state.userRating == 0} 
                            onPress={() => { 
                                this.state.userPrevRating == 0 ? this.handleAddRating() : this.handleEditRating()
                            }}
                        >
                            <Text style={{color: this.state.userRating > 0 ? '#00A2D6' : '#585858', fontSize: 22}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
        :
        <></>
    }
};

export default ViewRecipe;

const {height} = Dimensions.get("screen");
const height_img = height * 0.17;
const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#84D3FF'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    recipeImage: {
        width: height_img,
        height: height_img,
        borderRadius: 15,
        borderColor: '#BDBABA',
        borderWidth: 1
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: "#4A7DCA",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    saveButtonText: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: "#ffffff"
    },
    sectionTitle: {
        fontSize: 18, 
        marginTop: 10,
        marginBottom: 5, 
        fontWeight: 'bold'
    },
    tableHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ACA9A9',
        padding: 5
    },
    instructionText: {
        marginBottom: 5,
        fontSize: 15
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: 'rgba(128, 128, 128, 0.4)'
    },
    modalContainer: {
        width: '100%', 
        backgroundColor: '#a1c8e6', 
        marginTop: '-25%', 
        minHeight: 210,
        justifyContent: 'center',
        alignItems: 'center'
    },
    starButtonContainer: {
        flexDirection: "row", 
        alignItems: 'center', 
        width: '100%',
        paddingHorizontal: 25,
        justifyContent: 'space-evenly'
    }
  });