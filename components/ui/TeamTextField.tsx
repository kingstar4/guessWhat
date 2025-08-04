import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type TextFieldProps = {
    placeHolder: string;
}

const TeamTextField = ({placeHolder}: TextFieldProps) => {
    const [text, setText] = useState('');

    const clearText=()=>{
        setText('');
    }

  return (
    <View style={styles.textContainer}>
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', marginRight:20}}>
            <TextInput style={styles.textBox} placeholder={placeHolder} value={text} onChangeText={setText} placeholderTextColor="#4F8096"/>
            {text.length>0 && (<TouchableOpacity onPress={clearText}>
                <MaterialIcons name='cancel' size={20} color='#4F8096'/>
            </TouchableOpacity>)}
        </View>
    </View>
  )
}

export default TeamTextField;

const styles = StyleSheet.create({
    textContainer:{
        backgroundColor:'#E8F0F2',
        width: 320,
        height: 56,
        alignSelf:'center',
        borderRadius:20,
        marginVertical:20,
    },
    textBox:{
        alignItems:'center',
        flex:1,
        height:56,
        marginLeft:10,
    }
})