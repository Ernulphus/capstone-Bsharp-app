import { Camera } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  Platform
} from "react-native";

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


  const [imagePadding, setImagePadding] = useState(0);
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  if (!status?.granted) { // If status not granted, ask for it
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <Text style={{ textAlign: "center" }}>
          We need access to your camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (lastPhotoURI !== null) { // If a picture is taken, display the picture with a back button
    return (
      <ImageBackground
        source={{ uri: lastPhotoURI }}
        style={{
          flex: 1,
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
      <TouchableOpacity
        style={{
          flex: 0.2,
          alignSelf: "flex-end",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#666",
          marginBottom: 40,
          marginLeft: 20,
        }}
        onPress={() => {
          setPhotoSentURI(lastPhotoURI);
        }}
      >
        <Text style={{ fontSize: 30, padding: 10, color: "white" }}>⬆️</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 0.2,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#666",
            marginBottom: 40,
            marginLeft: 20,
          }}
          onPress={() => {
            setLastPhotoURI(null); // Clear the photo
          }}
        >
          <Text style={{ fontSize: 30, padding: 10, color: "white" }}>❌</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  // Time to make the aspect ratio work! #######################
  // Figure out the aspect ratio (and orientation) of the screen:



  // the camera must be loaded in order to
  // access the supported ratios
  const setCameraReady = async() => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const ratios = await camera.getSupportedRatiosAsync();

  // ###################################

  // View for taking a picture - display the preview, a switch camera button, and a shutter button
  return (
    <Camera style={{ flex: 1 }} type={type} ref={cameraRef} onCameraReady={setCameraReady}>
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.2,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#666",
            marginBottom: 40,
            marginLeft: 20,
          }}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={{ fontSize: 30, padding: 10, color: "white" }}>🔄</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 0.2,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#666",
            marginBottom: 40,
            marginLeft: 20,
          }}
          onPress={async () => {
            if (cameraRef.current) {
              let photo = await cameraRef.current.takePictureAsync();
              setLastPhotoURI(photo.uri);
            }
          }}
        >
          <Text style={{ fontSize: 30, padding: 10, color: "white" }}>⚪️</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );
}
