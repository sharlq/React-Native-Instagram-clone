import firebase from "firebase";
import {USER_STATE_CHANGE} from "../constants/index";

export function fetchUser(){
    return((dispatch:any)=>{
        firebase.firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser?.uid)
        .get()
        .then((snapshot)=>{
                if(snapshot.exists){
                        console.log(snapshot)
                        dispatch({type:USER_STATE_CHANGE,currentUser:snapshot.data()})
                }
        })

        })
    
}