/**
 * Firebase Cloud Functions
 * 
 * This is a placeholder for Firebase Cloud Functions.
 * Add your custom functions here.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Auth trigger: Called when a new user is created
exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {
  // Add custom logic here
  console.log('New user created:', user.uid);
  return user;
});

// Auth trigger: Called when a user signs in
exports.beforeSignIn = functions.auth.user().beforeSignIn((user, context) => {
  // Add custom logic here
  console.log('User signed in:', user.uid);
  return user;
});

// Example: HTTP function
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase Cloud Functions!');
});

// Example: Firestore trigger
exports.onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    const newUser = snap.data();
    console.log('New user document created:', context.params.userId);
    return null;
  });