import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../styles/Colors';

const Colors_default = Colors.Colors_default;
const Colors_bluish = Colors.Colors_bluish;
const Colors_greenish = Colors.Colors_greenish;
const Colors_reddish = Colors.Colors_reddish;

var InlineTimePicker = class extends Component {
	state = {
		hours: 12,
		minutes: 0,
		seconds: 0,
		meridian: "AM",
		updating: "",
	}
	constructor(props) {
		super(props);
		if (this.props.skinColor === "red") {
			this._colors = Colors_reddish;
		} else if (this.props.skinColor === "green") {
			this._colors = Colors_greenish;
		} else if (this.props.skinColor === "blue") {
			this._colors = Colors_bluish;
		} else {
			this._colors = {
				"timepicker_txt": this.props.textColor,
				"timepicker_back": this.props.textBackgroundColor,
				"timepicker_cont": this.props.containerBackgroundColor,	
				"timepicker_active": this.props.activeTextBackgroundColor,
				"timepicker_border": this.props.textBorderColor,
			};
		}
		this._txtColor = { "color": this._colors.timepicker_txt };
		this._interval = null;
		if (this.props.startTime !== undefined && 
			Array.isArray(this.props.startTime) && 
			this.props.startTime.length > 2) {
			this._hours(this.props.startTime[0]);
			this._minutes(this.props.startTime[1]);
			this._seconds(this.props.startTime[2]);
			this.state.meridian = this._meridian(this.props.startTime[3]);
		} 
	}
	_send = () => {
		if (!this.props.onChangeTime) return;
		var h = this.state.hours,
			m = this.state.minutes,
			s = this.state.seconds,
			mn = this.state.meridian;
		if (mn === "PM" && h !== 12) {
			h = h + 12;
		}
		this.props.onChangeTime(h, m, s);
	}
	_hours = (hours) => {
		if (typeof hours !== 'number') return;

		var hrs = hours;
		if (this.props.mode24hrs === true) {
			if (hours > 23) {
				hrs = 0;	
			} else if (hours < 0) {
				hrs = 23;	
			} 
			this.setState({hours: hrs});
		} else {				
			if (hours > 12) {
				hrs = 1;
			} else if (hours <= 0) {
				hrs = 12;					
			} 
			this.setState({hours: hrs, meridian: this._meridian(hrs)});
		}	
	}
	_meridian = (hours) => {
		var _mn = this.state.meridian;
		if (hours) {
			if (hours === 12) {
				return _mn === "AM" ? "PM" : "AM";
			}
			return _mn;
		}
		this.setState({meridian: _mn === "AM" ? "PM" : "AM"});
	}
	_minutes = (minutes) => {
		if (typeof minutes !== 'number') return;

		var min = minutes;	
		if (minutes > 59) {
			min = 0;
			this._hours(this.state.hours + 1);
		} else if (minutes < 0) {
			min = 59;				
			this._hours(this.state.hours - 1);
		} 
		this.setState({minutes: min});
	}
	_seconds = (seconds) => {
		if (typeof seconds !== 'number') return;	

		var sec = seconds;
		if (seconds > 59) {
			sec = 0;
			this._minutes(this.state.minutes + 1);
		} else if (seconds < 0) {
			sec = 59;				
			this._minutes(this.state.minutes - 1);
		} 
		this.setState({seconds: sec});
	}	
	_increment = (inc) => {
		const active = this.state.updating, val = this.state[active];
		
		if (typeof val === "number") this["_" + active](val + inc);
		else this["_" + active]();
	}
	_longIncrement = (inc) => {
		var active = this.state.updating, val = this.state[active];
		if (inc !== undefined) {
			this._interval = setInterval(() => {
				val = this.state[active];
				this["_" + active](val + inc);
			}, 500);
		} else {
			clearInterval(this._interval);
		}
	}
	_update = (item)=> {
		const active = this.state.updating;
 
		if (active === item) {
			this.setState({updating: ""});
			this["_" + item + "Text"]
				.setNativeProps({ style: {
							  	"backgroundColor": this._colors.timepicker_back,
								"borderWidth": 1,
							   } });
		} else {			
			if (active.length > 0) {			
				this["_" + active + "Text"]
					.setNativeProps({ style: {
									  	"backgroundColor": this._colors.timepicker_back,
										"borderWidth": 1,
									  } });
			}
			this["_" + item + "Text"]
				.setNativeProps({ style: {
								  	"backgroundColor": this._colors.timepicker_active,
									"borderWidth": 2,
								  } });
			this.setState({updating: item});
		}
	}
	_getContainerColor = () => {
		return {
    		"backgroundColor": this._colors.timepicker_cont,
		};
	}
	_getTextStyle = () => {
		return {
			"fontSize": this.props.fontSize,
			"borderRadius": this.props.borderRadius,
    		"color": this._colors.timepicker_txt,
			"backgroundColor": this._colors.timepicker_back,
			"borderColor": this._colors.timepicker_border
		};
	}
	
	componentDidUpdate(prevProps, prevState) {		
		 if (this.state !== prevState) this._send();
	}
	render() {	
		return (
			<View>
		    <View style = {[styles.container, this._getContainerColor()]}>
				<View style ={styles.timeContainer}>
					<TouchableOpacity onPress = {_ => this._update("hours")}>
						<Text style = {[styles.text, this._getTextStyle()]} 
							ref = {c => this._hoursText = c}>
							{this.state.hours < 10 ? "0" : ""}{this.state.hours}
						</Text>						
					</TouchableOpacity>
					<Text style = {[styles.colon, this._txtColor]}>{":"}</Text>
					<TouchableOpacity onPress = {_ => this._update("minutes")}>
						<Text style = {[styles.text, this._getTextStyle()]} 
							ref = {c => this._minutesText = c}>
							{this.state.minutes < 10 ? "0" : ""}{this.state.minutes}
						</Text>
					</TouchableOpacity>
					<Text style = {[styles.colon, this._txtColor]}>{":"}</Text>
					<TouchableOpacity onPress = {_ => this._update("seconds")}>
						<Text style = {[styles.text, this._getTextStyle()]} 
							ref = {c => this._secondsText = c}>
							{this.state.seconds < 10 ? "0" : ""}{this.state.seconds}
						</Text>
					</TouchableOpacity>
				</View>
				{ this.state.updating.length > 0 && 
					<View style = {styles.center}>
						<TouchableOpacity style = {[styles.text, this._getTextStyle(),  styles.increment]} 
							onPress= {_ => this._increment(1)}
							onLongPress= {_ => this._longIncrement(10)}
							onPressOut = {_ => this._longIncrement()}>
							<Ionicons name = {"md-add"} size = {this.props.iconSize} 
								color = {this._colors.timepicker_txt}/>
						</TouchableOpacity>
						<TouchableOpacity style = {[styles.text, this._getTextStyle(), styles.increment]} 
							onPress= {_ => this._increment(-1)}
							onLongPress= {_ => this._longIncrement(-10)}
							onPressOut = {_ => this._longIncrement()}>
							<Ionicons name = {"md-remove"} size = {this.props.iconSize} 
								color = {this._colors.timepicker_txt}/>
						</TouchableOpacity>
					</View>
				}
		    </View>
		    { this.state.updating.length === 0 && 
			    <View style = {{position:"absolute", top: 10, left: 10}}>
					{ this.props.mode24hrs !== true && 
						<TouchableOpacity style = {styles.meridian}
							onPress = {_ => this._meridian()}>
							<Text style = {[styles.meridian_text, this._txtColor]}>
								{this.state.meridian}
							</Text>
						</TouchableOpacity>
					}
				</View>
			}	
		    </View>
		);
	}		  
}

