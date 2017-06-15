import {FBSDK, LoginManager, LoginButton, LoginResult, AccessToken, GraphRequest, GraphRequestManager} from "react-native-fbsdk";
import * as React from 'react';
import {
	View,
	Navigator,
	Image,
	Text,
	TouchableOpacity,
	RefreshControl,
	StatusBar, Alert,
} from 'react-native';
import {isEmpty} from "../../utility";
import styles from "./styles";
import {GlobalStyles, Colors, Fonts} from "../../constants";
import {SessionModel, UserApi, ApiResultUserAuthResultModel} from "../../api";
import {App} from "../../App";

export interface IFacebookUser {
	email: string,
	first_name: string,
	last_name: string,
	id: string,
	name: string;
}

export class FacebookLogin extends React.Component<{onSuccess: (result: ApiResultUserAuthResultModel) => void, app: App}, {}> {

	doFacebookLogin() {
		LoginManager.logInWithReadPermissions(['public_profile']).then(
			(result) => this.onLoginFinished('', result),
			(error) => this.onLoginFinished(error, null)
		);
	}

	handleFacebookUser(token: string, fbUser: IFacebookUser) {
		this.props.app.getCurrentUser().then(session => {
			const userApi = new UserApi();
			userApi.userSignIn3({
				model: {
					email: fbUser.email,
					firstName: fbUser.first_name,
					lastName: fbUser.last_name,
					sessionId: session.sessionId,
					facebookUserId: parseInt(fbUser.id),
					facebookAccessToken: token,
					is21: true
				}
			}).then(loginResult => {
				if (loginResult.value) {
					this.props.app.setCurrentUser(loginResult.value.session as SessionModel, () =>
						this.props.onSuccess(loginResult));
				}
				else {
					this.props.onSuccess(loginResult);
				}
			}, error => Alert.alert('Facebook Login Failed', typeof error === 'string' ? error : JSON.stringify(error)));
		});
	}

	onLoginFinished(error: string, result: LoginResult) {
		if (error && !isEmpty(error)) {
			alert(error);
		}
		else if (result.isCancelled) {
			alert("Login was cancelled");
		} else {
			//alert("Login was successful with permissions: " + result.grantedPermissions);

			AccessToken.getCurrentAccessToken().then(
				(data) => {
					let accessToken = data.accessToken;
					//alert(accessToken.toString());

					//todo: save access token??

					const infoRequest = new GraphRequest(
						'/me',
						{
							accessToken: accessToken,
							parameters: {
								fields: {
									string: 'email,name,first_name,middle_name,last_name'
								}
							}
						},
						(error, result) => {
							if (error) {
								alert('Error fetching data: ' + error.toString());
							} else {
								this.handleFacebookUser(accessToken, result);
							}
						}
					);

					// Start the graph request.
					new GraphRequestManager().addRequest(infoRequest).start();
				});
		}
	}

	render() {
		const useLoginButton = false;
		return <View style={GlobalStyles.blueButton}>

			{!useLoginButton ? <TouchableOpacity onPress={() => this.doFacebookLogin()}>
				<Text style={{color: Colors.white, fontFamily: Fonts.body}}>Sign in with Facebook</Text>
			</TouchableOpacity>:
				<LoginButton
					style={styles.facebookBtn}
					text='eeded'
					publishPermissions={["publish_actions"]}
					onLoginFinished={(error, result) => this.onLoginFinished(error, result)}
					onLogoutFinished={() => alert("User logged out")}
				/>}
		</View>;
	}
}
