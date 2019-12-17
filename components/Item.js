import React, {Component} from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import NumericInput from 'react-native-numeric-input';
import firebase from 'firebase';

export default class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            barcode: this.props.item.barcode,
            userID: firebase.auth().currentUser.uid,
        }
    }

    /*

    retreiveQuantity()

    The functions is reponsible for getting the quantity amount from the database.

    */

    retreiveQuantity = () => {
            
        let ref = firebase.database().ref('users/' + this.state.userID + '/basket/' + this.props.item.barcode).orderByChild('quantity');
                                    
        ref.on('value', snapshot => {
           if (snapshot.exists()) {
               let quantity = snapshot.val();
               this.setState({quantity : quantity.quantity});
            }
        });
            
    }

    /*

    updateQuantity()

    The functions is reponsible for updating the quantity for the item.

    */

    updateQuantity = (value, barcode, userID) => {


        firebase.database().ref('users/' + userID + '/basket/' + barcode).update({quantity: value});  

        // Read data from firebase and show the quantity for that item

        this.retreiveQuantity();

    }

    /*

    removeItem()

    The functions is reponsible for removing items in the checkout.

    */

 
    removeItem = (barcode, userID) => {

        // Pass barcode from the item that is being removed
        firebase.database().ref('users/' + userID + '/basket/' + barcode + '/barcode').remove();
        firebase.database().ref('users/' + this.state.userID + '/basket/' + barcode + '/quantity').remove();

    }

    /*

    calculateSum()

    The functions is reponsible for calculating the individual sum for that item.

    */

    calculateSum = () => {
        let sum = 0;
        let price = this.props.item.price;
        let quantity = this.state.quantity;

        sum = parseFloat(price) * parseInt(quantity);

        return parseFloat(sum).toFixed(2);
    }

    /*

    componentWillMount()

    The function is reponsible for calling the functions before the render method.

    */

    componentWillMount() {
        this.retreiveQuantity();
    }

    render() {

        return (

            
            <View style={{borderBottomWidth: 5, borderLeftColor: 'black', marginLeft: 5}}>
                <Image
                style={{width: 400, height: 250}}
                source={{uri: this.props.item.image}}
                />
                <Text></Text>
                <Text></Text>
                <Text>Item Name: {this.props.item.title}</Text>
                <Text>Description: {this.props.item.description}</Text>
                <Text>Price £{this.props.item.price}</Text>
                <Text></Text>
                <Text>Quantity: </Text>
                <Text></Text>
                <NumericInput  
                type='up-down'
                minValue={1}
                maxValue={this.props.item.allowedAmount}
                value={this.state.quantity} 
                onChange={value => this.updateQuantity(value, this.props.item.barcode, this.state.userID)}
                totalWidth={70} 
                totalHeight={50} 
                iconSize={25}
                initValue={this.state.quantity}
                valueType='Integer' 
                textColor='#B0228C' 
                iconStyle={{ color: 'black' }} 
                rightButtonBackgroundColor='#EA3788' 
                leftButtonBackgroundColor='#E56B70'/>

                <Text style={{fontSize:20, textAlign: 'center'}}>Amount: £{this.calculateSum()}</Text>


                <TouchableOpacity style={styles.buttonRM} onPress={() => this.removeItem(this.props.item.barcode, this.state.userID)}>
                    <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
            </View>
    
        );
    }
}

// Styles

const styles = StyleSheet.create({
    
    buttonRM: {
      width:300,
      backgroundColor:'red',
      borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13,
      alignSelf:'center'
    }, 
    buttonText: {
        fontSize:16,
        fontWeight:'500',
        color:'#ffffff',
        textAlign:'center'
      }
});