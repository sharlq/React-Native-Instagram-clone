import { StatusBar } from 'expo-status-bar';
import React,{ Component } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import {createStackNavigator} from '@react-navigation/stack';

import LoadingScreen from "./components/auth/Landing";
import RegisterScreen from './components/auth/Regiter';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/main';
import AddScreen from './components/main/add';
import SaveScreen from './components/main/save'

import './firebaseConfig';
import firebase from 'firebase';

import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './redux/reducers/index';
import thunk from 'redux-thunk'
 
interface ComponentState{
  loaded: boolean,
  loggedIn?:boolean
}

const store = createStore(rootReducer,applyMiddleware(thunk))

 class App extends Component<any,ComponentState> {
  constructor(props: any){
    super(props)
    this.state={
      loaded:false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true,
        })
      }else{
        this.setState({
          loggedIn:true,
          loaded:true
        })
      }
    })
 
  }

  render() {
    const Stack = createStackNavigator();
    const {loggedIn,loaded} = this.state;
    if(!loggedIn){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LoadingScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    );}
    if(!loaded){
      return(
        <View style={{flex:1,justifyContent:'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{headerShown:false}}/>
          
          <Stack.Screen name="Add" component={AddScreen}
          //@ts-ignore
          navigation={this.props.navigation} />
          <Stack.Screen name="Save" component={SaveScreen}
          //@ts-ignore
          navigation={this.props.navigation} />
        </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
