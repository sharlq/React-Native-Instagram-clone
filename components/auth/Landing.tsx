import React from 'react'
import {Text,View,Button} from 'react-native' 

const Landing:React.FC<{navigation?:any}> = ({navigation}) => {
    return (
        <View style={{flex:1,justifyContent: 'center' }}>
            <Button
            title="Register"
            onPress={()=>navigation.navigate("RegisterScreen")}/>
        </View>

)
}

export default Landing
