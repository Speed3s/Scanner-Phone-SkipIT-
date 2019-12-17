import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class CardInput extends Component {
  constructor() {
    super();
    this.state = {
      number: '',
      mm: '',
      yy: '',
      cvc: '',
    };
  }

  handleNumberChange = newNumber => {
    this.setState({
      number: newNumber,
    });
  }

  handleMmChange = newMm => {
    this.setState({
      mm: newMm,
    });
  }

  handleYyChange = newYy => {
    this.setState({
      yy: newYy,
    });
  }

  handleCvcChange = newCvc => {
    this.setState({
      cvc: newCvc,
    });
  }

  handlePayPress = () => {
    const { onCardChanged } = this.props;
    
    const card = this.state;
    onCardChanged && onCardChanged(card);
  }

  render() {
    return (
      <View style={styles.outermost}>
        <Text>Enter your details:</Text>
        <View style={styles.container}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(0,0,0,.7)"
            placeholder=" Card number"
            style={[styles.input, styles.number]}
            onChangeText={this.handleNumberChange}
            keyboardType="numeric"
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(0,0,0,.7)"
            placeholder=" MM"
            style={[styles.input, styles.mm]}
            onChangeText={this.handleMmChange}
            keyboardType="numeric"
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(0,0,0,.7)"
            placeholder="  YY"
            style={[styles.input, styles.yy]}
            onChangeText={this.handleYyChange}
            keyboardType="numeric"
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor="rgba(0,0,0,.7)"
            placeholder=" CVC"
            style={[styles.input, styles.cvc]}          
            onChangeText={this.handleCvcChange}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.handlePayPress}>
          <Text style={styles.buttonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outermost: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  button: {
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
  },
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
  },
  input: {
    fontSize: 18,
    backgroundColor:'rgba(255, 255,255,0.2)',
      borderRadius: 25,
      color:'#ffffff'
  },
  number: {
    flex: 1,    
  },
  mm: {
    width: 40,
  },
  yy: {
    width: 40,    
  },
  cvc: {
    width: 60,    
  },
});
