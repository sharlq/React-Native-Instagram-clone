import React,{useState,useEffect} from "react";
import { View, Text, Image, FlatList, StyleSheet,Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import 'firebase/firestore';

const Profile: React.FC<any> = (props) => {
  const [userPosts,setUserPosts] =useState<any>(null)
  const [user,setUser] =useState<any>(null)
  const [following, setFollowing] = useState<any>(null)

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
                     setUser(snapshot.data())
              }
      }).catch((err)=>console.log("WTF",err))

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
    console.log(props.following,props.route.params.uid,props.following.indexOf(props.route.params.uid))
    if(props.following.indexOf(props.route.params.uid)==-1){
      setFollowing(false);
    }else{
      setFollowing(true)
    }

  },[props.route.params.uid,props.following])

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
  if(user==null){
    return( <View/>)
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {//@ts-ignore
        props.route.params.uid!==firebase.auth().currentUser.uid
          ?(
            <View>
              {
                following
                ?(<Button
                  title="Following"
                  onPress={()=> onUnFollow()}
                />)
                :(<Button
                  title="Follow"
                  onPress={()=> onFollow()}
                />)
              }
            </View>
          )
          :null
      }
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
  userState: { currentUser: any; posts: any,following:any };
}) => {
  console.log("store", store);
  return {
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
  };
};
export default connect(mapStateToProps, null)(Profile);
