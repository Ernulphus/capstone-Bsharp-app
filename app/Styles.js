import {StyleSheet} from "react-native";

export default StyleSheet.create({

  View: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },
  Text: {
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


});