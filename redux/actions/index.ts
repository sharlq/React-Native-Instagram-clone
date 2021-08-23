import firebase from "firebase";
import {USER_STATE_CHANGE} from "../constants/index";

export function fetchUser(){
    return((dispatch:any)=>{
                console.log(firebase.auth().currentUser)    
                dispatch({type:USER_STATE_CHANGE,currentUser:firebase.auth().currentUser})

        })
    
}