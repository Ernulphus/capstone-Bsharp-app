import {StyleSheet} from "react-native";

export default StyleSheet.create({

  View: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },
  Text: {
    flex: 0.1,
    textAlign: "center"
  },
  ImageBackground: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center"
  },
  TouchableOpacity: {
    flex: 0.2,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#666",
    marginBottom: 40,
    marginLeft: 20,
  },
  button: {
    fontSize: 30,
    padding: 10,
    color: "white"
  },
  Camera: {
    flex: 1
  },
  Image: {
    flex: 0.5,
    width: 50,
    height: 200,
    resizeMode: "stretch"
  }

});