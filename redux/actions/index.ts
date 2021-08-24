import firebase from "firebase";
import {USER_STATE_CHANGE,USER_POST_STATE_CHANGE} from "../constants/index";

export function fetchUser(){
    return((dispatch:any)=>{
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser?.uid)
        .get()
        .then((snapshot)=>{
                console.log("this should give the current user1",snapshot)
                if(snapshot.exists){
                        console.log("this should give the current user",snapshot.data())
                        dispatch({type:USER_STATE_CHANGE,currentUser:snapshot.data()})
                }
        }).catch((err)=>console.log("WTF BRP",err))

        })
    
}

export function fetchUserPosts(){
        return((dispatch:any)=>{
            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser?.uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                    let posts = snapshot.docs.map(doc=>{
                            const data = doc.data();
                            const id = doc.id;
                            return{id,...data}
                    })
                    dispatch({type:USER_POST_STATE_CHANGE,posts})
                    console.log(posts)
            })
    
            })
        
    }