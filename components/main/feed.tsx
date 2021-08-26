import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import "firebase/firestore";

const Feed: React.FC<any> = (props) => {
  const [userPosts, setUserPosts] = useState<any>(null);

  useEffect(() => {
    let posts: any[] = [];
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(
        (x: { creation: number }, y: { creation: number }) =>
          x.creation - y.creation
      );
      setUserPosts(posts);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  const onLikePress = (uid: string, postId: string) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      //@ts-ignore
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (uid: string, postId: string) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      //@ts-ignore
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

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
              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDislikePress(item.user.uid, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLikePress(item.user.uid, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  props.navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.uid,
                  })
                }
              >
                View Comments
              </Text>
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
  containerImage: {
    flex: 1,
  },
});
const mapStateToProps = (store: {
  userState: { currentUser: any; posts: any; following: any };
  usersState: any;
}) => {
  return {
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
    feed: store.usersState.feed,
  };
};
export default connect(mapStateToProps, null)(Feed);
