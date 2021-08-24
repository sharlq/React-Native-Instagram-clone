import React, { useState,useEffect } from "react";
import { View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/firebase-storage";

const save: React.FC<{ props: any }> = (props) => {
  const [caption, setCaption] = useState("");
  //@ts-ignore
  const [imageURI,setImageURI] = useState(props.route.params.image);
  //@ts-ignore
  const childPath =`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

useEffect(()=>{
    //@ts-ignore
    setImageURI(props.route.params.image.toString())

},[])

  const upLoadImage = async () => {
    //@ts-ignore
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const task = firebase
      .storage()
      .ref()
      .child(childPath)
      .put(blob);

      const taskProgress = (snapshot: { bytesTransferred: any; }) =>{
          console.log(`transfered: ${snapshot.bytesTransferred}`)
      }

      const taskCompleted = () =>{
          task.snapshot.ref.getDownloadURL().then((snapshot:any)=>{
            savePostDate(snapshot);
            console.log(snapshot)
          })
      }

      const taskError = (snapshot: any) =>{
          console.log(snapshot)
      }
      //@ts-ignore
      task.on("state_changed", taskProgress , taskError,taskCompleted)
  };
  const savePostDate =(downLoadURL: any)=>{
    firebase
    .firestore()
    .collection("posts")
    //@ts-ignore
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .add({
        downLoadURL,
        caption,
        creation:firebase.firestore.FieldValue.serverTimestamp()
    }).then((
        function(){
            //@ts-ignore
            props.navigation.popToTop()
        }
    )).catch((err)=>console.log(err))
  }
  return (
    <View style={{ flex: 1 }}>
        {        //@ts-ignore

imageURI &&
 //every thing wortks fine but htis stubid image is refusin to appear
      <Image
        //@ts-ignore
        source={{ uri: imageURI }}
      />}
      <TextInput
        placeholder="Write a Caprion . . ."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={() => upLoadImage()} />
      <Button title="FK off" onPress={() =>{
          setImageURI((prev:any)=>true)
          console.log(imageURI)}} />
    </View>
  );
};

export default save;
