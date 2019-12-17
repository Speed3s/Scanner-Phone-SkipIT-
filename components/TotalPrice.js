import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from 'firebase';

export default class TotalPrice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      quantityTotal : [],
      userID : firebase.auth().currentUser.uid
    }
  }

  /* 

  retreiveQuantity()

  This function will get the quantity from the database for the item and will calculate the total price.

  */
  
  retreiveQuantity = () => {
    let itemsRef = firebase.database().ref('items');
    let quantityTotal = [];
    let total = 0;

    // Access the basket

    firebase.database().ref('users/' + this.state.userID + '/basket').on('value', function(snapshot) {
      let i = 0;

      snapshot.forEach(function(childSnapshot) {
        console.log('Iteration: ' + i);
        childData = childSnapshot.val();
        let obj = childData[Object.keys(childData)[0]];

        // Check if barcode matches

        itemsRef.orderByChild('barcode').equalTo(obj).on("value", function(snapshot) {
          
          // If data exists
          
          if (snapshot.exists()) {
            let total = 0;
            let item = snapshot.val();
            let obj = item[Object.keys(item)];
            
            // Calculate total for that item with quantity

            total = parseFloat(obj.price) * parseInt(childData.quantity)
            quantityTotal.push(parseFloat(total).toFixed(2));
          }
        });  
        i++;  
      });
  });

  quantityTotal.forEach(arg => {
      total += parseFloat(arg);
  });

  this.setState({total : parseFloat(total).toFixed(2)});
}

componentWillMount() {
  this.retreiveQuantity();
}
  
  render() {

    return (
        <View>
          <Text></Text>
          <Text></Text>
          <Text style={{fontSize:26, textAlign: 'center'}}>Total price: £{this.state.total}</Text>

          <TouchableOpacity style={styles.buttonRM} onPress={() => this.props.navigation.navigate('Payment', {total : this.state.total})}>
              <Text style={styles.buttonText}>PAY</Text>
          </TouchableOpacity>

        </View>
    )
  }
}

// Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRM: {
    width:300,
    backgroundColor:'#1c313a',
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