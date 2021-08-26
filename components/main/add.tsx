import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Button,Image,Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

 const App:React.FC<{navigation:any}> =({navigation})=> {
  const [hasCameraPermission, setHasCameraPermission] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<any>(false);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted') 
    })();
  }, []);

  const takePicture =async ()=>{
    if(camera){
        const data = await camera.takePictureAsync(null)
        console.log(data.uri)
        setImage(()=>data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission===false ) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission===false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={ styles.container} >
    <View style={styles.cameraContainer}>
      <Camera
      ref = {ref =>{ setCamera(ref)}}
       style={styles.fixedRatio}
       type={type}
       ratio={'1:1'}
       />
      </View>
      <Button
      title="Flip Image"
      onPress={()=>{
          setType(
              type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
              )
      }}
      >
      </Button>
      <Button
        title="Take Picture"
        onPress={()=>{takePicture()}}
      >
      </Button>
      <Button
        title="Pick Image from Gallery"
        onPress={()=>{pickImage()}}
      >
      </Button>
      <Button
        title="Save Image"
        onPress={()=>{
           if(image){
             return navigation.navigate('Save',{image})
            }}}
      >
      </Button>
      {image && <Image
            source={{uri:image}} style={{flex:1}}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        
    },
    cameraContainer: {
        flex:1,
        flexDirection:'row'
    },
    fixedRatio:{
        flex:1,
        aspectRatio:1
    },
    camera:{
        height:500,

    },
    text:{
        color:"green",
    }
 }); 

 export default App