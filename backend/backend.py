from flask import Flask, request, jsonify
import pymongo
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import hashlib
from bson import ObjectId
from bson.json_util import dumps
import bcrypt
import json
import requests
import textdistance as td
import certifi
import gridfs
import base64
import collections
import bson
from datetime import datetime
import bisect

app = Flask(__name__)
load_dotenv()

# SSL Certificate Error Temp Fix
#ca=certifi.where()

MONGO_LINK = os.getenv('MONGO_LINK')
client = pymongo.MongoClient(MONGO_LINK)
#client = pymongo.MongoClient(MONGO_LINK, tlsCAFile=ca)

# Pass in base64 img string, adds it to gridfs, returns file_id of fs.chunks of the pic
def postPicture(imgStr):
    db = client['rkm']
    fs = gridfs.GridFS(db)
    imgArr = imgStr.split(',')
    with open("tempImage.png", 'wb') as fh:
        fh.write(base64.b64decode(imgArr[1]))

    file = "tempImage.png"

    with open(file, 'rb') as f:
        contents = f.read()
    
    imgID = fs.put(contents, filename="file")
    # connect the imgID to the 
    return imgID

# pass in _id of image(file_id), returns image in base64

@app.route('/getImg', methods=['GET'])
def getImg():
    db = client['rkm']
    fs = gridfs.GridFS(db)
    _id = request.args.get('_id')
    file = fs.find_one({'_id': ObjectId(_id)})
    image = file.read()
    encoded_image = base64.b64encode(image).decode('ascii')

    return json.dumps({"success": True, "img" : encoded_image})
    # return json.dumps({"success": True, "img" : encoded_image[int(len(encoded_image) / 4):]})

def getUser(user):
    return {
        '_id': str(user['_id']),
        'username': user['username'], #string
        'profile_pic': None if 'profile_pic' not in user else user['profile_pic'], #None ??
        'email': user['email'], #string
        'followers': followLen(user['followers']), #int
        'following': followLen(user['following']), #int
        'bio': user['bio'], #None ???
        'recipes': user['my_recipes'],
        'liked_recipes':user['liked_recipes'],
        'first_name': user['first_name'],
        'last_name': user['last_name']
    }

def followLen(followList):
    db = client['rkm']
    users = db['users']
    count = 0
    for userid in followList:
        user = users.find_one({'_id': ObjectId(userid)})
        if user['deleted'] == 0:
            count+=1
    return count

# Adds new user to database
@app.route('/register', methods=['POST'])
def register():
    db = client['rkm']
    users = db['users']
    register_info = request.get_json()

    account_exists = users.find_one({'$and': [{'email': register_info['email']}, {'deleted':0}]})
    if account_exists:
        return json.dumps({"success": False, "msg": "An account exists for this email"}, default=str)

    account_exists = users.find_one({'$and': [{'username': register_info['username']}, {'deleted':0}]})
    if account_exists:
        return json.dumps({"success": False, "msg": "An account exists for this username"}, default=str)

    added_user = {}
    added_user['email'] = register_info['email']
    added_user['username'] = register_info['username']
    added_user['first_name'] = register_info['firstName']
    added_user['last_name'] = register_info['lastName']
    added_user['hashed_password'] = bcrypt.hashpw(register_info['password'].encode('utf-8'), bcrypt.gensalt())
    added_user['profile_pic'] = None
    added_user['following'] = []
    added_user['followers'] = []
    added_user['bio'] = None
    added_user['my_recipes'] = []
    added_user['saved_recipes'] = []
    added_user['liked_recipes'] = []
    added_user['pantry'] = {
        'protein': {},
        'vegetables': {},
        'grains': {},
        'fruit': {},
        'dairy': {},
        'other': {}
    }
    added_user['shopping_list'] = {
        'protein': {},
        'vegetables': {},
        'grains': {},
        'fruit': {},
        'dairy': {},
        'other': {}
    }
    added_user['deleted'] = 0
    added_user['ratings'] = {}

    user_id = users.insert_one(added_user).inserted_id
    _id = users.find_one({'_id': ObjectId(user_id)})
    return json.dumps({
        "success": True,
        "msg": "Account successfully created",
        'user': getUser(_id)
    }, default=str)

