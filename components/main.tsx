import React, { Component } from 'react'
import { View,Text } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {connect} from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { fetchUser } from '../redux/actions';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import FeedScreen from './main/feed';
import ProfileScreen from './main/Profile';

const Tab = createMaterialBottomTabNavigator();
const Empty = ()=>{
    return(null)
}
export class Main extends Component<any,any> {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const user = this.props.currentUser;
        console.log(this.props.currentUser)
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
            <Tab.Screen name="Feed" component={FeedScreen}
                options={{
                    tabBarIcon:(({color})=>
                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                    )
                }}
                />
                <Tab.Screen name="MainAdd" component={Empty}
                listeners={({navigation})=>({
                    tabPress:event=>{
                        event.preventDefault();
                        navigation.navigate("Add")
                    }
                })

                }
                options={{
                    tabBarIcon:(({color})=>
                        <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                    )
                }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon:(({color})=>
                        <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                    )
                }}
                />
                
            {/* <Tab.Screen name="Settings" component={} /> */}
          </Tab.Navigator>
        )
    }
}
const mapStateToProps = (store: { userState: { currentUser: any; }; })=>({currentUser:store.userState.currentUser})
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => bindActionCreators({fetchUser},dispatch)
    

export default connect(mapStateToProps,mapDispatchToProps)(Main)
