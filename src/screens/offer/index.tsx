import React, {Component} from 'react';
import {
	View,
	ScrollView,
	Text,
	ListView,
	Image,
	TouchableOpacity,
	ListViewDataSource,
} from 'react-native';

import styles from './styles';
import {SectionHeader} from './sectionheader';
import {OfferAvatar} from './offeravatar';
import {AboutWine} from './aboutwine';
import {OfferDetail} from './offerdetail';
import {OfferV2Entity} from "../../api";
import {isEmpty} from "../../utility";

export class Offer extends React.Component<any, { dataSource: ListViewDataSource, offer: OfferV2Entity }> {
	constructor(props, context) {
		super(props, context);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2
		});

		this.state = {
			dataSource: ds.cloneWithRowsAndSections({}, [], []),
			offer: {},
		}
	}

	componentDidMount() {
		let offer = this.props.offer;
		const {dataBlob, sectionIds, rowIds} = this.formatData(offer);
		this.setState({
			dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
			offer: offer
		});
	}

	formatData(data) {
		const dataBlob = {};
		const sectionIds: Array<string> = [];
		const rowIds: Array<Array<string>> = [];

		for (let i = 0; i < 3; i++) {
			let sectionID = `${i}`;
			sectionIds.push(sectionID);
			rowIds[sectionID] = [];
			dataBlob[sectionID] = data;
			if (i === 0) {
				dataBlob[sectionID] = false;
			} else if (i === 1) {
				dataBlob[sectionID] = "About the Winery";
			} else {
				dataBlob[sectionID] = "About the Offer";
			}

			for (let j = 0; j < 1; j++) {
				const rowId = `${i}:${j}`;
				rowIds[sectionID].push(rowId);
				dataBlob[rowId] = data;
			}
		}

		return {dataBlob, sectionIds, rowIds};
	}

	render() {
		return (
			<View style={styles.container}>
				<ListView
					style={styles.listView}
					enableEmptySections
					dataSource={this.state.dataSource}
					renderRow={(rowData, sectionID) => {
						switch (parseInt(sectionID.toString())) {
							case 0:
								return <View>
									<OfferAvatar data={this.state.offer}/>
								</View>;
							case 1:
								return <View>
									<AboutWine data={this.state.offer}/>
								</View>;
							case 2:
								return <View>
									<OfferDetail data={this.state.offer}/>
								</View>;
							default:
								return <Text>Unknown sectionID</Text>;
						}
					}
					}
					renderSectionHeader={(sectionData) => sectionData && <SectionHeader data={sectionData}/> || null}
				/>
			</View>
		);
	}
}
