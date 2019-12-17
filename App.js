import Login from './screens/Login';
import ScanItem from './screens/ScanItem';
import SignUp from './screens/SignUp';
import CheckOut from './screens/Checkout';
import Payment from './screens/Payment';


import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';


// Screens Routes

const AppStack = createStackNavigator({ScanItem: ScanItem, Checkout: CheckOut, Payment : Payment });

// Authentication Screens Routes

const AuthStack = createStackNavigator({ Login: Login, SignUp: SignUp });

export default createAppContainer(createSwitchNavigator(
  {
    App: AppStack, 
    Auth: AuthStack,
  },
  {
    initialRouteName: 'App',
  }
));