import React, { Component } from 'react'
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimePickerStyles from '../styles/TimePickerStyles.json';

export default class InlineTimePicker extends Component {
	state = {
		hours: 12,
		minutes: 0,
		seconds: 0,
		meridian: "AM",
		updating: "",
	}
	constructor(props) {
		super(props);
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
		const h = this.state.hours,
			  m = this.state.minutes,
			  s = this.state.seconds,
			  mn = this.state.meridian;
		this.props.onChangeTime(h, m, s, mn);
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
	_getTimeStyles = () => {
		return  {
			fontSize: this.props.fontSize,
			borderRadius: this.props.textBorderRadius,
			color: this.props.textColor,
			backgroundColor: this.props.textBackgroundColor,
			borderColor: this.props.textBorderColor
		};
	}
	_getColonStyles = () => {
		return  {					
			fontSize: this.props.fontSize,
			color: this.props.colonsTextColor,
			marginHorizontal: this.props.colonsMargin,
		};
	}
	_getActiveColors = (active) => {
		var res = {style: {}};
		if (active) {
			res.style = {
				backgroundColor: this.props.activeTextBackgroundColor,
				borderColor: this.props.activeTextBorderColor,
				borderWidth: this.props.activeTextBorderWidth,
			}
		} else {
			res.style = {
				backgroundColor: this.props.textBackgroundColor
			}
		}
		return res;
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
			this["_" + item + "Text"].setNativeProps(this._getActiveColors());
		} else {			
			if (active.length > 0) {			
				this["_" + active + "Text"].setNativeProps(this._getActiveColors());
			}
			this["_" + item + "Text"].setNativeProps(this._getActiveColors(true));
			this.setState({updating: item});
		}
	}
	componentDidUpdate(prevProps, prevState) {		
		 if (this.state !== prevState) this._send();
	}
	render() {	
		return (
		    <View style = {[ styles.container, 
		    	             {backgroundColor: this.props.containerBackgroundColor}]}>
				<View style ={styles.timeContainer}>
					<TouchableOpacity onPress = {_ => this._update("hours")}>
						<Text style = {[styles.text, this._getTimeStyles()]} 
							ref = {c => this._hoursText = c}>
							{this.state.hours < 10 ? "0" : ""}{this.state.hours}
						</Text>						
					</TouchableOpacity>
					<Text style = {this._getColonStyles()}>{":"}</Text>
					<TouchableOpacity onPress = {_ => this._update("minutes")}>
						<Text style = {[styles.text, this._getTimeStyles()]} 
							ref = {c => this._minutesText = c}>
							{this.state.minutes < 10 ? "0" : ""}{this.state.minutes}
						</Text>
					</TouchableOpacity>
					<Text style = {this._getColonStyles()}>{":"}</Text>
					<TouchableOpacity onPress = {_ => this._update("seconds")}>
						<Text style = {[styles.text, this._getTimeStyles()]} 
							ref = {c => this._secondsText = c}>
							{this.state.seconds < 10 ? "0" : ""}{this.state.seconds}
						</Text>
					</TouchableOpacity>
					<View style = {{width: 40}}>
						{ this.props.mode24hrs !== true && 
							<TouchableOpacity style = {styles.meridian}
								onPress = {_ => this._meridian()}>
								<Text style = {{ fontSize: 16,
									             color: this.props.meridianTextColor}}>
									{this.state.meridian}
								</Text>
							</TouchableOpacity>
						}
					</View>				
				</View>
				{ this.state.updating.length > 0 && 
					<View style = {styles.center}>
						<TouchableOpacity style = {[styles.increment, this._getTimeStyles()]} 
							onPress= {_ => this._increment(1)}
							onLongPress= {_ => this._longIncrement(10)}
							onPressOut = {_ => this._longIncrement()}>
							<Ionicons name = {"md-add"} size = {this.props.iconSize} 
								color = {this.props.iconColor}/>
						</TouchableOpacity>
						<TouchableOpacity style = {[styles.increment, this._getTimeStyles()]} 
							onPress= {_ => this._increment(-1)}
							onLongPress= {_ => this._longIncrement(-10)}
							onPressOut = {_ => this._longIncrement()}>
							<Ionicons name = {"md-remove"} size = {this.props.iconSize} 
								color = {this.props.iconColor}/>
						</TouchableOpacity>
					</View>
				}
		    </View>
		);
	}		  
}

const styles = StyleSheet.create(TimePickerStyles);

InlineTimePicker.defaultProps = {		
	"fontSize": 40,
	"textColor": "#ccc",
	"textBorderColor": "#555",
	"textBorderRadius": 4,	
	"textBackgroundColor": "#555",	
	"colonsMargin": 3,
	"colonsTextColor": "#ccc",
	"iconSize": 40,
	"iconColor": "#ccc",		
	"iconBackgroundColor": "#555",
	"activeTextBorderWidth": 2,
	"activeTextBorderColor": "#555",	
	"activeTextBackgroundColor": "#000",
	"meridianTextColor": "#ccc",	
	"containerBackgroundColor": "#222",
};