module.exports = InlineTimePicker;

const styles = StyleSheet.create({
  "container": {
    "margin": 5,
    "marginLeft": 7,
    "width":"auto",
    "height": 70, 
    "flexDirection": "row",
    "justifyContent": "space-around",
    "alignItems": "center",
    "alignContent": "center",
    "borderRadius": 4,
  },
  "timeContainer": {
    "flexDirection": "row",
    "margin": 5
  },
  "center": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "text": {
    "borderWidth": 1,
    "paddingHorizontal": 5,
    "textAlign": "center", 
    "justifyContent": "space-around",
    "alignItems": "center",
    "alignContent": "center",
	"borderWidth": 1,
  },
  "increment": {
    "marginRight": 5,
    "padding": 7,
  },
  "colon": {
  	"fontSize": 35,
	"marginHorizontal": 3,
  },
  "meridian": {
    "position": "absolute", 
    "top": 0, 
    "left": 5
  },
  "meridian_text": {
    "fontSize": 16,
  },
});

InlineTimePicker.defaultProps = {		
	"fontSize": 35,
	"textColor": "#ccc",
	"textBorderColor": "#555",
	"borderRadius": 4,	
	"textBackgroundColor": "#777",
	"iconSize": 35,	
	"activeTextBackgroundColor": "#000",
	"containerBackgroundColor": "#555"
};