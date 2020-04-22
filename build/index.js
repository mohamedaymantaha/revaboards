"use strict";
var User = require('./models/user');
var userRepo = require('./repos/user-repo');
var mailWorker = require('./util/mail-worker');
// let test = new User(0, 'test', 'test', 'test', 'test', 'test@revature.com', new Date('01/01/1990'));
// userRepo.addNewUser(test, newUser => {
//     console.log(newUser);
//     mailWorker.emit('newRegister', newUser.email);
// });
userRepo.getInstance().addNewUser(new User(0, 'a', 'a', 'a', 'a', 'a', new Date()), function (err, result) {
    err && console.log('Error: ', err);
    result && console.log('Result: ', result);
});
