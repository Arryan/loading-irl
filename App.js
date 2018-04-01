import React, { Component } from "react";
import {
  Dimensions,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text
} from "react-native";
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const digits = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F"
];
const GIPHY_KEY = "EkawbjfrC8sewRP3dvtQzaNRUMXIYBta";

export default class App extends Component {
  state = {
    loadingColor: "red",
    textColor: "blue",
    q: "",
    imageID: ""
  };

  componentDidMount = () => {
    this._interval = setInterval(() => {
      this.setState({
        loadingColor: this.generateColor(),
        textColor: this.generateColor()
      });
    }, 1000);
  };

  generateColor = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) color += digits[Math.floor(Math.random() * 16)];
    return color;
  };

  _handleTextChange = inputValue => this.setState({ q: inputValue });

  onPress = () => {
    this.getImageId().then(id => this.setState({ imageID: id }));
  };

  getImageId = async () => {
    return fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=EkawbjfrC8sewRP3dvtQzaNRUMXIYBta&q=${
        this.state.q
      }&limit=1&offset=0&rating=G&lang=en`,
      {
        method: "GET",
        headers: new Headers().append(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        mode: "cors",
        cache: "default"
      }
    )
      .then(res => res.text())
      .then(txt => JSON.parse(txt).data[0].id);
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: this.state.loadingColor
        }}
        behavior="padding"
      >
        <LoadingImage imageID={this.state.q ? this.state.imageID : ""} />
        <TextInput
          placeholder={"What are you waiting for?"}
          inputValue={this.state.q}
          onChangeText={this._handleTextChange}
          style={{
            width: WIDTH,
            height: 44,
            padding: 8,
            textAlign: "center",
            fontSize: 18,
            marginTop: 100,
            flex: 0
          }}
          underlineColorAndroid="transparent"
          placeholderTextColor={this.state.color}
        />
        <TouchableOpacity onPress={this.onPress}>
          <Text>Ok</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

class LoadingImage extends Component {
  state = {
    degrees: 0
  };

  componentDidMount = () => {
    this._interval = setInterval(() => {
      this.setState({
        degrees: this.state.degrees + 1
      });
    }, 10);
  };

  render() {
    return (
      <Image
        source={
          this.props.imageID
            ? {
                uri: `https://media.giphy.com/media/${
                  this.props.imageID
                }/giphy.gif`
              }
            : require("./loading.png")
        }
        style={{
          height: 200,
          width: 200,
          transform: [{ rotate: this.state.degrees + "deg" }]
        }}
      />
    );
  }
}
