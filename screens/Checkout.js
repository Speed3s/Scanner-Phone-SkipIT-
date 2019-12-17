import React, { Component } from 'react';
import {View, Text, StyleSheet, ScrollView  } from 'react-native';
import firebase from 'firebase';
import Item from '../components/Item';
import TotalPrice from '../components/TotalPrice';


export default class Checkout extends Component {
  
  constructor(props) {
    super(props); 

    this.state = {
      items:[],
      userID: firebase.auth().currentUser.uid
    }
  }


  // Navigation options for example 'title' : 'Checkout'

  static navigationOptions = {
    title: 'Checkout',
  }
  
  // Function to setState 

  _setItemState = (obj) => {
    this.setState({
      items: obj,
    })
  }

  /*
  
  renderResults() 
  
  The function matches the barcode from the user basket 
  to the items stored on the database and if it exists
  it will add the item to the basket.
  
  */ 

  renderResults() {

    let setItemState = this._setItemState;

    firebase.database().ref('users/' + this.state.userID + '/basket').on('value', function(snapshot) {

        let items = [];
        let usersRef = firebase.database().ref('items');

        snapshot.forEach(function(childSnapshot) {
          let childData = childSnapshot.val();
        
          // Barcode 

          let obj = childData[Object.keys(childData)[0]];
          
          // Match barcode from user basket to items on database

          usersRef.orderByChild('barcode').equalTo(obj).on("value", function(snapshot) {

            // If data exists
            if (snapshot.exists()) {
              let item = snapshot.val();
              obj = item[Object.keys(item)];

              // Insert item barcodes to array if they match

              items.push(obj);
            }

            // This will set the array to the state array

            setItemState(items);
          });  
        });
    });
  
  }

  // Run function before render

  componentWillMount() {
    this.renderResults();
  }

  render() {

    if (this.state.items.length === 0) {
      return(
      <View style={styles.loading}>
        <Text>Checkout is empty</Text>
      </View>      
      );
    } 

    return (

      <ScrollView>

        {/* Loop through items array passing the properties such as price, title, barcode */}

          {this.state.items.map((item) =>

            <Item item={item}/>

          )}

          <TotalPrice navigation={this.props.navigation} items={this.state.items}/>

      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
