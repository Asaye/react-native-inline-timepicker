# react-native-inline-timepicker

[![npm version](https://badge.fury.io/js/react-native-inline-timepicker.svg)](https://badge.fury.io/js/react-native-inline-timepicker)
[![npm downloads](https://img.shields.io/npm/dt/react-native-inline-timepicker.svg)](https://badge.fury.io/js/react-native-inline-timepicker)

This is a react-native timepicker for android apps which will be rendered inline with other components. It may be used along with this [inline datepicker](https://www.npmjs.com/package/react-native-inline-datepicker). 

# Getting Started

### Installation
$ npm install react-native-inline-timepicker --save

# Usage

### Import

```import InlineTimePicker from 'react-native-inline-timepicker';```

### Example

```
import InlineTimePicker from 'react-native-inline-timepicker';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class TimePickerDemo extends Component {
  state = {
    hours: 12,
    minutes: 0,
    seconds: 0,
    meridian: "AM"
  };
  setTime = (h, m, s, mn) => {
    this.setState({hours: h, minutes: m, seconds: s, meridian: mn});
  }
  render() {
    return (
            <View>
              <InlineTimePicker onChangeTime = {this.setTime}/>
              <Text>The selected time is:</Text>
              <Text>
                {this.state.hours}:{this.state.minutes}:{this.state.seconds}{" "}{this.state.meridian}
              </Text>    
            </View>
    );
  }
}
```
# Props 

Prop | Default | Type | Description
------------ | ------------- | ------------- | -------------
onChangeTime | null | func | Callback function taking four arguments (hours, minutes, seconds, meridian) to take the user selected hours, minutes, seconds and meridian (AM or PM) respectively.
startTime | null | Array | An array containing three numbers and a string to set the current time of the timepicker. The first element is the hours, the second element is the minutes, the third is seconds and the string represents the meridian. 
mode24hrs | undefined | boolean | If true, it changes the time mode from meridian based to 24hrs based.
skinColor | null | enum("red", "green", "blue") | Predefined skin colors for the time picker which provides style alternatives without defining the color properties described below. See <a href = "#skinColor">below</a> for effects.
fontSize | 35 | number | The font size of all the texts in the timepicker except the meridian.
textColor | #ccc | string | Text color.
textBorderColor | #555 | string | Border color of the background color of the texts.
borderRadius | 4 | number | The border radius of the background of the texts.
textBackgroundColor | "#555" | string | The background color of the texts.
iconSize | 40 | number | The size of the increment icons (+ and -).
activeTextBackgroundColor | #000 | string | Background color active texts.
containerBackgroundColor | #222 | string | Background color the main container.

<div id = "skinColor"/>

### skinColor prop

The optional skinColor property can have values of "red", "green" or "blue" with the following effects.

##### Default

![Screenshot](screenshot_default.png?raw=true)

##### skinColor = 'red'

![Screenshot](screenshot_red.png?raw=true)

##### skinColor = 'green'

![Screenshot](screenshot_green.png?raw=true)

##### skinColor = 'blue'

![Screenshot](screenshot_blue.png?raw=true)

## Issues or suggestions?
If you have any issues or want to suggest something , your can write it [here](https://github.com/Asaye/react-native-inline-timepicker/issues).
