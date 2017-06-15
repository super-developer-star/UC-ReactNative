import {Dimensions, StyleSheet, TextStyle, ViewStyle} from 'react-native'

export default StyleSheet.create({
	container : {
		flex : 1,
		flexDirection : 'row',
	} as ViewStyle,
	
	description : {
		marginLeft : 8,
		fontSize : 14,
		color : 'white',
		backgroundColor : 'transparent',
		marginTop : 3,
	} as ViewStyle,
});