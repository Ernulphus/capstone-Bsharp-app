import { Camera } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Background,
  Platform,
  StyleSheet
} from "react-native";

import styles from './Styles.js'

export default function App() {
  // Camera permissions array stored in status
  const [status, requestPermission] = Camera.useCameraPermissions();

  // State for the type of camera
  const [type, setType] = useState(Camera.Constants.Type.back);

  // State for the location of the last photo
  const [lastPhotoURI, setLastPhotoURI] = useState(null);

  // State for storing the photo to be sent to backend
  const [photoSentURL, setPhotoSentURL] = useState(null);

  // Reference to the camera
  const cameraRef = useRef(null);

  const serveraddress = 'http://146.95.72.151:3000/'

  // If camera access not granted, ask for it
  if (!status?.granted) {
    return (
      <View style={styles.View}>
        <Text style={styles.Text}>
          We need access to your camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Image sender function
  const sendImage = async () => {
    // // Save image as a blob
    // let reader = new FileReader();
    // const response = await fetch(lastPhotoURI.replace("file:///","file://"))
    // .catch(error => console.error(error))
    //
    // const imgblob = await response.blob();

    // Send data URL of image to backend with fetch
    const res = await fetch(serveraddress, {
      method: 'POST',
      // body: JSON.stringify(imgblob)
      body: JSON.stringify({
        text: "This is in JSON"
      })
    })
  }

  // If a picture is taken or selected, display the picture with a back button
  if (lastPhotoURI !== null) {
    return (
      <ImageBackground style={styles.ImageBackground}
      source={{ uri: lastPhotoURI }}>
      <TouchableOpacity style={styles.TouchableOpacity}
        onPress={() => {
          sendImage();
        }}
      >
        <Text style={styles.button}>⬆️</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.TouchableOpacity}
        onPress={() => {
            setLastPhotoURI(null); // Clear the photo
          }}
        >
          <Text style={styles.button}>❌</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  // Image picker function
  // Need to change aspect ratio
  const pickImage = async () => {
    // No permissions request is necessary for launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9,16],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setLastPhotoURI(result.uri);
    }
  }


  // View for taking a picture - display the preview, a switch camera button, a pick image button, and a shutter button
  return (
    <Camera style={styles.Camera} type={type} ref={cameraRef}>
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >

        <TouchableOpacity style={styles.TouchableOpacity}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.button}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.TouchableOpacity}
          onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync();
              setLastPhotoURI(photo.uri);
            }
          }}
        >
          <Text style={styles.button}>⚪️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.TouchableOpacity}
          onPress={pickImage}
        >
          <Text style={styles.button}>📔</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );
}
