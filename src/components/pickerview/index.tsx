'use strict';
import * as React from 'react';
import {Component} from "react";
import {
	TouchableOpacity,
	Text,
	View,
	ListView,
	ListViewDataSource,
	Navigator, Alert
} from 'react-native';
import styles from './styles';
import {CommonHeading} from "../heading";
import {App} from "../../App";

export interface IPickerValueSelected {
	(selectedItem: string, selectedIndex: string | number);
}

export interface PickerProps {
	data: Array<string>;
	onValueSelected: IPickerValueSelected;
	app: App
}

export interface PickerState {
	dataSource: ListViewDataSource;
}

export class PickerView extends Component<PickerProps, PickerState> {

	constructor(props, context) {
		super(props, context);
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			dataSource: ds.cloneWithRows([]),
		}
	}

	componentDidMount() {
		let dataList = this.props.data;
		this.setState({dataSource: this.state.dataSource.cloneWithRows(dataList)});
	}

	selectData(val: string, index: string | number) {
		if (typeof this.props.onValueSelected === 'function') {
			this.props.onValueSelected(val, index);
			this.props.app.goBack();
		}
		else {
			Alert.alert('Error', 'Please contact support for help with pickerview.');
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<CommonHeading
					title="Pick Item"
					onBack={() => this.props.app.goBack()}
				/>
				<ListView
					style={styles.listView}
					showsVerticalScrollIndicator={false}
					enableEmptySections
					dataSource={this.state.dataSource}
					renderRow={(rowData, sectionID: string | number, rowID: string | number) =>
						<TouchableOpacity style={{flex: 1}} onPress={() => this.selectData(rowData.toString(), rowID)}>
							<Text style={styles.description}>
								{rowData}
							</Text>
						</TouchableOpacity>
					}
				/>
			</View>
		);
	}
}
