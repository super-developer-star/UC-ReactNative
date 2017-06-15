import {
	View, Animated, TouchableHighlight, Text, Button, TouchableOpacity, TextInput, ListView,
	TextInputState, findNodeHandle,
	ListViewDataSource,
} from "react-native";
import * as React from "react";
import {Component} from "react";
import styles from './styles';
import {NaviPageProps} from "../../../App";
import Image = Animated.Image;
import {AddressApi, AddressModelResponse, NhAddressModel} from "../../../api";
import {isEmpty} from "../../../utility";
import {CommonHeading} from "../../../components/heading";
import {AddressDetailState, AddressForm} from "../address_form";
import {SectionHeader} from './sectionheader'
export interface AddressChangeFunction {
	(selectedAddress: AddressModelResponse);
}

export interface AddressDetailProps extends NaviPageProps {
	selectedAddress: NhAddressModel | null;
	onAddressChange?: AddressChangeFunction;
}

export class AddressDetailPage extends Component<AddressDetailProps, AddressDetailState> {
	constructor(props: AddressDetailProps, context: any) {

		super(props, context);

		this.state = new AddressDetailState();

		if (this.props.selectedAddress != null) {
			this.state.loadFromNhAddressModel(this.props.selectedAddress);
		}
	}

	componentDidMount() {
		const app = this.props.app;

		// go back if no user
		if (!app.isLoggedIn()) {
			this.onBack();
		}

		const {dataBlob, sectionIds, rowIds} = this.loadDataSource();
		this.setState({
			dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
		});
	}

	loadDataSource() {
		let data = "";
		const dataBlob = {};
		const sectionIds: Array<string> = [];
		const rowIds: Array<Array<string>> = [];

		let i = 0;
		let sectionID = `${i}`;
		sectionIds.push(sectionID);
		rowIds[sectionID] = [];
		dataBlob[sectionID] = "SHIPPING ADDRESS";

		for (let j = 0; j < 1; j++) {
			const rowId = `${i}:${j}`;
			rowIds[sectionID].push(rowId);
			dataBlob[rowId] = data;
		}

		return {dataBlob, sectionIds, rowIds};
	}

	onBack() {
		if (this.props.navigator) {
			this.props.navigator.pop();
		}
	}

	onSave() {
		// get error and show error if not empty
		const err = this.state.getValidationError();
		if (!isEmpty(err)) {
			alert(err);
			return; // cancel because there was an error
		}

		//TODO: Show Loading Spinner
		const api = new AddressApi();
		const sId = this.props.app.getCurrentUserId();
		const isNew = this.props.selectedAddress == null;
		if (isEmpty(sId)) {
			alert('Not logged in');
			return;
		}
		else if (isNew) {
			api.addressSessionPostAddress({
				sessionId: sId,
				address: this.state.getNhModel()
			}).then((resp: AddressModelResponse) => {
				if (this.props.onAddressChange) {
					this.props.onAddressChange(resp);
				}
				this.onBack();
			}, err => {
				alert(JSON.stringify(err));
			});
		}
		else if (!isNew && this.props.selectedAddress) {
			api.addressSessionPutAddress({
				sessionId: sId,
				addressId: this.props.selectedAddress.id || '',
				address: this.state.getNhModel()
			}).then((resp: AddressModelResponse) => {
				if (this.props.onAddressChange) {
					this.props.onAddressChange(resp);
				}
				this.onBack();
			}, err => {
				alert(JSON.stringify(err));
			});
		}
	}

	onMakeDefault() {
		alert("Not yet implemented");
	}

	saveData(e: any) {
		this.setState(e);
	}

	renderRow(rowData, sectionID) {
		switch (parseInt(sectionID.toString())) {
			case 0:
				return <View>
					<AddressForm
						app={this.props.app}
						initialState={this.state}
						onChange={e => this.saveData(e as any)}/>
				</View>;
			default:
				return <View />;
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<CommonHeading
					title="Address"
					onBack={this.onBack.bind(this)}
					actionText="Save"
					onAction={this.onSave.bind(this)}
				/>
				<ListView
					style={styles.listView}
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