import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type TextFieldProps = {
  placeHolder: string;
  value: string;
  onChangeText: (text: string) => void;
  // showDelete?: boolean;
  // onDelete?: () => void;
}

const TextField = ({placeHolder, value, onChangeText}: TextFieldProps) => {
  return ( 
    <View style={styles.textContainer}>
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-between', marginRight:20}}>
            <TextInput style={styles.textBox} value={value} onChangeText={onChangeText} placeholder={placeHolder} placeholderTextColor="#4F8096" />
        </View>
    </View>
  )
}

export default TextField

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