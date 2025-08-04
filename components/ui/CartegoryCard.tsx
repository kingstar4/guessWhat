import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
    img: any;
    text: string;
    onPress?: () => void;
}

const CartegoryCard = ({img, text, onPress}: Props) => {
  return (
    <Pressable style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardImg}>
        <Image source={img} style={{width:'100%', height:'100%'}}/>
      </View>
      <View style={styles.cardText}>
        <Text>{text}</Text>
      </View>
    </Pressable>
  )
}

export default CartegoryCard;

const styles = StyleSheet.create({
    cardContainer: {
        // flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'space-between',
        width: 150,
        height: 200,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardImg:{
        padding: 10, 
        width: '100%', 
        height: '80%',
        borderRadius: 20,
    },
    cardText:{
        fontSize: 16,
        fontWeight: '700',
        textAlign:'center',
        padding: 10,
    }
})