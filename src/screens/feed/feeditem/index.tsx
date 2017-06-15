import React, {Component, PropTypes} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';

import styles from './styles';

export class FeedItem extends React.Component<{ data: any }, {}> {

    constructor(props, context) {
        super(props, context);
    }

    getTitle()	{
        let title = this.props.data.name + " bought " + this.props.data.quantity + " bottles";
        return title;
    }

    render() {
        let {data} = this.props.data;
        return <View style={styles.container}>
                <Text style = {styles.description}>
                    {this.getTitle()}
                </Text>
        </View>;
    }
}
