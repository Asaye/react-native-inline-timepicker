# react-native-inline-timepicker
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

## Issues or suggestions?
If you have any issues or want to suggest something , your can write it [here](https://github.com/Asaye/react-native-inline-timepicker/issues).
