import {
	View, Animated, TouchableHighlight, Text, Button, TouchableOpacity, TextInput, ListView,
	ListViewDataSource, Alert
} from "react-native";
import * as React from "react";
import styles from '../styles';
import {NaviPageProps} from "../../../App";
import Image = Animated.Image;
import {CommonHeading} from "../../../components/heading";
import {ProfileCell} from "./profileitem";
import {ProfileSetting} from "./profilesetting";
import {SectionHeader} from "./sectionheader";
import * as Api from '../../../api';
import {UserModelExtended, SessionModel} from '../../../api';
import store from 'react-native-simple-store';
import {RouteMap} from "../../../routemap";

export class LoggedInAccount extends React.Component<NaviPageProps, { dataSource: ListViewDataSource, user: any }> {

	constructor(props, context) {
		super(props, context);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2
		});

		this.state = {
			dataSource: ds.cloneWithRowsAndSections({}, [], []),
			user: {},
		}
	}

	componentDidMount() {
		const app = this.props.app;

		// go back if no user
		if (!app.isLoggedIn()) {
			this.onBack();
		}

		app.getCurrentUser().then(user => {
			let api = new Api.SessionApi();
			api.sessionGetSessionUserDetail({'sessionId': user.sessionId || ''})
				.then((result: UserModelExtended) => {
					this.setState({user: result});
					const {dataBlob, sectionIds, rowIds} = this.formatData();
					this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds)});
				})
				.catch((error) => {
					alert(error);
				});
		});
	}


	onBack() {
		if (this.props.navigator) {
			this.props.navigator.pop();
		}
	}

	formatData() {
		const user = this.state.user;
		const dataBlob = {};
		const sectionIds: Array<string> = [];
		const rowIds: Array<Array<string>> = [];
		const rowSettingsData = [
			"Addresses",
			"Payment Methods",
			"Site Credit",
			"Sign Out",
		];

		for (let i = 0; i < 2; i++) {
			let sectionID = `${i}`;
			sectionIds.push(sectionID);
			rowIds[sectionID] = [];
			if (i === 0) {
				dataBlob[sectionID] = false;
			} else if (i === 1) {
				dataBlob[sectionID] = " ";
			}

			if (i === 0) {
				let j = 0;
				const rowId = `${i}:${j}`;
				rowIds[sectionID].push(rowId);
				dataBlob[rowId] = user;
			} else {
				for (let j = 0; j < rowSettingsData.length; j++) {
					const rowId = `${i}:${j}`;
					rowIds[sectionID].push(rowId);
					dataBlob[rowId] = rowSettingsData[j];
				}
			}
		}

		return {dataBlob, sectionIds, rowIds};
	}

	onPress(rowID) {
		if (rowID === '1:0') {
			this.addresses();
		} else if (rowID === '1:1') {
			this.payments();
		} else if (rowID === '1:2') {
			Alert.alert('Site Credit', 'Your available credit will automatically be applied ' +
				'to your next purchase(s) at checkout. Credits currently cannot be used toward ' +
				'shipping fees.');
		} else if (rowID === '1:3') {
			this.logout();
		}
	}

	addresses() {
		let route = RouteMap.AddressList;
		this.props.navigator.push(route);
	}

	payments() {
		let route = RouteMap.PaymentList;
		this.props.navigator.push(route);
	}

	logout() {
		store.save('profile_session', null)
			.then(() => store.get('profile_session'))
			.then((session) => this.props.app.setCurrentUser(session as SessionModel, () => this.onBack()));
	}

	renderRow(rowData, sectionID, rowID) {
		const user = this.state.user;
		switch (parseInt(sectionID.toString())) {
			case 0:
				return <View>
					<ProfileCell user={user}/>
				</View>;
			case 1:
				return <TouchableOpacity onPress={this.onPress.bind(this, rowID)}>
					<ProfileSetting
						data={rowID === '1:0' ? "Addresses" : rowID === '1:1' ? "Payment Methods" : rowID == '1:2' ? "Site Credit" : "Sign Out"}
						index={rowID} user={user}/>
				</TouchableOpacity>;
			default:
				return <Text>Unknown sectionID</Text>;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<CommonHeading
					title={"Account"}
					onBack={this.onBack.bind(this)}
					actionText="Edit"
					isPresent={true}/>
				<ListView
					style={{flex: 1, backgroundColor: 'rgba(37, 37, 37, 1.0)'}}
					enableEmptySections
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listviewSeparator}/>}
					renderSectionHeader={(sectionData) => sectionData && <SectionHeader data={sectionData}/> || null}
				/>
			</View>
		)
	}
}