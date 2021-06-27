import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Text,
    ScrollView
} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class CartScreen extends Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            isCartItems: '',
            items: [],
            itemName:'',
            itemQuantity:'',
            itemCost:''
        }
        this.cartRef = null
    }

    getAllCartItems = () => {
        this.cartRef = db.collection("cartItems")
            .onSnapshot((snapshot) => {
                var items = snapshot.docs.map(document => document.data());
                this.setState({
                    items: items
                });
            })
    }

    getItemDetails=()=>{
        db.collection('users').where('emailId', '==', this.state.userId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        itemName: doc.data().itemName,
                        itemQuantity: doc.data().Quantity,
                        itemCost: doc.data().Cost,
                    })
                })
            });
    }

    createUniqueId() {
        return Math.random().toString(16).slice(2);
    }

    orderedtems = () => {
        var userId = this.state.userId;
        var orderId = this.createUniqueId();
        console.log('im called', orderId);
        db.collection('allOrders').add({
            "emailId": userId,
            "itemName": this.state.itemName,
            "Quantity": this.state.itemQuantity,
            "Cost": this.state.itemCost,
            "orderId": orderId,
        });
        return alert('Your Order Has Been Placed Successfully', '', [
            {
                text: 'OK',
                onPress: () => {
                    this.props.navigation.navigate('Home');
                },
            },
        ]);
    };
    
    componentDidMount() {
        this.getAllCartItems()
        this.getItemDetails()
    }

    componentWillUnmount() {
        this.cartRef;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader navigation={this.props.navigation} title="Cart" />
                <ScrollView style={{ width: '100%' }}>
                    <FlatList
                        data={this.state.items}
                        renderItem={({ item }) => (
                            <View style={{ flex: 0.5 }}>
                                <Card>
                                    <Card>
                                        <Text style={{ fontWeight: 'bold' }}>{item.itemName}</Text>
                                    </Card>
                                    <Card>
                                        <Text style={{ fontWeight: '300' }}>Quantity : {item.Quantity}</Text>
                                    </Card>
                                    <Card>
                                        <Text style={{ fontWeight: '300' }}>Price : {item.Cost}</Text>
                                    </Card>
                                </Card>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}
                            onPress={() => {
                                this.orderedtems()
                            }}>
                            <Text style={{ color: '#fff' }}>Proceed To Buy</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        marginTop: 50,
        marginBottom: 50,
        backgroundColor: 'blue',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    },
})