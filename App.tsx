import { StatusBar } from 'expo-status-bar';
import React,{ Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from "./components/auth/Landing";
import RegisterScreen from './components/auth/Regiter'
import './firebaseConfig';
import firebase from 'firebase';

 
interface ComponentState{
  loaded: boolean,
  loggedIn?:boolean
}

 class App extends Component<any,ComponentState> {
  constructor(props: any){
    super(props)
    this.state={
      loaded:false
    }
  }

  componentWillMount() {
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
          <Stack.Screen name="Landing" component={LoadingScreen} options={{headerShown:false}}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
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
      <View style={{flex:1,justifyContent:'center'}}>
      <Text>User is loggedIn</Text>
    </View>
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
