import { Camera } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
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

  // State for result of sending image to backend
  const [photoSentURI, setPhotoSentURI] = useState(null);

  // Reference to the camera
  const cameraRef = useRef(null);


  if (!status?.granted) { // If status not granted, ask for it
    return (
      <View style={styles.View}>
        <Text style={styles.Text}>
          We need access to your camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (lastPhotoURI !== null) { // If a picture is taken, display the picture with a back button
    return (
      <ImageBackground style={styles.ImageBackground}
      source={{ uri: lastPhotoURI }}>
      <TouchableOpacity style={styles.TouchableOpacity}
        onPress={() => {
          setPhotoSentURI(lastPhotoURI);
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

  // View for taking a picture - display the preview, a switch camera button, and a shutter button
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
      </View>
    </Camera>
  );
}
