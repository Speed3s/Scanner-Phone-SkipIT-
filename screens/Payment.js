import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import CardInput from '../components/CardInput';
import StripeClient from '../StripeClient';


const testApiKey = 'sk_test_xAOYtNArT5xvr3stQkeGwiPa004iMCPgsY';

export default class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.stripe = new StripeClient(testApiKey);
  }


  // This gets the parameters from the navigation that is passed from a Checkout Screen

  total = this.props.navigation.getParam('total', 0);

  handlePayPressed = async card => {
    const token = await this.stripe.tokenizeCard({
      number: card.number,
      expMonth: card.mm,
      expYear: card.yy,
      cvc: card.cvc,
    });

    const cardTokenId = token.id;

    const customer = await this.stripe.createCustomer({
      email: 'test10@gmail.com',
      source: cardTokenId,
    });
    
    const charge = await this.stripe.chargeCustomer({
      customer: customer.id,
      amount: parseFloat(this.total * 100 ),
      currency: 'GBP',
    });
    

    // If Id exists and is true give back success message

    if (charge.id){
      Alert.alert(
        'Successful',
        'Thank You For Shopping',
        [{text: 'Done', onPress : () => this.props.navigation.navigate('ScanItem')}],
      );
    } else {
      Alert.alert('Please Enter Valid Details');
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text style={{textAlign: "center", fontWeight: 'bold', fontSize: 52, }}>TOTAL: {'£' + this.total}</Text>
        <Text></Text>
        <CardInput onCardChanged={this.handlePayPressed}/>
        <Text></Text>
        <Text></Text>
        
      </View>
    );
  }
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3684D8',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 25,
  },
});
