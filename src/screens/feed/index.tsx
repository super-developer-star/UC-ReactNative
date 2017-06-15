import React, {Component} from 'react';
import {
	View,
	ScrollView,
	Text,
	ListView,
	Image,
	TouchableOpacity, ViewStyle,
	ListViewDataSource,
} from 'react-native';

import styles from './styles';
import {FeedItem} from './feeditem';

export class Feed extends React.Component<{ style: ViewStyle, feeds: any },  {dataSource: ListViewDataSource}> {

	constructor (props)	{
		super(props);
		const ds = new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2 });
		this.state = {
			dataSource : ds.cloneWithRows([]),
		}
	}

	componentDidMount()	{
		let feeds = this.props.feeds;
		this.setState({dataSource : this.state.dataSource.cloneWithRows(feeds)});
	}

	render()	{
		return (
				<View style = {styles.container}>
					<ListView
						showsVerticalScrollIndicator = {false}
						enableEmptySections
						dataSource = {this.state.dataSource}
						renderRow = {(rowData) => 
							<TouchableOpacity >
								<FeedItem
								  data = {{ ...rowData }}
								/> 
							</TouchableOpacity>
						}
					/>
				</View>
			);
	}
}
