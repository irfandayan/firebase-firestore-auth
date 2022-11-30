import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

//  Web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCpgoQ0esSIPBZWlJ0NuSSiwIjm3U5ADmY',
  authDomain: 'fir-9-solo.firebaseapp.com',
  projectId: 'fir-9-solo',
  storageBucket: 'fir-9-solo.appspot.com',
  messagingSenderId: '446461441321',
  appId: '1:446461441321:web:c3d077d8ed2de08d0af338',
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firestore Database Service
const db = getFirestore();

// Initialize Authentication Service
const auth = getAuth();

// Collection reference
const colRef = collection(db, 'books');

// // Get collection data - Method# 1
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({
//         ...doc.data(),
//         id: doc.id,
//       });
//     });

//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// Real time collection data - Method# 2
// onSnapshot(colRef, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({
//       ...doc.data(),
//       id: doc.id,
//     });
//   });

//   console.log(books);
// });

// queries
// const q = query(
//   colRef,
//   where('author', '==', 'Sim Kardio'),
//   orderBy('title', 'desc')
// );

// order by created at
const q = query(colRef, orderBy('createdAt'));

// Real time collection data with Query - Method# 3
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  console.log(books);
});

// Adding docs
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// Deleting docs
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// Set reference to a single document
const docRef = doc(db, 'books', 'LwSiCqs3eXvdiIDATJ6N');

// Get a single document
// getDoc(docRef).then((doc) => {
//   console.log(doc.data(), doc.id);
// });

// Get real time single document
// note: you can update the documednt inside firestore directly and it will be fetched immdiately inside browser
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// Update a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'update title',
  }).then(() => {
    updateForm.reset();
  });
});

// Signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      console.log('user created:', credential.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Logging in and out
const logoutButton = document.querySelector('.logout');

logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      // console.log('the user signed out');
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      // console.log('user logged in: ', credential.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user);
});

// Unsubsribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
});
