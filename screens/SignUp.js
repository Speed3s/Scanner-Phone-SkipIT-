import React from 'react'
import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase';



export default class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = ({
      email:'',
      password: '',
    });

  }
  
  /*

  signUpUser()

  The functions is reponsible handling user registration

  */


  signUpUser = (email, password) => {

    try {

      if(this.state.password.length < 6) {
        alert("Please enter at least 6 characters");
        return;
      } 

      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });


    } catch(error) {
      console.log(error.toString());
    }

  }

  render() {

    return(

      <View style={styles.container}> 
      
        <View style={{flexGrow: 1, justifyContent:'flex-end', alignItems: 'center'}}  >
          <Image  style={{width:150, height: 150}}
                  source={require('../assets/images/Logo.png')}/>
                <Text style={styles.logoText}>Sign-up</Text>	
        </View>

        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'center'}}>
			
          <TextInput style={styles.inputBox} 
            underlineColorAndroid='rgba(0,0,0,0)' 
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="E-mail"
            placeholderTextColor = "#ffffff"
            selectionColor="#fff"
            keyboardType="email-address"
            onChangeText={(email) => this.setState({email})}
            />
            
          <TextInput style={styles.inputBox} 
            underlineColorAndroid='rgba(0,0,0,0)' 
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor = "#ffffff"
            autoCorrect={false} 
            autoCapitalize="none"
            onChangeText={(password) => this.setState({password})}
            />
            
          <TouchableOpacity style={styles.button} onPress={() => this.signUpUser(this.state.email, this.state.password)}>
          <Text style={styles.buttonText}>Sign-up</Text>
          </TouchableOpacity> 

  		  </View>

        <View style={styles.signupTextCont}>
					    <Text style={styles.signupText}>Have an account?</Text>
					    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={{color:'#ffffff'}}> Login</Text></TouchableOpacity>
				</View>     
        
      </View>



    )
  }
}

// Styles


const styles = StyleSheet.create({
    container : {
      flex: 1,
      backgroundColor: '#3684D8',
      alignItems: 'center',
      justifyContent: 'center'
    },
    signupTextCont : {
      flexGrow: 1,
      alignItems:'flex-end',
      justifyContent :'center',
      paddingVertical:16,
      flexDirection:'row'
    },
    signupText: {
      color:'rgba(255,255,255,0.6)',
      fontSize:16
    },
    signupButton: {
      color:'#96abff',
      fontSize:16,
      fontWeight:'500'
    },
    logoText : {
      marginVertical: 15,
      fontSize:18,
      color:'rgba(255, 255, 255, 0.7)'
    },
    inputBox: {
      width:300,
      backgroundColor:'rgba(255, 255,255,0.2)',
      borderRadius: 25,
      paddingHorizontal:16,
      paddingVertical: 10,
      fontSize:16,
      color:'#ffffff',
      marginVertical: 10
    },
    button: {
      width:300,
      backgroundColor:'#1c313a',
       borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
    },
    buttonText: {
      fontSize:16,
      fontWeight:'500',
      color:'#ffffff',
      textAlign:'center'
    }
});
