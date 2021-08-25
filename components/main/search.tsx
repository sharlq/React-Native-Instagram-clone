import React,{useState} from "react";
import { View, Text, TextInput, FlatList,TouchableOpacity } from "react-native";
import firebase from "firebase";
import 'firebase/firestore'
import { Props } from "react";

const Search:React.FC<{navigation:any}> = ({navigation}) => {
    const [users,setUsers] = useState<any>();
    const fetchUsers = (search:string) =>{
        firebase.firestore()
        .collection("users")
        .where('name','>=',search)
        .get()
        .then((snapshot)=>{
            let dbUsers = snapshot.docs.map(doc=>{
                const data = doc.data();
                const id = doc.id;
                return{id,...data}
            })
        setUsers(dbUsers);
        })
    }
  return (<View>
      <TextInput 
      placeholder="Search here"
      onChangeText={(search)=>fetchUsers(search)}
      />
      <FlatList
      numColumns={1}
      horizontal={false}
      data={users}
      renderItem={({item})=>(
          <TouchableOpacity
            onPress={()=>navigation.navigate("Profile",{uid:item.id})}
          >
          <Text>{item.name}</Text>
          </TouchableOpacity>
      )}
      />
  </View>)
};

export default Search;
