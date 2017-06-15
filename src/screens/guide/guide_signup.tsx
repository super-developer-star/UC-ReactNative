import * as React from 'react';
import {
	View,
	Image,
	Text,
	TextInput,
	TouchableOpacity, Alert,
} from 'react-native';

import styles from './styles';
import {GlobalStyles} from '../../constants';
import {UserApi} from "../../api";
import {FacebookLogin} from "../../components/facebook/loginbutton";
import {App} from "../../App";
import {AccountState} from "../account/account_index";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export class GuideSignUp extends React.Component<{gsApp: App}, AccountState> {

	constructor(props: any, context: any) {
		super(props);
		this.state = {
			mode: "email",
			emailTxt: '',
			passwordTxt: '',
			isLoading: false,
			firstName: '',
			lastName: '',
			conditions: ''
		}
	}

	onChangeEmail(val: any) {
		if (val !== null) {
			this.setState({emailTxt: val, mode: "email"});
		}
	}

	handleForgot() {
		this.setState({isLoading: true}, () => {
			let api = new UserApi();
			api.userResetPassword({
				input: {
					email: this.state.emailTxt
				}
			}).then(result => {
				this.setState({isLoading: false});
				Alert.alert('Reset Password', 'Check your email for a link to reset your password.');
			}, error => {
				this.setState({isLoading: false});
				Alert.alert('Error', 'Check the email and try again.');
			});
		});
	}

	handleSubmitEmail() {
		this.props.gsApp.getCurrentUser().then(currentUser => {
			switch (this.state.mode) {
				case "email":
					this.setState({isLoading: true}, () => {
						const api = new UserApi();
						api.userSignIn3({
							model: {
								email: this.state.emailTxt,
								password: '',
								sessionId: currentUser.sessionId
							}
						}).then(result => {
							if (result.message && result.message.indexOf("doesn't") === -1) {
								this.setState({mode: "signin", isLoading: false});
							}
							else {
								this.setState({mode: "signup", isLoading: false});
							}
						});
					});
					break;
				case "signin":
					this.setState({isLoading: true}, () => {
						const api = new UserApi();
						api.userSignIn3({
							model: {
								email: this.state.emailTxt,
								password: this.state.passwordTxt,
								is21: true,
								sessionId: currentUser.sessionId
							}
						}).then(result => {
							if (result.success && result.value && result.value.session) {
								this.props.gsApp.setCurrentUser(result.value.session, () => this.props.gsApp.goHome());
							}
							else {
								Alert.alert('Sign in error', result.message);
								this.setState({isLoading: false});
							}
						});
					});
					break;
				case "signup":
					this.setState({isLoading: true}, () => {
						const api = new UserApi();
						api.userSignup3({
							model: {
								email: this.state.emailTxt,
								password: this.state.passwordTxt,
								firstName: this.state.firstName,
								lastName: this.state.lastName,
								is21: true,
								sessionId: currentUser.sessionId
							}
						}).then(result => {
							if (result.success && result.value && result.value.session) {
								this.props.gsApp.setCurrentUser(result.value.session, () => this.props.gsApp.goHome());
							}
							else {
								Alert.alert('Sign up error', result.message);
								this.setState({isLoading: false});
							}
						});
					});
					break;
				default:
					Alert.alert('Invalid mode', this.state.mode);
					this.setState({mode: "email"});
					break;
			}
		});
	}

	handleFacebook() {
		//todo: go to home screen
	}

	renderEmailField() {
		return <View>
			<View style={styles.separator}/>
			<TextInput
				style={styles.textInput}
				onChangeText={this.onChangeEmail.bind(this)}
				placeholder={"Email"}
				value={this.state.emailTxt}
				autoCorrect={false}
				autoCapitalize="none"
				editable={!this.state.isLoading}
				returnKeyType={'done'}
				placeholderTextColor='white'
				selectionColor="gray"/>
		</View>;
	}

	maybeRenderPassword() {
		return <View>
			<View style={styles.separator}/>
			<TextInput
				style={styles.textInput}
				onChangeText={(text) => this.setState({passwordTxt: text})}
				placeholder={"Password"}
				value={this.state.passwordTxt}
				autoCorrect={false}
				autoCapitalize="none"
				editable={!this.state.isLoading}
				returnKeyType={'done'}
				placeholderTextColor='white'
				secureTextEntry={true}
				selectionColor="gray"
			/>
		</View>;
	}

	renderNameFields() {
		return <View>
			<View style={styles.separator}/>
			<TextInput
				style={styles.textInput}
				onChangeText={t => this.setState({firstName: t})}
				placeholder={"First name"}
				value={this.state.firstName}
				autoCorrect={false}
				autoCapitalize="none"
				editable={!this.state.isLoading}
				returnKeyType={'next'}
				placeholderTextColor='white'
				selectionColor="gray"/>
			<View style={styles.separator}/>
			<TextInput
				style={styles.textInput}
				onChangeText={t => this.setState({lastName: t})}
				placeholder={"Last name"}
				value={this.state.lastName}
				autoCorrect={false}
				autoCapitalize="none"
				editable={!this.state.isLoading}
				returnKeyType={'next'}
				placeholderTextColor='white'
				selectionColor="gray"/>
		</View>;
	}

	render() {
		const {mode} = this.state;
		return (
			<KeyboardAwareScrollView style={styles.container}>
				<Text style={styles.largeLabel}>
					GET STARTED
				</Text>
				<View style={styles.descriptionContainer}>
					<Text style={styles.headerLabel}>
						Enter your email address to begin it's free!
					</Text>
				</View>
				{this.renderEmailField()}
				{(mode === "signup" || mode === "signin") && this.maybeRenderPassword()}
				{(mode === "signup") && this.renderNameFields()}
				<View style={styles.separator}/>

				{this.state.mode == "signin" && <View style={{paddingTop: 16}}>
					<TouchableOpacity onPress={this.handleForgot.bind(this)} disabled={this.state.isLoading}>
						<Text style={styles.headerLabel}>Forgot password?</Text>
					</TouchableOpacity>
				</View>}

				<TouchableOpacity
					disabled={this.state.isLoading}
					style={GlobalStyles.redButton}
					onPress={() => this.handleSubmitEmail()}>
					<Text style={styles.normalLabel}>
						{this.state.isLoading ? 'Please wait' : 'Continue'}
					</Text>
				</TouchableOpacity>
				{
					!this.state.isLoading && <View>
						<View style={styles.orContainer}>
							<Text style={styles.normalLabel}>
								OR
							</Text>
						</View>
						<FacebookLogin app={this.props.gsApp} onSuccess={() => this.handleFacebook()}/>
					</View>
				}
			</KeyboardAwareScrollView>
		);
	}
}