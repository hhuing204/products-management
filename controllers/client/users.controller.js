//MOdel
const User = require("../../models/user.model")

//socket
const userSocket = require("../../sockets/client/users.socket")


//[GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    //socket
    userSocket(res)
    //socket
    const userId = res.locals.user.id

    const myUser = await User.findOne({
        _id: userId
    })
    const reqFriends = myUser.requestFriends
    const acpFriends = myUser.acceptFriends
    console.log(reqFriends)

    const users = await User.find({
        $and: [
            {_id: { $nin: reqFriends}},
            {_id: {$ne: userId}},
            {_id: {$nin: acpFriends}}
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName")
    // console.log(newProducts)
    res.render('client/pages/users/not-friend', { 
        title: 'List users',
        users: users
    })
}

//[GET] /users/request
module.exports.request = async (req, res) => {
    //socket
    userSocket(res)
    //socket
    const userId = res.locals.user.id

    const myUser = await User.findOne({
        _id: userId
    })
    const reqFriends = myUser.requestFriends
    // const acpFriends = myUser.acceptFriends
    // console.log(reqFriends)

    const users = await User.find({
        _id: {$in: reqFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName")

    res.render('client/pages/users/request', { 
        title: 'List users request',
        users: users
    })
}


//[GET] /users/accept
module.exports.accept= async (req, res) => {
    //socket
    userSocket(res)
    //socket
    const userId = res.locals.user.id

    const myUser = await User.findOne({
        _id: userId
    })
    // const reqFriends = myUser.requestFriends
    const acpFriends = myUser.acceptFriends
    // console.log(reqFriends)

    const users = await User.find({
        _id: {$in: acpFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName")

    res.render('client/pages/users/accept', { 
        title: 'List users accept',
        users: users
    })
}

//[GET] /users/friends
module.exports.friends= async (req, res) => {
    //socket
    userSocket(res)
    //socket

    const userId = res.locals.user.id

    const myUser = await User.findOne({
        _id: userId
    })
    const friendList = myUser.friendList
    const friendListId = friendList.map(item=> item.user_id)

    const users = await User.find({
        _id: {$in: friendListId},
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline")
    
    res.render('client/pages/users/friends', { 
        title: 'List Friends',
        users: users
    })
}