import React,{useState,useEffect} from "react";
import { View, Text, Image, FlatList, StyleSheet,Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import 'firebase/firestore';

const Feed: React.FC<any> = (props) => {
  const [userPosts,setUserPosts] =useState<any>(null)


  useEffect(() =>{
    let posts: any[] = [];
    if(props.usersLoaded==props.following.length){
        for(let i=0 ; i<props.following.length ; i++){
            const user = props.users.find((el:any)=> el.user.uid===props.following[i]);
            if(user!=undefined){
                console.log("are you stupid user",user)
                posts=[...posts,...user.posts]
            }
        }
        posts.sort((x,y)=>x.creation - y.creation)
        setUserPosts(posts)
    }
    console.log(posts,props.users)
  },[props.usersLoaded])

  const onFollow = () =>{
    firebase.firestore()
    .collection("following")
    //@ts-ignore
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .set({})
  }

  const onUnFollow = () =>{
    firebase.firestore()
    .collection("following")
    //@ts-ignore
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .doc(props.route.params.uid)
    .delete()
  }
//   if(user==null){
//     return( <View/>)
//   }
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
       
          numColumns={1}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
            <Text style={styles.container}>{item.user.name}</Text>
            <Image style={styles.image} source={{ uri: item.downLoadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 10,
  },
  containerGallery: {
      
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage:{
    flex:1,
  },
});
const mapStateToProps = (store: {
  userState: { currentUser: any; posts: any,following:any };
  usersState:any
}) => {
  console.log("store", store);
  return {
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded:store.usersState.usersLoaded,

  };
};
export default connect(mapStateToProps, null)(Feed);
