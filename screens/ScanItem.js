import React from 'react';
import { Component } from 'react';
import { Dimensions, Modal ,Text, View, StyleSheet, Image , TouchableOpacity } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import firebase from 'firebase';
console.disableYellowBox = true;

export default class ScanItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      modalVisible: false,
      item: {
        barcode: '0000000000',
        description: '',
        image: 'https://firebasestorage.googleapis.com/v0/b/skipit-9298d.appspot.com/o/shopping.png?alt=media&token=fe74c987-bea7-47f4-8c5f-7dcb370e465b',
        price: '0.00',
        title: 'Item not found',
      },
      currentUser: null
    }
  };

  componentDidMount() {
    // Request Camera Permission

    this._requestCameraPermission();

    // Set current user logged in
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    // Check if user is logged in and go to ScanItem otherwise go to Login.
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? 'ScanItem' : 'Login')
    })
  }

  // Request Camera Permission Function

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  // setItemState function

  _setItemState = (obj) => {
    this.setState({
      item: obj
    })
  }

  /*

  _handleBarCodeRead() 

  This function will get the barcode number and will display the 
  item from the database if it exists.

  */

  _handleBarCodeRead = (inputData) => {

    let usersRef = firebase.database().ref('items');
    let setItemState = this._setItemState;
    let setModVis = this.setModalVisible;
      usersRef.orderByChild('barcode').equalTo(inputData['data']).on("value", function(snapshot) {
        let obj;
        // if data exists
        if (snapshot.exists()) {
          let item = snapshot.val();
          obj = item[Object.keys(item)[0]];
          setItemState(obj);
          setModVis(true);
        } else {
          alert('Item not found by the barcode ');

          setModVis(false);
        }        
  
      });

  };

  /*

  logOutUser()

  This function handles the logging out of the user. 

  */

  logOutUser = () => {

    
    firebase.auth().signOut()
    .then(function() {
      // Sign-out successful.
      alert('Signed Out');
    })
    .catch(function(error) {
      // An error happened
    });
  }

  /*

  _addToBasket()

  This function will add item to the basket.

  */

  _addToBasket = () => {

    // if userID does not exist, create new one
    // if user ID already exists do not create one.

    firebase.auth().onAuthStateChanged(user => {
      // console.log(user.uid);
      let userID = user.uid;

      let barcode = this.state.item.barcode;

      // Empty Default item ( Fixing issue removing other items )
      firebase.database().ref('users/' + userID + '/basket/"000000000000"').set({
        barcode: "000000000000",
      });


      // This will add item barcode to the basket which is later matched with the items and
      // displayed in the checkout.

      firebase.database().ref('users/' + userID + '/basket/' + barcode).set({
        barcode: barcode,
      }).then(() => {
      }).catch((error) => {
        console.log(error.toString())
      });
  
    })

    this.setModalVisible(false);

  }


  // This set the state of the pop-up for the item when scanned.

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  render() {

    // Current User 

    const { currentUser } = this.state;


    let width = Dimensions.get('window').width; //full width
    let height = Dimensions.get('window').height; //full height

    return (

      <View>

        <View>
            {this.state.hasCameraPermission === null ?
              <Text>Requesting for camera permission</Text> :
              this.state.hasCameraPermission === false ?
                <Text>Camera permission is not granted</Text> :
                <BarCodeScanner
                  onBarCodeRead={this._handleBarCodeRead}
                  style={{ height: 200, width: width }}
                />
            }
        </View>



      <Modal
        animationType="fade"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
        }}>

        <View style={{marginLeft: 5}}>
          <Image
            style={{width: 400, height: 250}}
            source={{uri: this.state.item.image}}
          />
          <Text> </Text>
          <Text> </Text>
          <Text>Item name: {this.state.item.title}</Text>
          <Text>Description: {this.state.item.description}</Text>          
          <Text>Price: £{this.state.item.price}</Text>          

          <View>

            <TouchableOpacity style={styles.buttonADD} onPress={() => this._addToBasket()}>
              <Text style={styles.buttonText}>Add To Basket</Text>
            </TouchableOpacity> 

            <TouchableOpacity style={styles.buttonRM} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity> 

          </View>
        </View>
      </Modal>


      <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Checkout')}>
          <Text style={styles.buttonText}>Check-out</Text>
      </TouchableOpacity> 

      <TouchableOpacity style={styles.buttonLO} onPress={() => this.logOutUser()}>
          <Text style={styles.buttonText}>LogOut</Text>
      </TouchableOpacity> 


    </View>

    );
  }
}

// Styles

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3684D8',
  },
  tbar: {
    width: 375,
    height: 100,
    borderBottomWidth: 5,
    borderColor: 'black',
    backgroundColor: 'red'
  },
  main: {
    flex: 1
  },
  item: {
    height: 200,
    width: 375,
    marginTop: 10,
    backgroundColor: 'green'
  },
  bbar: {
    width: 375,
    height: 100,
    borderTopWidth: 5,
    borderColor: 'black',
    backgroundColor: 'red'
  },
  text: {
    color: '#ffffff',
    fontSize: 40
  },
  button: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    alignSelf:'center'
    
  },
  buttonLO: {
    width:300,
    backgroundColor:'red',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    alignSelf:'center'
    
  },
  buttonRM: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    position: 'absolute',
    bottom:-175,
    left:55
  },
  buttonADD: {
    width:300,
    backgroundColor:'#1c313a',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    position: 'absolute',
    bottom:-100,
    left:55
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff',
    textAlign:'center'
  }
});