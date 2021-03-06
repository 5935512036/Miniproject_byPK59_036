import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
    apiKey: "AIzaSyCLUotplu9-J9_77IZWTJtqqIxM-uqoU68",
    authDomain: "darunsat-library.firebaseapp.com",
    databaseURL: "https://darunsat-library.firebaseio.com",
    projectId: "darunsat-library",
    storageBucket: "darunsat-library.appspot.com",
    messagingSenderId: "175321188686",
    appId: "1:175321188686:web:7d09edc1537d639a15361f",
    measurementId: "G-D3PR7D8FNZ"
}

class Firebase {
    constructor() {

        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    async login(email, password) {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
            console.log(err);
        });
        return user;
    }

    async register(email, password) {
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password).catch(err => {
            console.log(err);
        });
        return user;
    }

    async logout() {
        const logout = await firebase.auth().signOut().catch(err => console.log(err));
        return logout;
    }

    async getUserState() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        })
    }

    async getPosts() {
        let postsArray = [];
        const posts = await firebase.firestore().collection("adds").get();

        posts.forEach(doc => {
            postsArray.push({ id: doc.id, data: doc.data() });
        })
        return postsArray;
    }

    async createPost(add) {
        const storageRef = firebase.storage().ref();
        const storageChild = storageRef.child(add.cover.name);
        const addCover = await storageChild.put(add.cover);
        const downloadURL = await storageChild.getDownloadURL();
        const fileRef = addCover.ref.location.path;
        let newbook = {
            code: add.code,
            namebook: add.namebook,
            group: add.group,
            cover: downloadURL,
            fileref: fileRef
        }
        const firestoreadd = await firebase.firestore().collection("adds").add(newbook).catch(err => {
            console.log(err);
        });
        return firestoreadd;
    }


}

export default new Firebase();