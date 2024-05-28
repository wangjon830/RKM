import * as React from 'react';
import { StyleSheet, 
        Text, 
        TextInput,
        View,
        TouchableOpacity,
        FlatList,
        Pressable
      } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import ConfirmAndCancelButtons from './ConfirmAndCancelButtons';

import DataFetcher from '../dataFetcher';

export default class NewIngredientModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showSearch: true,
      categoryDropdownOpen: false,
      category: undefined,
      searchInput: '',
      searchResults: [],
      ingredientName: undefined,
      ingredientQuantity: '',
      ingredientUnit: undefined,
      unitDropdownOpen: false
    };
    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleCancelIngredient = this.handleCancelIngredient.bind(this);
    this.openExistingIngredient = this.openExistingIngredient.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setUnit = this.setUnit.bind(this);
  }
  
  categories = [
    {label: "Protein", value: "Protein"}, 
    {label: "Vegetables", value: "Vegetables"}, 
    {label: "Grains", value: "Grains"}, 
    {label: "Fruits", value: "Fruits"}, 
    {label: "Dairy", value: "Dairy"}, 
    {label: "Other", value: "Other"}
  ]

  units = [
    {label: 'lbs', value: 'lbs'},
    {label: 'kg', value: 'kg'},
    {label: 'tsp', value: 'tsp'},
    {label: 'tbsp', value: 'tbsp'},
    {label: 'oz', value: 'oz'},
    {label: 'cup', value: 'cup'},
    {label: 'count', value: 'count'}
  ];

  async handleSearchInputChange(val) {
    this.setState({searchInput: val}, async () => {
      if(this.state.searchInput.length > 0){
        var response = await DataFetcher.getIngredient(this.state.searchInput);  
        this.setState({searchResults: response});
      }
      else{
        this.setState({searchResults: []});      
      }
    })
  }

  handleIngredientSelect (name){
    this.setState({
      showSearch: this.props.showCategory ? this.state.category == undefined : false,
      searchInput: name.charAt(0).toUpperCase() + name.slice(1),
      searchResults: [],
      ingredientName: name.charAt(0).toUpperCase() + name.slice(1),
    });
  }

  resetInput() { 
    this.setState({
      ingredientName: undefined,
      ingredientQuantity: '',
      ingredientUnit: undefined
    });
  }

  handleAddIngredient() {    
    if(this.props.showCategory)
      this.props.handleAdd(this.state.category.toLowerCase(), this.state.ingredientName.toLowerCase(), this.state.ingredientQuantity, this.state.ingredientUnit);
    else
      this.props.handleAdd(this.state.ingredientName.toLowerCase(), this.state.ingredientQuantity.toLowerCase(), this.state.ingredientUnit);
    this.resetInput();   
  }

  handleCancelIngredient() {
    this.resetInput();
    this.props.handleCancel();
  }

  setCategory(callback) {
    this.setState(state => ({
      category: callback(state.value),
      showSearch: this.state.ingredientName == undefined,
    }));
  }

  setUnit(callback) {
    this.setState(state => ({
      ingredientUnit: callback(state.value)
    }));
  }

  openExistingIngredient(category, name, quantity, unit){
    this.setState({
      category,
      ingredientName: name,
      ingredientQuantity: quantity,
      ingredientUnit: unit,
      showSearch: false
    })
  }

  componentDidMount(){
    if(this.props.ingredient != null){
      this.setState({
        category: this.props.ingredient.category,
        ingredientName: this.props.ingredient.name,
        ingredientQuantity: this.props.ingredient.quantity,
        ingredientUnit: this.props.ingredient.unit,
        showSearch: false
      })
    }
  }

  render() {
    return (
      <View style={styles.modalContainer}>
          <View>
              {
                this.state.showSearch ? 
                <View>
                  {this.props.showCategory && 
                    <View>
                      <Text>Select category</Text>
                      <DropDownPicker
                        placeholder="-"
                        listMode="FLATLIST"
                        open={this.state.categoryDropdownOpen}
                        value={this.state.category}
                        items={this.categories}
                        setOpen={() => {this.setState((prevState) => ({categoryDropdownOpen: !prevState.categoryDropdownOpen}))}}
                        setValue={this.setCategory}
                        flatListProps={{
                            height: 120,
                            initialNumToRender: 3
                        }}
                        style={{
                          height: 40
                        }}
                      />
                    </View>
                  }
                  
                  <Text>Search ingredient</Text>
                  <TextInput 
                      value={this.state.searchInput}
                      placeholder="Ingredient name"
                      placeholderTextColor="#666666"
                      style={styles.textInput}
                      onChangeText={(val) => this.handleSearchInputChange(val)}
                  />     
                  {
                    this.state.searchResults && this.state.searchResults.length > 0 &&
                    <FlatList data={this.state.searchResults} keyExtractor = {(item, index)=>'result' + index}
                      extraData = {this.state.searchResults} 
                      renderItem = {({item}) =>
                        <TouchableOpacity style={styles.resultItem} onPress={() => this.handleIngredientSelect(item.food_name)}>
                          <Text>{item.food_name}</Text>
                        </TouchableOpacity>
                      } 
                    />
                  }
                </View>
                :
                <View>
                  <View style={styles.containerRow}>
                    <View style={{flex: 1, marginHorizontal: 30, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{fontSize: 18}}>{this.state.ingredientName.charAt(0).toUpperCase() + this.state.ingredientName.slice(1)}</Text> 
                        <Pressable style={{marginLeft: 10}} onPress={()=>{
                          this.setState({
                            showSearch: true,
                            category: undefined,
                            ingredientName: undefined,
                            searchInput: '',
                            searchResults: []
                          })
                        }}>
                          <Text style={{fontSize: 18, color: '#75aaff'}}>Change</Text>
                        </Pressable>
                    </View>
                  </View>

                  <View style={[styles.containerRow, {alignItems: 'flex-start'}]}>
                      <View style={{width: '15%', marginHorizontal: 5}}>
                          <TextInput 
                              value={this.state.ingredientQuantity}
                              placeholder="Amt"
                              placeholderTextColor="#666666"
                              keyboardType="numeric"
                              style={[styles.textInput]}
                              onChangeText={(val) => {this.setState({ingredientQuantity: val})}}
                          />  
                      </View>     
                      <View style={styles.dropdownContainer}>
                          <DropDownPicker
                              placeholder="-"
                              listMode="FLATLIST"
                              open={this.state.unitDropdownOpen}
                              value={this.state.ingredientUnit}
                              items={this.units}
                              setOpen={() => {this.setState((prevState) => ({unitDropdownOpen: !prevState.unitDropdownOpen}))}}
                              setValue={this.setUnit}
                              flatListProps={{
                                  height: 120,
                                  initialNumToRender: 3
                              }}
                              style={{
                                height: 40
                              }}
                            />
                      </View>
                  </View>    
                </View>
              }
              <ConfirmAndCancelButtons 
                  style={{zIndex: this.state.unitDropdownOpen || this.state.categoryDropdownOpen ? 1 : 101}}
                  handleConfirm={this.handleAddIngredient} 
                  handleCancel={this.handleCancelIngredient} 
                  disabled={this.state.ingredientName == undefined || this.state.ingredientQuantity <= 0 || this.state.ingredientUnit == undefined}/>   
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%', 
    backgroundColor: '#a1c8e6', 
    marginTop: '-25%', 
    paddingTop: 30,
    minHeight: 210,
    justifyContent: 'space-between'
  },
  textInput: {
      // flex: 1,
      paddingLeft: 10,
      color: '#05375a',
      borderWidth: 1,
      borderColor: '#f2f2f2',
      backgroundColor: '#ffffff',
      borderRadius: 10
  },
  resultItem: {
    paddingLeft: 10,
    paddingVertical: 3,
    backgroundColor: '#ffffff'
  },
  containerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  dropdownContainer: {
      width: '25%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginRight: '5%',
      overflow:'visible', 
      height: 160,
      zIndex: 100,
  }
});