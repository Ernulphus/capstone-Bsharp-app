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

import axios from 'axios';

import styles from './Styles.js'

export default function App() {
  /* State variables */

  // Camera permissions array stored in status
  const [status, requestPermission] = Camera.useCameraPermissions();

  // State for the type of camera
  const [type, setType] = useState(Camera.Constants.Type.back);

  // State for the location of the last photo
  const [lastPhotoURI, setLastPhotoURI] = useState(null);

  // State for storing the photo to be sent to backend
  const [photoSentURI, setPhotoSentURI] = useState(null);

  // State for storing instrument guess
  const [imageGuess, setImageGuess] = useState(null);

  // Reference to the camera
  const cameraRef = useRef(null);

  // State for getting past home page
  const [takePicture, setTakePicture] = useState(false);
  // setTakePicture(true); will update takePicture to true and reload

  const serveraddress = 'http://161.35.48.44:3000/'
  const server = axios.create({ baseURL: serveraddress });

  /* Helper Functions */

  // Image sender function
  const sendImage = async () => {
    // Lock out user spam
    if (photoSentURI == lastPhotoURI)
      return;

    setPhotoSentURI(lastPhotoURI);

    // Create form data to send to server; append the user's submission
    const formData = new FormData();
    formData.append('submission', {
      name: new Date() + '_submission',
      uri: lastPhotoURI,
      type: 'image/jpg',
    });

    // Send to server (async)
    try {
      const res = await server.post('/', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
      });

      if (res.data.success) {
        let guess = res.headers.map.guess;
        setImageGuess(guess);
        console.log(guess);
      }
    } catch (error) {
      console.log(error.message);
    }

    // //Save image as a blob and stringify it
    // const response = await fetch(lastPhotoURI);
    // const imgblob = await response.blob();
    // let img = JSON.stringify(imgblob);
    //
    // // Send blob of image to backend with fetch
    // const res = await fetch(serveraddress, {
    //   method: 'POST',
    //   body: img
    // })


  }

  // Image picker function
  // Need to change aspect ratio
  const pickImage = async () => {
    // No permissions request is necessary for launching image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16,16],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setLastPhotoURI(result.uri);
    }
  }

  /* Views */

  // Title screen
  // if (!takePicture) {
  //   return (
  //     <View style={styles.View}>
  //     </View>
  //     // JSX for title page goes here
  //     // Needs a "get started" button which sets takePicture to true
  //   );
  // }

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

  // If an image guess is received, display it
  if (imageGuess !== null) {
    return (
      <View style={styles.View}>
        <Text style={styles.Text}>
          B♯'s cutting-edge futuristic AI has this to say about your image:
        </Text>
        <Text style={styles.Text}>
          "{imageGuess}"
        </Text>
        <Button style={styles.Button}
        onPress={() => {
            setLastPhotoURI(null);  // Clear taken photo
            setPhotoSentURI(null);  // Clear sent photo
            setImageGuess(null);    // Clear guess
          }}
        title="❌"/>
      </View>
    )
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
