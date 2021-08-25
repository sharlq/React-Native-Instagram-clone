import React,{useState,useEffect} from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import 'firebase/firestore';

const Profile: React.FC<any> = (props) => {
  const [userPosts,setUserPosts] =useState<any>(null)
  const [user,setUser] =useState<any>(null)
  console.log(props)
  useEffect(() =>{
    const {currentUser,posts} = props
    //@ts-ignore
    if(props.route.params.uid===firebase.auth().currentUser.uid){
      setUser(currentUser)
      setUserPosts(posts)
    }else{
      firebase.firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot)=>{
              if(snapshot.exists){
                     setUser(snapshot.data)
              }
      }).catch((err)=>console.log("WTF BRP",err))

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
                    setUserPosts(posts)
            })



    }

  },[props.route.params.uid])

  if(user===null){
    return( <View/>)
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
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
  containerGallery: {},
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage:{
    flex:1/3,
  },
});
const mapStateToProps = (store: {
  userState: { currentUser: any; posts: any };
}) => {
  console.log("store", store);
  return {
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
  };
};
export default connect(mapStateToProps, null)(Profile);
