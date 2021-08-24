import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
const Profile: React.FC<{ currentUser: any; posts: any }> = ({
  currentUser,
  posts,
}) => {
  console.log(posts[0] );

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
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
