import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput } from "react-native";

import firebase from "firebase";
import "firebase/firestore";

import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { fetchUsersData } from "../../redux/actions";

const Comments: React.FC<any> = (props) => {
  const [comments, setComments] = useState<any>([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const matchUserToComment = (comment: any) => {
      for (let i = 0; i < comment.length; i++) {
        if (comment[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find((x: any) => x.uid === comment[i].creator);
        if (user == undefined) {
          fetchUsersData(comment[i].creator, false);
        } else {
          comment[i].user = user;
        }
      }
      setComments(comment);
    };
    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
          console.log("we have been here", comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        //@ts-ignore
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <View>
              {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
              <Text>{item.text}</Text>
            </View>
          );
        }}
      />
      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="Send" />
      </View>
    </View>
  );
};
const mapStateToProps = (store: { usersState: { users: any } }) => ({
  users: store.usersState.users,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ fetchUsersData }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
