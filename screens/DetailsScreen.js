import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Card } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class DetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: firebase.auth().currentUser.email,
            itemName: this.props.navigation.getParam('details')["itemName"],
            Quantity: this.props.navigation.getParam('details')["Quantity"],
            Cost: this.props.navigation.getParam('details')["Cost"]
        }
    }

    createUniqueId() {
        return Math.random().toString(16).slice(2);
    }

    addItemsToCart = (itemName) => {
        var userId = this.state.userId;
        var orderId = this.createUniqueId();
        console.log('im called', orderId);
        db.collection('allOrders').add({
            "emailId": userId,
            "itemName": itemName,
            "Quantity": this.state.Quantity,
            "Cost": this.state.Cost,
            "orderId": orderId,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
        });
        return alert('Item Has Been Added To Cart ', '', [
            {
                text: 'OK',
                onPress: () => {
                    this.props.navigation.navigate('Home');
                },
            },
        ]);
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.1 }}>
                    <MyHeader title="Details" navigation={this.props.navigation} />
                </View>
                <View style={{ flex: 0.5 }}>
                    <Card title={"Item Info"} titleStyle={{ fontSize: 20 }}>
                        <Card >
                            <Text style={{ fontWeight: 'bold' }}>{this.state.itemName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: '300' }}>Quantity : {this.state.Quantity}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: '300' }}>Price : {this.state.Cost}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.addItemsToCart(this.state.itemName)
                        }}>
                        <Text style={{ color: '#ffff' }}>Add To Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'blue',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    },
    cancelButton: {
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
})