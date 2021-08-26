import firebase from "firebase";
import {
  USER_STATE_CHANGE,
  USER_POST_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA
} from "../constants/index";

export function clearData(){
        return ((dispatch:any)=>{
                dispatch({ type:CLEAR_DATA})
        })
}

export function fetchUser() {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser?.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        }
      });
  };
}

export function fetchUserPosts() {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser?.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POST_STATE_CHANGE, posts });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch: any) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser?.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following });
        for(let i =0 ; i < following.length ; i++ ){
                dispatch(fetchUsersData(following[i])); 
        }
      });
  };
}

export function fetchUsersData(uid: string) {
  return (dispatch: any, getState: any) => {
    const found = getState().usersState.users.some((el: any) => el.uid === uid);
    if (!found) {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user: any = snapshot.data();
            user.uid = snapshot.id;
            dispatch({ type: USERS_DATA_STATE_CHANGE, user });

            dispatch(fetchUsersFollowingPosts(user.uid))
          } else {
            console.log("dosent exist");
          }
        });
    }
  };
}

export function fetchUsersFollowingPosts(uid: string) {
  return (dispatch: any, getState: any) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
        //@ts-ignore
        const uid = snapshot._.query.C_.path.segments[1];
        const user = getState().usersState.users.find(
          (el: any) => el.uid === uid
        );
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data,user };
        });
        
        dispatch({ type: USERS_POSTS_STATE_CHANGE, posts,uid });
      });
  };
}
