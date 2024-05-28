import {HOST_ADDRESS} from '@env';

export default class DataFetcher{
    static async login(email, password) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/login', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                var userInfo = {username: data.user.username, userToken: data.user._id, firstName: data.user.first_name, lastName: data.user.last_name };
                return userInfo;
            }
            else if(data && !data.success){
                Alert.alert('Invalid User!', 'Email or password is incorrect.', [
                    {text: 'Okay'}
                ]);
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not log in"};
            }
        })
        .catch(function(error) {
            console.log('Error in login');
            Promise.reject(error);
        })
    
        clearTimeout(id);
        return response;
    }

    static async register(firstname, lastname, email, username, password) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/register', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstname,
                lastName: lastname,
                username: username
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not register"};
            }
        })
        .catch(function(error) {
            console.log('Error in Register');
            throw(error);
        })
    
        clearTimeout(id);
        return response;
    }

    static async getRecipeData(recipe_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/getRecipe?_id=' + recipe_id, {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.recipe;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false};
            }
        })  

        clearTimeout(id);
        return response;
    }

    static async getUserData(user_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/getUser?_id=' + user_id, {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.user;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false};
            }
        })  

        clearTimeout(id);
        return response;
    }

    static async checkRecipeSaved(user_id, recipe_id, list_type) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/checkRecipeSavedLiked?user_id=' + user_id + '&recipe_id=' + recipe_id + '&list_type=' + list_type, {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.saved;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false};
            }
        })  

        clearTimeout(id);
        return response;
    }

    static getImage(imageId) {
        if(imageId == undefined){
            return;
        }
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.responseType = 'json';
            req.open("GET", 'http://' + HOST_ADDRESS + '/getImg?_id=' + imageId);
            req.onload = function() {
                if (req.response.success){
                    return resolve('data:image/png;base64,' + req.response.img);
                }
            }
            req.onprogress = function(event) {}; // need this line for some reason
            req.send();
        });
    }

    static getTimeString(hours, minutes) {
        var timeString = '';
        if(hours > 0){
            timeString += hours + ' hr';
            if(minutes > 0){
                timeString += ' ';
            }
        }
        if(minutes > 0) {
            timeString += minutes + ' min';
        }
        
        if(timeString.length == 0)
            timeString = 'None';
        return timeString;
    }

    static async getLikedRecipes(user_id){
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/getSavedLikedRecipes?user_id=' + user_id + '&list_type=saved_recipes', {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data){
            return data.data;
            }
            else{
            return {success: false}
            }
        })
        .catch(function(error) {
            console.log('Error getting saved recipes');
            Promise.reject(error);
        })
        clearTimeout(id);
        return response;
    }

    // get recipes of all followed accounts
    static async getFollowingRecipes(user_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/getFollowingRecipes?user_id=' + user_id, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data){
            return data;
            }
            else{
            return {success: false}
            }
        })
        .catch(function(error) {
            console.log('Error getting feed recipes');
            Promise.reject(error);
        })
        clearTimeout(id);

        return response;
    }

    static async getAllRecipes() {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/getAllRecipes', {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data){
            return data;
            }
            else{
            return {success: false}
            }
        })
        .catch(function(error) {
            console.log('Error getting all recipes');
            Promise.reject(error);
        })
        clearTimeout(id);
    
        return response;
    }

    static async checkFollowingUser(user_id, following_id){
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/checkFollowing?user_id=' + String(user_id) + '&following_id=' + String(following_id), {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.following;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false};
            }
        })  
    
        clearTimeout(id);
        return response;
    }

    static async editUser(user_id, pfp, username, firstName, lastName, bio) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var newUser = await fetch('http://' + HOST_ADDRESS + '/editUser', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: user_id,
                user: {
                  profile_pic: pfp,
                  username,
                  first_name: firstName,
                  last_name: lastName,
                  bio,
                }
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.user;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not edit profile"};
            }
        })
        .catch(function(error) {
            console.log('Error in edit profile');
            throw(error);
        })
    
        clearTimeout(id);

        return newUser;
    }

    static async followUser(user_id, following_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/follow', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                following_id,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data;
            }
            else if(data && !data.success){
                console.log(data.msg);
            }
            else{
                console.log('Could not follow user');
            }
        })  

        clearTimeout(id);
    }

    static async unfollowUser(user_id, following_id){
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/unfollow', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                following_id,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data;
            }
            else if(data && !data.success){
                console.log(data.msg);
            }
            else{
                console.log('Could not unfollow user');
            }
        })  

        clearTimeout(id);
    }

    static async addRecipe(user_id, recipeTitle, recipeImg, instructions, ingredients, prepTime, cookTime, description, tags) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/addRecipe', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                title: recipeTitle,
                pictures: [recipeImg],
                instructions: instructions,
                ingredients: ingredients,
                prep_time: prepTime,
                cook_time: cookTime,
                yield: 1,
                tags: tags,
                description: description,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not post recipe"};
            }
        })
        .catch(function(error) {
            console.log('Error in add recipe');
            throw(error);
        })
    
        clearTimeout(id);
    
        return response;
    }

    static async saveRecipe(user_id, recipe_id, list_type) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/saveLikeRecipe', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                recipe_id: recipe_id,
                list_type: list_type
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success)
                return data;
            else if(data && !data.success){
                console.log(data.msg);
            }
            else{
                console.log('Could not save recipe');
            }
        })  

        clearTimeout(id);
        return response;
    }

    static async unsaveRecipe(user_id, recipe_id, list_type) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);  
        var response = await fetch('http://' + HOST_ADDRESS + '/unsaveUnlikeRecipe', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                recipe_id: recipe_id,
                list_type: list_type
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success)
                return data;
            else if(data && !data.success){
                console.log(data.msg);
            }
            else{
                console.log('Could not unsave recipe');
            }
        })  

        clearTimeout(id);
        return response;
    }

    static async getIngredients(user_id, listType){
        const controller = new AbortController();
        const timeout = 5000;
        const id = setTimeout(async () => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/getUserItems?_id=' + user_id + '&list_type=' + listType, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.data
            }
            else if(data && !data.success){
                console.log(data.msg);
            }
            else{
                console.log("Could not add item");
            }
        })
    
        clearTimeout(id);
        
        return response;
      }

      static async addIngredient(user_id, category, name, quantity, unit) {    
        const controller = new AbortController();
        const timeout = 5000;
        const id = setTimeout(async () => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/addUserItem', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: user_id,
              list_type: listType,
              category,
              name,
              quantity,
              unit
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not add item"};
            }
        })
    
        clearTimeout(id);
        return response;
    }

    static async editIngredient(user_id, category, name, quantity, unit){
        const controller = new AbortController();
        const timeout = 5000;
        const id = setTimeout(async () => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/editUserItem', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            user_id: user_id,
            list_type: listType,
            old_category: editedIngredient.category,
            old_name: editedIngredient.name,
            category,
            name,
            quantity,
            unit
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not edit item"};
            }
        })

        clearTimeout(id);

        return response;
    }

    static async removeIngredient(user_id, category, item_name, list_type) {        
        const controller = new AbortController();
        const timeout = 5000;
        const id = setTimeout(async () => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/deleteUserItem', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: user_id,
              list_type: list_type,
              category: category,
              name: item_name,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not remove item"};
            }
        })
    
        clearTimeout(id);

        return response;
    }

    static async getIngredient(searchInput) {
        const controller = new AbortController();
        const timeout = 5000;
        const id = setTimeout(async () => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/getIngredient?name=' + searchInput, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.ingredients;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not post recipe"};
            }
        })
    
        clearTimeout(id);
        return response;
    }

    static async getRating(user_id, recipe_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/getRating?user_id=' + user_id + '&recipe_id=' + recipe_id, {
            method: 'GET',
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return data.rating;
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not get rating"};
            }
        })
        .catch(function(error) {
            console.log('Error in get rating');
            throw(error);
        })
    
        clearTimeout(id);
    
        return response;
    }

    static async addRating(user_id, recipe_id, rating) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/addRating', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                recipe_id,
                rating
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not add rating"};
            }
        })
        .catch(function(error) {
            console.log('Error in add rating');
            throw(error);
        })
    
        clearTimeout(id);
    
        return response;
    }

    static async editRating(user_id, recipe_id, rating, prevRating) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/editRating', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                recipe_id,
                rating,
                prev_rating: prevRating
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not edit rating"};
            }
        })
        .catch(function(error) {
            console.log('Error in edit rating');
            throw(error);
        })
    
        clearTimeout(id);
    
        return response;
    }

    static async search(searchInput) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);    
        var response = await fetch('http://' + HOST_ADDRESS + '/search?query=' + searchInput + '&type=title description username', {
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            return data;
        })  

        clearTimeout(id);
        return response;
    }

    static async getComments(recipe_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/getRecipeComments?_id=' + recipe_id + '&type=recipe', {
            options: {timeout},
            signal: controller.signal  
          })
          .then(response=>response.json())
          .then(data =>{
              if(data.success == true && data.data){
                  return data.data;
              } else {
                  return [];
              }
          })
  
          clearTimeout(id);
          return response;
    }

    static async postComment(user_id, comment_text, isReply, comment_head_id) {
        const controller = new AbortController();
        const timeout = 15000;
        const id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch('http://' + HOST_ADDRESS + '/addComment', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: user_id,
              comment_text: comment_text,
              isReply: isReply,
              commentHead_id: comment_head_id,
            }),
            options: {timeout},
            signal: controller.signal  
        })
        .then(response=>response.json())
        .then(data =>{
            if(data && data.success){
                return {success: true}
            }
            else if(data && !data.success){
                return {success: false, message: data.msg};
            }
            else{
                return {success: false, message: "Could not remove item"};
            }
        })
    
        clearTimeout(id);

        return response;
    }
}
