import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import db from '../config';

export default class CustomSideBarMenu extends Component {
    state = {
        userId: firebase.auth().currentUser.email,
        image: '#',
        name: '',
        docId: '',
    };

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!cancelled) {
            this.uploadImage(uri, this.state.userId);
        }
    };

    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();

        var ref = firebase
            .storage()
            .ref()
            .child('userProfiles/' + imageName);

        return ref.put(blob).then((response) => {
            this.fetchImage(imageName);
        });
    };

    fetchImage = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child('userProfiles/' + imageName);

        storageRef
            .getDownloadURL()
            .then((url) => {
                this.setState({ image: url });
            })
            .catch((error) => {
                this.setState({ image: '#' });
            });
    };

    getUserProfile() {
        db.collection('users')
            .where('emailId', '==', this.state.userId)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.setState({
                        name: doc.data().firstName + ' ' + doc.data().lastName,
                        docId: doc.id,
                        image: doc.data().image,
                    });
                });
            });
    }

    componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 0.3,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'lightblue',
                    }}>
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.image,
                        }}
                        size={'xlarge'}
                        onPress={() => this.selectPicture()}
                        showEditButton
                    />

                    <Text
                        style={{
                            fontWeight: '300',
                            fontSize: 23,
                            padding: 10,
                        }}>
                        {this.state.name}
                    </Text>
                </View>
                <View style={{ flex: 0.6 }}>
                    <DrawerItems {...this.props} />
                </View>
                <View style={{ flex: 0.1, borderTopWidth: 1 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            height: '100%',
                            paddingTop: 20
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('WelcomeScreen');
                            firebase.auth().signOut();
                        }}>
                        <Icon
                            name="log-out"
                            type="feather"
                            size={20}
                            iconStyle={{ paddingLeft: 10 }}
                        />

                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                marginLeft: 30,
                            }}>
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}