# Delete user from database
@app.route('/deleteUser', methods=['POST'])
def deleteUser():
    db = client['rkm']
    users = db['users']
    userData = request.get_json()
    user = users.find_one({'_id': ObjectId(userData['_id'])})
    if user:
        user['deleted'] = 1
        users.update_one({'_id': user['_id']},
        {
            '$set': user,
        })
        return json.dumps({
            'success': True,
            'msg': 'Account deleted'
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Account not found'}, default=str)

# Edit User details
@app.route('/editUser', methods=['POST'])
def editUser():
    db = client['rkm']
    users = db['users']
    data = request.get_json() #Pass 2 items: _id and user(dictionary of updated user info)
    user_id = ObjectId(data['_id'])
    updated_user = data['user']

    # convert empty strings to None
    for key in updated_user:
        if updated_user[key] == "":
            updated_user[key] = None

    #make imgs their object ID
    if 'profile_pic' in updated_user and updated_user['profile_pic']:
        updated_user['profile_pic'] = str(postPicture(updated_user['profile_pic']))

    # check if email was changed
    user = users.find_one({'_id': user_id})
    if 'email' in updated_user and user['email'] != updated_user['email']:
        # check if new email is already registered
        user = users.find_one({'$and': [{'email': updated_user['email']}, {'deleted':0}]})
        if user:
            return json.dumps({"success": False, 'msg': 'An account exists for this email'}, default=str)

    for key in updated_user:
        users.update_one(
            {'_id': user_id},
            {
                '$set': {
                    key: updated_user[key]
                },
            }
        )

    user = users.find_one({'_id': user_id})

    return json.dumps({"success": True, 'msg': "Account updated", 'user': getUser(user)}, default=str)

# Get user info
@app.route('/getUser', methods=['GET'])
def getAccount():
    db = client['rkm']
    users = db['users']
    _id = request.args.get('_id')
    user = users.find_one({'$and': [{'_id': ObjectId(_id)}, {'deleted': 0}]})
    if user:
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'user': getUser(user)
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Account not found'}, default=str)


# Checks login credentials
@app.route('/login', methods=['POST'])
def login():
    db = client['rkm']
    users = db['users']
    attempt = request.get_json()
    user = users.find_one({'$and': [{'email': attempt['email']}, {'deleted':0}]})
    if user and 'hashed_password' in user:
        # compare passwords
        if bcrypt.checkpw(attempt['password'].encode('utf-8'), user["hashed_password"]):
            return json.dumps({"success": True,
                               "msg": "Login successful",
                               'user': getUser(user)
                               }, default=str)
        else:
            return json.dumps({"success": False, "msg": "Incorrect password"}, default=str)
    # email does not exist
    return json.dumps({"success": False, "msg": "No account exists for this email"}, default=str)

#Get user saved recipes
@app.route('/checkFollowing', methods=['GET'])
def checkFollowing():
    db = client['rkm']
    users = db['users']
    user_id = request.args.get('user_id') # ?user_id = 
    following_id = request.args.get('following_id') # ?recipe_id=
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        return json.dumps({
            'success': True,
            'following': following_id in user['following']
        }, default=str)
    return json.dumps({'success': False, 'msg': 'User not found'}, default=str)

@app.route('/follow', methods=['POST'])
def follow():
    db = client['rkm']
    users = db['users']
    request_data = request.get_json() # user_id and following_id
    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    user['following'].append(str(request_data['following_id']))
    users.update_one({'_id': user['_id']},
    {
        '$set': user,
    })
    followedUser = users.find_one({'_id': ObjectId(request_data['following_id'])})
    followedUser['followers'].append(str(request_data['user_id']))
    users.update_one({'_id': followedUser['_id']},
    {
        '$set': followedUser,
    })
    return json.dumps({
        "success": True,
        "msg": "Successfully followed",
    }, default=str)

@app.route('/unfollow', methods=['POST'])
def unfollow():
    db = client['rkm']
    users = db['users']
    request_data = request.get_json() # user_id and following_id
    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    user['following'].remove(str(request_data['following_id']))
    users.update_one({'_id': user['_id']},
    {
        '$set': user,
    })
    followedUser = users.find_one({'_id': ObjectId(request_data['following_id'])})
    followedUser['followers'].remove(str(request_data['user_id']))
    users.update_one({'_id': followedUser['_id']},
    {
        '$set': followedUser,
    })
    return json.dumps({
        "success": True,
        "msg": "Successfully unfollowed",
    }, default=str)

@app.route('/getFollowers', methods=['GET'])
def getFollowers():
    db = client['rkm']
    users = db['users']
    _id = request.args.get('_id')
    user = users.find_one({'_id': ObjectId(_id)})
    if user:
        followerList = []
        for follower in user['followers']:
            user = users.find_one({'$and': [{'_id': ObjectId(follower)}, {'deleted': 0}]})
            if user: followerList.append(user['_id'])
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'users': followerList
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Account not found'}, default=str)

@app.route('/getFollowing', methods=['GET'])
def getFollowing():
    db = client['rkm']
    users = db['users']
    _id = request.args.get('_id')
    user = users.find_one({'_id': ObjectId(_id)})
    if user:
        followingList = []
        for following in user['following']:
            user = users.find_one({'$and': [{'_id': ObjectId(following)}, {'deleted': 0}]})
            if user: followingList.append(user['_id'])
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'users': followingList
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Account not found'}, default=str)

def recipeInfo(recipe):
    return {
        '_id': str(recipe['_id']), #auto generated 
        'user_id': recipe['user_id'], #_id of user that created
        'title': recipe['title'], #string
        'pictures': recipe['pictures'], #array
        'instructions': recipe['instructions'], #string array
        'description': recipe['description'], #string
        'prep_time': recipe['prep_time'], #array
        'yield': recipe['yield'], #int
        'cook_time': recipe['cook_time'], #array
        'tags': recipe['tags'], #array
        'ingredients': recipe['ingredients'], #stores tuples (name, quant, unit)
        'rating': 0 if recipe['num_ratings'] == 0 else recipe['rating_total'] / recipe['num_ratings'], #float rating avg
        'num_ratings': recipe['num_ratings'],
        'datetime': recipe['datetime'], #date type
        'comments': recipe['comments'], #array of comment ids
        'views': recipe['views'], #int
        'likes': recipe['likes'], #int
    }


# Adds new recipe to database
@app.route('/addRecipe', methods=['POST'])
def addRecipe():
    db = client['rkm']
    recipes = db['recipes']
    users = db['users']
    added_recipe = request.get_json()
    added_recipe['rating_total'] = 0
    added_recipe['num_ratings'] = 0
    added_recipe['datetime'] = datetime.now()
    added_recipe['comments'] = []
    added_recipe['views'] = 0
    added_recipe['likes'] = 0
    added_recipe['deleted'] = 0

    #make imgs their object ID
    tempPicArr = []
    for pic in added_recipe['pictures']:
        tempPicArr.append(str(postPicture(pic)))
    added_recipe['pictures'] = tempPicArr

    insert = recipes.insert_one(added_recipe)
    recipe_id = insert.inserted_id

    user = users.find_one({'_id': ObjectId(added_recipe['user_id'])})
    user['my_recipes'].append(str(recipe_id))
    users.update_one({'_id': user['_id']},
    {
        '$set': user,
    })
    return json.dumps({
        "success": True,
        "msg": "Recipe successfully created",
        'recipeId': str(recipe_id),
    }, default=str)


# Delete recipe from database
@app.route('/deleteRecipe', methods=['POST'])
def deleteRecipe():
    db = client['rkm']
    recipes = db['recipes']
    #users = db['users']
    recipeData = request.get_json() # pass _id (recipeId) and user_id
    recipe = recipes.find_one({'_id': ObjectId(recipeData['_id'])})
    if recipe:
        recipe['deleted'] = 1
        recipes.update_one({'_id': recipe['_id']},
        {
            '$set': recipe,
        })

        '''
        user = users.find_one({'_id': ObjectId(recipe['user_id'])})
        user['my_recipes'].remove(str(recipeData['_id']))
        users.update_one({'_id': user['_id']},
        {
            '$set': user,
        })
        '''

        return json.dumps({
            'success': True,
            'msg': 'Recipe deleted'
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Recipe not found'}, default=str)

# Edit Recipe details
@app.route('/editRecipe', methods=['POST'])
def editRecipe():
    db = client['rkm']
    recipes = db['recipes']
    data = request.get_json() #Pass 2 items: _id and recipe(dictionary of updated recipe info)
    recipe_id = data['_id']
    updated_recipe = data['recipe']
    updated_recipe['_id'] = ObjectId(recipe_id)

    # convert empty strings to None
    for key in updated_recipe:
        if updated_recipe[key] == "":
            updated_recipe[key] = None

    recipes.update_one({'_id': updated_recipe['_id']},
        {
            '$set': updated_recipe,
        }
    )

    recipe = recipes.find_one({'_id': updated_recipe['_id']})

    return json.dumps({"success": True, 'msg': "Recipe updated", 'recipe': recipeInfo(recipe)}, default=str)

# Save recipe on account
@app.route('/saveLikeRecipe', methods=['POST'])
def saveLikeRecipe():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    request_data = request.get_json() # pass list_type, user_id, recipe_id

    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    if(str(request_data['recipe_id']) not in user[request_data['list_type']]):
        user[request_data['list_type']].append(str(request_data['recipe_id']))

    users.update_one({'_id': user['_id']},
    {
        '$set': user,
    })
    if request_data['list_type'] == 'liked_recipes':
        recipe = recipes.find_one({'_id': ObjectId(request_data['recipe_id'])})
        recipe['likes'] += 1
        recipes.update_one({'_id': recipe['_id']},
        {
            '$set': recipe,
        })    

    return json.dumps({
        "success": True,
        "msg": "Recipe saved/liked",
    }, default=str)

# Unsave recipe on account
@app.route('/unsaveUnlikeRecipe', methods=['POST'])
def unsaveUnlikeRecipe():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    request_data = request.get_json() # pass list_type, user_id, recipe_id

    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    if str(request_data['recipe_id']) in user[request_data['list_type']]:
        user[request_data['list_type']].remove(str(request_data['recipe_id']))
        users.update_one({'_id': user['_id']},
        {
            '$set': user,
        })

        if request_data['list_type'] == 'liked_recipes':
            recipe = recipes.find_one({'_id': ObjectId(request_data['recipe_id'])})
            recipe['likes'] -= 1
            recipes.update_one({'_id': recipe['_id']},
            {
                '$set': recipe,
            })   

        return json.dumps({
            "success": True,
            "msg": "Recipe unsaved/unliked",
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Recipe not saved/liked'}, default=str)

#Get user saved recipes
@app.route('/getSavedLikedRecipes', methods=['GET'])
def getSavedLikedRecipes():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    user_id = request.args.get('user_id') # ?user_id = 
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        savedLikedList = {}
        list_types = ['saved_recipes', 'liked_recipes']
        for list_type in list_types:
            savedLikedList[list_type] = []
            for recipeId in user[list_type]:
                recipe = recipes.find_one({'$and': [{'_id': ObjectId(recipeId)}, {'deleted': 0}]})
                if recipe: savedLikedList[list_type].append(recipe['_id'])
        return json.dumps({
            'success': True,
            'msg': list_type.capitalize() + ' found',
            'data': savedLikedList
        }, default=str)
    return json.dumps({'success': False, 'msg': 'User not found'}, default=str)

#Get user saved recipes
@app.route('/checkRecipeSavedLiked', methods=['GET'])
def checkRecipeSaved():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    user_id = request.args.get('user_id') # ?user_id = 
    recipe_id = request.args.get('recipe_id') # ?recipe_id=
    list_type = request.args.get('list_type')
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        savedLikedList = []
        for recipeId in user[list_type]:
            recipe = recipes.find_one({'$and': [{'_id': ObjectId(recipeId)}, {'deleted': 0}]})
            if recipe: savedLikedList.append(str(recipe['_id']))
        return json.dumps({
            'success': True,
            'saved': recipe_id in savedLikedList
        }, default=str)
    return json.dumps({'success': False, 'msg': 'User not found'}, default=str)

#Get recipe from database
@app.route('/getRecipe', methods=['GET'])
def getRecipe():
    db = client['rkm']
    recipes = db['recipes']
    _id = request.args.get('_id')
    recipe = recipes.find_one({'$and': [{'_id': ObjectId(_id)}, {'deleted': 0}]})
    if recipe:
        recipe['views'] += 1
        updated_recipe = recipeInfo(recipe)
        recipes.update_one({'_id': updated_recipe['_id']},
            {
                '$set': updated_recipe,
            }
        )
        return json.dumps({
            'success': True,
            'msg': 'Recipe found',
            'recipe': updated_recipe
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Recipe not found'}, default=str)

# Get ingredients from API call
@app.route('/getIngredient', methods=['GET'])
def getIngredient():
    API_ID = os.getenv('API_ID')
    API_KEY = os.getenv('API_KEY')
    headers = {
        'x-app-id': API_ID,
        'x-app-key': API_KEY
    }
    ingredient = request.args.get('name')
    url = 'https://trackapi.nutritionix.com/v2/search/instant?query=' + ingredient
    ingredientData = requests.get(url, headers=headers).json()
    if len(ingredientData['common']) != 0:
        return json.dumps({
            'success': True,
            'msg': 'Ingredient found',
            'ingredients': ingredientData['common'][:min(len(ingredientData['common']), 5)]
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Ingredient not found'}, default=str)

# Adds pantry items to database
@app.route('/addUserItem', methods=['POST'])
def addUserItem():
    db = client['rkm']
    users = db['users']
    request_data = request.get_json() # pass user_id, list_type, category, name, quantity, unit

    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    user[request_data['list_type']][request_data['category']][request_data['name']] = {'quantity': request_data['quantity'], 'unit': request_data['unit']}

    users.update_one({'_id': user['_id']},
    {
        '$set': user,
    })

    return json.dumps({
        "success": True,
        "msg": request_data['list_type'].capitalize() + " item successfully added",
    }, default=str)

# Delete pantry items from database
@app.route('/deleteUserItem', methods=['POST'])
def deleteUserItem():
    db = client['rkm']
    users = db['users']
    request_data = request.get_json() #pass user_id, list_type, category, name

    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    if request_data['name'] in user[request_data['list_type']][request_data['category']]:
        del user[request_data['list_type']][request_data['category']][request_data['name']]

        users.update_one({'_id': user['_id']},
        {
            '$set': user,
        })

        return json.dumps({
            'success': True,
            'msg': request_data['list_type'].capitalize() + ' item deleted'
        }, default=str)
    return json.dumps({'success': False, 'msg': request_data['list_type'].capitalize() + ' item not found'}, default=str)

# Edit pantry items details
@app.route('/editUserItem', methods=['POST'])
def editUserItem():
    db = client['rkm']
    users = db['users']
    request_data = request.get_json() #Pass: user_id, list_type, old_category, old_name, category, name, quantity, unit

    # convert empty strings to None
    for key in request_data:
        if request_data[key] == "":
            request_data[key] = None

    user = users.find_one({'_id': ObjectId(request_data['user_id'])})
    if request_data['old_name'] in user[request_data['list_type']][request_data['old_category']]:
        del user[request_data['list_type']][request_data['old_category']][request_data['old_name']]
        user[request_data['list_type']][request_data['category']][request_data['name']] = {'quantity': request_data['quantity'], 'unit': request_data['unit']}
        
        users.update_one({'_id': user['_id']},
        {
            '$set': user,
        })
        return json.dumps({
	    	'success': True,
	    	'msg': request_data['list_type'] + " item updated",
	    }, default=str)
    return json.dumps({'success': False, 'msg': request_data['list_type'] + ' item not found'}, default=str)

#Get pantry items from database
@app.route('/getUserItems', methods=['GET'])
def getUserItems():
    db = client['rkm']
    users = db['users']
    _id = request.args.get('_id') # ?_id = 
    list_type = request.args.get('list_type') # append after id &list_type = 
    user = users.find_one({'_id': ObjectId(_id)})
    if user:
        return json.dumps({
            'success': True,
            'msg': list_type.capitalize() + ' items found',
            'data': user[list_type]
        }, default=str)
    return json.dumps({'success': False, 'msg': 'User not found'}, default=str)

def commentInfo(comment):
    return {
        '_id': str(comment['_id']), #auto generated 
        'user_id': comment['user_id'], #_id of user that created
        'comment_text': comment['comment_text'], #string
        'replies': comment['replies'], #_id of comments
        'datetime': comment['datetime'] #date type
    }

# Adds new comment to database
@app.route('/addComment', methods=['POST'])
def addComment():
    db = client['rkm']
    comments = db['comments']
    recipes = db['recipes']
    comment_info = request.get_json() #pass user_id, comment_text, isReply, commentHead_id (comment_id if isReply == true and recipe_id if isReply == false)
    added_comment = {}
    added_comment['user_id'] = comment_info['user_id']
    added_comment['comment_text'] = comment_info['comment_text']
    added_comment['datetime'] = datetime.now()
    added_comment['replies'] = []
    added_comment['commentHead_id'] = comment_info['commentHead_id']
    insert = comments.insert_one(added_comment)
    comment_id = insert.inserted_id

    if comment_info['isReply'] == False:
        recipe = recipes.find_one({'_id': ObjectId(comment_info['commentHead_id'])})
        recipe['comments'].append(str(comment_id))
        recipes.update_one({'_id': recipe['_id']},
        {
            '$set': recipe,
        })
    elif comment_info['isReply'] == True:
        commentHead = comments.find_one({'_id': ObjectId(comment_info['commentHead_id'])})
        commentHead['replies'].append(str(comment_id))
        comments.update_one({'_id': commentHead['_id']},
        {
            '$set': commentHead,
        })

    return json.dumps({
        "success": True,
        "msg": "Comment successfully created",
        'commentID': str(comment_id)
    }, default=str)

# Delete comment from database
@app.route('/deleteComment', methods=['POST'])
def deleteComment():
    db = client['rkm']
    comments = db['comments']
    recipes = db['recipes']
    commentData = request.get_json() #pass _id for comment
    comment = comments.find_one({'_id': ObjectId(commentData['_id'])})
    if comment:
        comments.delete_one(comment)
        recipe = recipes.find_one({'_id': ObjectId(comment['commentHead_id'])})
        commentHead = comments.find_one({'_id': ObjectId(comment['commentHead_id'])})
        if recipe != None:
            recipe['comments'].remove(str(commentData['_id']))
            recipes.update_one({'_id': recipe['_id']},
            {
                '$set': recipe,
            })
            return json.dumps({
                'success': True,
                'msg': 'Comment deleted'
            }, default=str)
        elif commentHead != None:
            commentHead['replies'].remove(str(commentData['_id']))
            comments.update_one({'_id': commentHead['_id']},
            {
                '$set': commentHead,
            })
            return json.dumps({
                'success': True,
                'msg': 'Comment deleted'
            }, default=str)
    return json.dumps({'success': False, 'msg': 'Comment not found'}, default=str)

# Edit comment details
@app.route('/editComment', methods=['POST'])
def editComment():
    db = client['rkm']
    comments = db['comments']
    data = request.get_json() #Pass 2 items: _id of comment and comment_text
    comment = comments.find_one({'_id': ObjectId(data['_id'])})
    comment['comment_text'] = data['comment_text']
    comment['datetime'] = datetime.now()
    comments.update_one({'_id': comment['_id']},
        {
            '$set': comment,
        }
    )

    return json.dumps({"success": True, 'msg': "Comment updated", 'recipe': commentInfo(comment)}, default=str)

#Get recipe comments
@app.route('/getRecipeComments', methods=['GET'])
def getRecipeComments(_id = None, id_type = None):
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    comments = db['comments']
    if(_id == None):
        _id = request.args.get('_id') # ?_id = can be recipe or comment id
    if(id_type == None):
        id_type = request.args.get('type') # ?type = recipe or comment
    retList = []
    if id_type == 'recipe':
        recipe = recipes.find_one({'_id': ObjectId(_id)})
        if recipe:
            for comm in recipe['comments']:
                comment = comments.find_one({'_id': ObjectId(comm)})
                commInfo = commentInfo(comment)
                user = users.find_one({'_id': ObjectId(commInfo['user_id'])})
                commInfo['username'] = user['username']
                commInfo['reply_info'] = []
                commInfo['reply_info'].append(json.loads(getRecipeComments(_id = comm, id_type = 'comment'))['data'])
                retList.append(commInfo)
            retList.sort(key = lambda a: a['datetime'])
            return json.dumps({
                'success': True,
                'msg': 'Recipe comments found',
                'data': retList
            }, default=str)
    elif id_type == 'comment':
        comment = comments.find_one({'_id': ObjectId(_id)})
        if comment:
            for reply in comment['replies']:
                reply_obj = comments.find_one({'_id': ObjectId(reply)})
                replyInfo = commentInfo(reply_obj)
                user = users.find_one({'_id': ObjectId(replyInfo['user_id'])})
                replyInfo['username'] = user['username']
                retList.append(replyInfo)
            retList.sort(key=lambda a: a['datetime'])
            return json.dumps({
                'success': True,
                'msg': 'Replies found',
                'data': retList
            }, default=str)
    return json.dumps({'success': False, 'msg': 'Recipe/reply comments not found'}, default=str)

# Adds new rating to database
@app.route('/addRating', methods=['POST'])
def addRating():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']

    added_rating = request.get_json() # pass user_id, recipe_id, rating

    user = users.find_one({'_id': ObjectId(added_rating['user_id'])})
    users.update_one({'_id': user['_id']},
    {
        '$set': {
            'ratings.' + added_rating['recipe_id']: added_rating['rating'],
        }
    })
    recipe = recipes.find_one({'_id': ObjectId(added_rating['recipe_id'])})
    recipe['rating_total'] += added_rating['rating']
    recipe['num_ratings'] += 1
    recipes.update_one({'_id': recipe['_id']},
    {
        '$set': recipe,
    })
    return json.dumps({
        "success": True,
        "msg": "Rating successfully added",
    }, default=str)

#Edit rating
@app.route('/editRating', methods=['POST'])
def editRating():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']

    data = request.get_json() # pass rating_id, recipe_id, rating, prev_rating

    recipe = recipes.find_one({'_id': ObjectId(data['recipe_id'])})

    recipe['rating_total'] -= data['prev_rating']
    recipe['rating_total'] += data['rating']
    recipes.update_one({'_id': recipe['_id']},
    {
        '$set': recipe,
    })
    users.update_one({'_id': ObjectId(data['user_id'])},
    {
        '$set': {
            'ratings.' + data['recipe_id']: data['rating'],
        },
    })

    return json.dumps({
        "success": True,
        "msg": "Rating successfully updated",
    }, default=str)

#Get recipe rating
@app.route('/getRating', methods=['GET'])
def getRating():
    db = client['rkm']
    users = db['users']

    user_id = request.args.get('user_id') # ?user_id = 
    recipe_id = request.args.get('recipe_id') # append after id &recipe_id = 
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        if recipe_id in user['ratings']:
            return json.dumps({
                    'success': True,
                    'msg': 'Rating found',
                    'rating': user['ratings'][recipe_id]
                }, default=str)
        return json.dumps({
            'success': True,
            'msg': 'Rating not found',
            'rating': 0
        }, default=str)
    return json.dumps({'success': False, 'msg': 'User not found'}, default=str)

#Get all recipes
@app.route('/getAllRecipes', methods=['GET'])
def getAllRecipes():
    db = client['rkm']
    recipes = db['recipes']
    items = []
    for recipe in recipes.find({'deleted':0}):
        items.append(str(recipe['_id']))
    return json.dumps(items, default=str)

#Get following recipes
#TODO: sort by date posted
@app.route('/getFollowingRecipes', methods=['GET'])
def getFollowingRecipes():
    db = client['rkm']
    recipes = db['recipes']
    users = db['users']
    user_id = request.args.get('user_id') # ?user_id = 
    user = users.find_one({'_id': ObjectId(user_id)})
    items = []
    for recipe in recipes.find({'deleted':0}):
        if(str(recipe['user_id']) in user['following']):
            ind = 0
            for item in items:
                if(item['datetime'] > recipe['datetime']):
                    ind += 1
                else:
                    break
            items.insert(ind, recipe)

    id_arr = []
    for recipe in items:
        id_arr.append(recipe['_id'])
    return json.dumps(id_arr, default=str)


#Compare recipe ingredients to pantry
@app.route('/compareRecipeToPantry', methods=['GET'])
def compareRecipeToPantry():
    db = client['rkm']
    users = db['users']
    recipes = db['recipes']
    data = request.get_json()
    user = users.find_one({'_id': ObjectId(data['user_id'])})
    recipe = recipes.find_one({'_id': ObjectId(data['recipe_id'])})
    if user and recipe:
        hasIngredient = []
        notHaveIngredient = []
        for ingredient in recipe['ingredients']:
            if ingredient in user['pantry']['protein'] or ingredient in user['pantry']['vegetables'] or ingredient in user['pantry']['grains'] or ingredient in user['pantry']['fruit'] or ingredient in user['pantry']['dairy'] or ingredient in user['pantry']['other']:
                hasIngredient.append(ingredient)
            else:
                notHaveIngredient.append(ingredient)
        return json.dumps({
            'hasIngredient': hasIngredient,
            'notHaveIngredient': notHaveIngredient
        }, default=str)
    return json.dumps({'success': False, 'msg': 'Either user or recipe not found'}, default=str)

def keywordList(text):
    if text == None:
        return []
    res = ""
    for c in text:
        if c.isalpha() or c.isspace():
            res += c
    res.lower()
    return list(res.split(" "))


@app.route('/search', methods=["GET"])
def search():
    db = client['rkm']
    recipes = db['recipes']
    users = db['users']

    data = request.args
    dataQuery = data.get('query') #key words only. DO NOT HAVE common words like THE or A like that
    dataTypes = data.get('type') # if you want to search all, pass in all title, description, and username

    searchQuery = keywordList(dataQuery)
    dataTypes = keywordList(dataTypes)

    typeRecipe = ["title", "description"]
    typeUser = ["username"]

    searchRecipe = []
    searchUser = []

    for dataType in dataTypes:
        if dataType in typeRecipe:
            directMatches = list(recipes.find({'$and': [{dataType: {'$regex': ".*" + dataQuery + ".*", "$options": "i"}}, {'deleted':0}]}))
            for match in directMatches:
                searchRecipe.append(str(match['_id']))

            for query in recipes.find({'deleted':0}):
                try:
                    isFound = False

                    title = keywordList(query[dataType])
                    
                    for word1 in title:
                        for search1 in searchQuery:
                            if td.levenshtein.normalized_similarity(word1, search1) > .5:
                                searchRecipe.append(str(query['_id']))
                                isFound = True
                            if isFound:
                                break
                        if isFound:
                            break
                except:
                    pass

        if dataType in typeUser:
            directMatches = list(users.find({'$and': [{dataType: {'$regex': ".*" + dataQuery + ".*", "$options": "i"}}, {'deleted':0}]}))
            for match in directMatches:
                searchUser.append(str(match['_id']))

            for query in users.find({'deleted':0}):
                try:
                    isFound = False

                    title = keywordList(query[dataType])
                    
                    for word1 in title:
                        for search1 in searchQuery:
                            if td.levenshtein.normalized_similarity(word1, search1) > .5:
                                searchUser.append(str(query['_id']))
                                isFound = True
                            if isFound:
                                break
                        if isFound:
                            break
                except:
                    pass

    # remove duplicate objects
    searchRecipe = {repr(each): each for each in searchRecipe}.values()
    searchUser = {repr(each): each for each in searchUser}.values()
    return dumps({
            'success': True,
            'users': searchUser,
            'recipes': searchRecipe
        })

@app.route('/recommend', methods=["GET"])
def recommend():
    db = client['rkm']
    recipes = db['recipes']
    users = db['users']

    user_id = request.args.get('user_id')  # ?user_id =
    user = users.find_one({'_id': ObjectId(user_id)})

    liked_and_saved = user['liked_recipes'] + user['saved_recipes']

    tagslist = []
    for rec in liked_and_saved:
        recipe = recipes.find_one({'_id': ObjectId(rec)})
        tagslist.extend(recipe['tags'])

    counter = collections.Counter(tagslist)
    common_tags = counter.most_common(10)

    tagged_recipes = set()

    for tag in common_tags:
        print(tag[0])
        rec_tag = recipes.find({'tags': tag[0]}, {'_id':1})
        for id in rec_tag:
            if id['_id'] not in liked_and_saved:
                tagged_recipes.add(str(id['_id']))

    return json.dumps(list(tagged_recipes), default=str)


if __name__ == "__main__":
    app.run(host=os.getenv('HOST_IP'), port=os.getenv('HOST_PORT'))