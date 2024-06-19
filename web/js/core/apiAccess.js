//Depends on: core.js

var $apiLocation = "/api/v1/";

/******************************************************************************
 * API Class
 ******************************************************************************/
function $API(){
    //TODO: Wrap each API in a sub-object. ($API.auth.login() for example) / generally reorganize this.
};

/******************************************************************************
 * Account Creation / Modification
 ******************************************************************************/

$API.register = function(username, email, password, code) {
    var retVal = false;

    $.ajax({
        "url": $apiLocation + "account",
        "type": "POST",
        "data": {
            "username": username,
            "email": email,
            "password": $.sha1(password),
            "code": code
        },
        "async": false,
        "success": function(didRegister) {
            if(didRegister) {
                retVal = true;
            }
        }
    });

    return retVal;
};

$API.checkNewUser = function(username, email) {
    var ajaxData = [], retVal = false;

    if(username) {
        ajaxData['username'] = username;
    } else if(email) {
        ajaxData['email'] = email;
    } else return false;

    $.ajax({
        "url": $apiLocation + "account",
        "type": "GET",
        "data": ajaxData,
        "success": function(isAvailable) {
            if(isAvailable) {
                retVal = true;
            }
        }
    });

    return retVal;
};

/******************************************************************************
 * Authentication
 ******************************************************************************/

$API.login = function(username, password, remember, callbacks) {
    return $.ajax({
        "url": $apiLocation + "authenticate",
        "type": "POST",
        "data": {
            "user": username,
            "password": $.sha1(password),
            "remember": remember ? 1 : 0
        },
        "success": function() {
            if(typeof(callbacks) == "function") {
                callbacks(true);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](true);
            }
        },
        "statusCode": {
            "403": function() {
                if(callbacks instanceof Object && typeof(callbacks['failure']) == "function") {
                    callbacks['failure'](false);
                }
            }
        }
    });
};

$API.logout = function(callback) {
    return $.ajax({
        "url": $apiLocation + "authenticate",
        "type": "DELETE",
        "success": function(didLogout) {
            if(didLogout) {
                if(typeof(callback) == "function") {
                    callback(true);
                }
            }
        }
    });
};

/******************************************************************************
 * Items
 ******************************************************************************/

$API.getItems = function(offersAtTop, callbacks) {
    return $.ajax({
        "url": $apiLocation + "items",
        "type": "GET",
        "data": {
            "offersAtTop": offersAtTop ? 1 : 0
        },
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noItems']) == "function") {
                    callbacks['noItems']();
                }
            }
        }
    });
};

$API.getListedItems = function(username, callbacks) {
    return $.ajax({
        "url": $apiLocation + "items/listed",
        "type": "GET",
        "data": {
            "user": username
        },
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noItems']) == "function") {
                    callbacks['noItems']();
                }
            }
        }
    });
};

