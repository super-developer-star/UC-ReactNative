import * as React from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import styles from './styles';
import ViewPager from 'react-native-viewpager';
import {RouteMap} from '../../routemap';
import {GuideSignUp} from './guide_signup';
import {App} from "../../App";
const MyStatusBar = ({backgroundColor, ...props}) => (
	<View style={[styles.statusBar, {backgroundColor}]}>
		<StatusBar backgroundColor={backgroundColor} {...props} />
	</View>
);

export class Guide extends React.Component<{guideApp: App}, { dataSource: ViewPager.DataSource }> {

	constructor(props: any, context: any) {
		super(props);
		const dataSource = new ViewPager.DataSource({
			pageHasChanged: (p1, p2) => p1 !== p2,
		});
		let data = [
			(
				<View style={styles.guide_container}>
					<Image
						source={require('../../../img/guide1.png')}
						style={styles.guide_image}/>
					<Text style={styles.guide_title}>
						DISCOVER
					</Text>
					<Text style={styles.guide_detail}>
						{'Discover amazing wines from some of the \n world`s best wineries. \n\n Our wine experts ' +
						'select high-quality, premium,\n & limited-edition wines. \n\n Engage with our community ' +
						'of wine lovers and \n learn the secrets of your favorite wines.'}
					</Text>
				</View>
			),
			(
				<View style={styles.guide_container}>
					<Image
						source={require('../../../img/guide2.png')}
						style={styles.guide_image}/>
					<Text style={styles.guide_title}>
						BUY
					</Text>
					<Text style={styles.guide_detail}>
						{'Every bottle you buy could be upgraded for free \n to a high-priced bottle. \n\n Random ' +
						'upgrades include large-format, rare-\n vintage, and autographed bottle. \n\n Over half of ' +
						'your bottles can be randomly \n upgraded-find out at checkout!'}
					</Text>
				</View>
			),
			(
				<View style={styles.guide_container}>
					<Image
						source={require('../../../img/guide3.png')}
						style={styles.guide_image}/>
					<Text style={styles.guide_title}>
						COLLECT
					</Text>
					<Text style={styles.guide_detail}>
						{'Collect & store your bottles for free in your \n \"CloudCellar\", and ship them anytime. ' +
						'\n\n We take care of maintaining ideal temperature, \n humidity, and keeping your bottles ' +
						'safe. \n\n Never worry about shipping fees: free shipping \n on 12+ bottles, and just $5 ' +
						'to ship 6 bottles.'}
					</Text>
				</View>
			)
		];

		if (!props.guideApp.isLoggedIn()) {
			data.push(<View style={styles.guide_container}>
				<GuideSignUp gsApp={this.props.guideApp} />
			</View>);
		}

		this.state = {
			dataSource: dataSource.cloneWithPages(data)
		}
	}

	showHome() {
		if (this.props.guideApp) {
			this.props.guideApp.goHome();
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<MyStatusBar backgroundColor="#5E8D48" barStyle="light-content"/>
				<Image style={styles.background} source={require('../../../img/gradient.jpg')}/>
				<ViewPager
					style={styles.viewPager}
					dataSource={this.state.dataSource}
					renderPage={this._renderPage.bind(this)}
					isLoop={false}
					autoPlay={false}/>
				{ this.props.guideApp.isLoggedIn() && <TouchableOpacity style={styles.btnCloseContainer} onPress={this.showHome.bind(this)}>
					<Image style={styles.btnImg} source={require('../../../img/close.png')}/>
				</TouchableOpacity> }
			</View>
		);
	}

	_renderPage(data: any, pageID: any) {
		return data;
	}
}