$API.getRandomItems = function(numItems, username, callback) {
    return $.ajax({
        "url": $apiLocation + "items/randomitems",
        "type": "GET",
        "data": {
            "user": username,
            "numItems": numItems
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.searchItems = function(query, owned, callbacks) {
    return $.ajax({
        "url": $apiLocation + "search/items",
        "type": "GET",
        "data": {
            "for": query,
            "owned": owned ? 1 : 0
        },
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noItems']) == "function") {
                    callbacks['noItems']();
                }
            }
        }
    });
};

$API.getItem = function(itemID, withImages, callback) {
    return $.ajax({
        "url": $apiLocation + "items/item",
        "type": "GET",
        "data": {
            "id": itemID,
            "withImages": withImages ? 1 : 0
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.addItem = function(itemData, callback) {
    return $.ajax({
        "url": $apiLocation + "items",
        "type": "POST",
        "data": {
            "name": itemData['name'],
            "quantity": itemData['quantity'] ? itemData['quantity'] : null,
            "description": itemData['description'],
            "itemCondition": itemData['condition'],
            "tags": itemData['tags'],
            "category": itemData['category'],
            "allowTrades": itemData['allowTrades'],
            "allowCash": itemData['allowCash'],
            "buyNow": itemData['buyNow'],
            "travelDistance": itemData['travelDistance'],
            "shipTimeframe": itemData['shipTimeframe'],
            "listed": itemData['listed'] ? 1 : 0
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.updateItem = function(itemID, itemData, callback) {
    var ajaxData = {
        "id": itemID,
        "name": itemData['name'],
        "quantity": itemData['quantity'] ? itemData['quantity'] : null,
        "description": itemData['description'],
        "itemCondition": itemData['condition'],
        "tags": itemData['tags'],
        "category": itemData['category'],
        "allowTrades": itemData['allowTrades'],
        "allowCash": itemData['allowCash'],
        "buyNow": itemData['buyNow'],
        "travelDistance": itemData['travelDistance'],
        "shipTimeframe": itemData['shipTimeframe'],
        "listed": itemData['listed'] ? 1 : 0
    };

    //Thumbnail set
    if(itemData['thumbID']) {
        ajaxData['thumbID'] = itemData['thumbID'];
    }

    //Image deletes
    if(itemData['deleteImages']) {
        ajaxData['deleteImages'] = itemData['deleteImages'];
    }

    return $.ajax({
        "url": $apiLocation + "items",
        "type": "PUT",
        "data": ajaxData,
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.removeItem = function(itemID, callback) {
    return $.ajax({
        "url": $apiLocation + "items/" + itemID,
        "type": "DELETE",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.getCategory = function(catID, callback) {
    return $.ajax({
        "url": $apiLocation + "items/category/" + (catID ? catID : ''),
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Watch
 ******************************************************************************/

$API.getWatch = function(callback) {
    return $.ajax({
        "url": $apiLocation + "items/watch",
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.addWatch = function(itemID, callback) {
    return $.ajax({
        "url": $apiLocation + "items/watch/" + itemID,
        "type": "POST",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.removeWatch = function(itemID, callback) {
    return $.ajax({
        "url": $apiLocation + "items/watch/" + itemID,
        "type": "DELETE",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Followers
 ******************************************************************************/

$API.getFollowers = function(user, callback) { //Followers
    return $.ajax({
        "url": $apiLocation + "account/followers/" + (user ? user : ''),
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.getFollowing = function(user, callback) { //Following
    return $.ajax({
        "url": $apiLocation + "account/following/" + (user ? user : ''),
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.addFollow = function(user, callback) {
    return $.ajax({
        "url": $apiLocation + "account/follow/" + user,
        "type": "POST",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.removeFollow = function(user, callback) {
    return $.ajax({
        "url": $apiLocation + "account/follow/" + user,
        "type": "DELETE",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Images / Avatars
 ******************************************************************************/

$API.cropThumb = function(cropData, callback) {
    return $.ajax({
        "url": $apiLocation + "image/thumb",
        "type": "PUT",
        "data": cropData,
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.cropAvatarThumb = function(cropData, callback) {
    return $.ajax({
        "url": $apiLocation + "image/avatarthumb",
        "type": "PUT",
        "data": cropData,
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.useGravatar = function(callback) {
    return $.ajax({
        "url": $apiLocation + "account/gravatar",
        "type": "PUT",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Offers
 ******************************************************************************/

$API.getOffers = function(itemID, callbacks) {
    return $.ajax({
        "url": $apiLocation + "offers/" + itemID,
        "type": "GET",
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noOffers']) == "function") {
                    callbacks['noOffers']();
                }
            }
        }
    });
};

$API.addOffer = function(itemID, offerQty, offerData, callbacks) {
    return $.ajax({
        "url": $apiLocation + "offers",
        "type": "POST",
        "data": {
            "itemID": itemID,
            "qty": offerQty ? parseInt(offerQty) : 1,
            "offers": offerData
        },
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "400": function() {
                if(callbacks instanceof Object && typeof(callbacks['maxOffers']) == "function") {
                    callbacks['maxOffers']();
                }
            }
        }
    });
};

$API.acceptOffer = function(itemID, offerID, callback) {
    return $.ajax({
        "url": $apiLocation + "offers/accept",
        "type": "POST",
        "data": {
            "itemID": itemID,
            "offerID": offerID
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.rejectOffer = function(offerID, callback) {
    return $.ajax({
        "url": $apiLocation + "offers/reject/" + offerID,
        "type": "POST",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.buyOut = function(itemID, quantity, callback) {
    return $.ajax({
        "url": $apiLocation + "offers/buy",
        "type": "POST",
        "data": {
            "itemID": itemID,
            "quantity": parseInt(quantity)
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Transactions
 ******************************************************************************/

$API.getTransactionList = function(time, view, callbacks) {
    return $.ajax({
        "url": $apiLocation + "transactions/list",
        "type": "GET",
        "data": {
            "time": time ? time : 0,
            "view": view ? view : "all"
        },
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noTransactions']) == "function") {
                    callbacks['noTransactions']();
                }
            }
        }
    });
};

$API.getTransaction = function(transactionID, callback) {
    return $.ajax({
        "url": $apiLocation + "transactions/" + transactionID,
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Messages
 ******************************************************************************/

$API.getMessage = function(msgID, callback) {
    return $.ajax({
        "url": $apiLocation + "messages/" + msgID,
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.sendMessage = function(msgData, callback) {
    return $.ajax({
        "url": $apiLocation + "messages",
        "type": "POST",
        "data": {
            "to": msgData['to'],
            "subject": msgData['subject'] ? msgData['subject'] : null,
            "msg": msgData['message']
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.setMessageState = function(messages, action, callback) {
    if(!messages instanceof Array) {
        messages = [messages];
    }

    return $.ajax({
        "url": $apiLocation + "messages/state",
        "type": "PUT",
        "data": {
            "ids": messages,
            "action": action
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.emptyMessages = function(callback) {
    return $.ajax({
        "url": $apiLocation + "messages/trash",
        "type": "DELETE",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.numUnreadMessages = function(callback) {
    return $.ajax({
        "url": $apiLocation + "messages/unread",
        "type": "GET",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Notifications
 ******************************************************************************/

$API.getNotifications = function(callbacks) {
    return $.ajax({
        "url": $apiLocation + "account/notifications",
        "type": "GET",
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noNotif']) == "function") {
                    callbacks['noNotif']();
                }
            }
        }
    });
};

/******************************************************************************
 * Feeds
 ******************************************************************************/

$API.getActivityFeed = function(user, callbacks) {
    var ajaxData = {};

    if(user) ajaxData['user'] = user;

    return $.ajax({
        "url": $apiLocation + "account/feed",
        "type": "GET",
        "data": ajaxData,
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noFeed']) == "function") {
                    callbacks['noFeed']();
                }
            }
        }
    });
};

$API.getTransactionFeed = function(callbacks) {
    return $.ajax({
        "url": $apiLocation + "account/transactionfeed",
        "type": "GET",
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noFeed']) == "function") {
                    callbacks['noFeed']();
                }
            }
        }
    });
};

$API.addFeedNote = function(noteMsg, callback) {
    return $.ajax({
        "url": $apiLocation + "account/note",
        "type": "POST",
        "data": {
            "note": noteMsg
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

/******************************************************************************
 * Reviews
 ******************************************************************************/

$API.addReview = function(transactionID, stars, review, callback) {
    return $.ajax({
        "url": $apiLocation + "transactions/review",
        "type": "POST",
        "data": {
            "transactionID": transactionID,
            "stars": stars,
            "review": review
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.getReviews = function(user, callbacks) {
    var ajaxData = {};

    if(user) ajaxData['user'] = user;

    return $.ajax({
        "url": $apiLocation + "account/reviews",
        "type": "GET",
        "data": ajaxData,
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noReviews']) == "function") {
                    callbacks['noReviews']();
                }
            }
        }
    });
};

/******************************************************************************
 * Wishlists
 ******************************************************************************/

$API.addWishlist = function(ident, tags, callback) {
    return $.ajax({
        "url": $apiLocation + "account/wishlist",
        "type": "POST",
        "data": {
            "ident": ident,
            "tags": tags
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.updateWishlist = function(wishID, ident, tags, callback) {
    return $.ajax({
        "url": $apiLocation + "account/wishlist",
        "type": "PUT",
        "data": {
            "id": wishID,
            "ident": ident,
            "tags": tags
        },
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.removeWishlist = function(wishID, callback) {
    if(typeof(wishID) == "object") {
        wishID = wishID.join(';');
    }

    return $.ajax({
        "url": $apiLocation + "account/wishlist/" + wishID,
        "type": "DELETE",
        "success": function(data) {
            if(typeof(callback) == "function") {
                callback(data);
            }
        }
    });
};

$API.getWish = function(wishID, callbacks) {
    return $.ajax({
        "url": $apiLocation + "account/wish/" + wishID,
        "type": "GET",
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() {
                if(callbacks instanceof Object && typeof(callbacks['noWish']) == "function") {
                    callbacks['noWish']();
                }
            }
        }
    });
};

$API.getWishlist = function(user, callbacks) {
    var ajaxData = {};

    if(user) ajaxData['user'] = user;

    return $.ajax({
        "url": $apiLocation + "account/wishlist",
        "type": "GET",
        "data": ajaxData,
        "success": function(data) {
            if(typeof(callbacks) == "function") {
                callbacks(data);
            } else if(callbacks instanceof Object && typeof(callbacks['success']) == "function") {
                callbacks['success'](data);
            }
        },
        "statusCode": {
            "404": function() { //TODO: Change all of these to simply pass the statusCode function as the error callback?
                if(callbacks instanceof Object && typeof(callbacks['noWishes']) == "function") {
                    callbacks['noWishes']();
                }
            }
        }
    });
};