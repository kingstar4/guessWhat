import { useBack } from '@/hooks/useBack';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Countdown = () => {
    const router= useRouter();
    const [countDown, setCountDown] = useState(5);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useBack('/category')
    useEffect(()=>{
    // Lock the screen orientation to portrait
        const lockOrientation = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        
        lockOrientation();

        if(countDown > 0){

           timeoutRef.current = setTimeout(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
            
        }
        else{
            router.push('/gameRoom');
        }
        
        return ()=> {
            if(timeoutRef.current){
                clearTimeout(timeoutRef.current); 
            }
        }
    },[countDown, router]);
    
  return (
    <View style={styles.container}>
        <Image source={require('../assets/images/countdown.jpg')} priority={'high'} contentFit='cover' style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
        <View style={styles.overlay}/>
      {countDown > 0 ?
        <View style={styles.countContainer}>
             <Text style={styles.txt}>{countDown}</Text>
        </View>
        : 
        (
        <View style={styles.countContainer}>
            <Text style={styles.txt}>{`Let's Go 😬`}</Text>
        </View>
        )}
    </View>
  )
}

export default Countdown;

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flex:1,
        alignItems:'center',
        justifyContent:'center',

    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // darkens the background
    },
    countContainer:{
        alignItems:'center',
        justifyContent:'center',
        width: '100%',
        height: 70,
        flexDirection:'row',
    },
    txt:{
        color:'#ffffff',
        fontSize:40, 
        fontWeight:'bold', 
        textAlign:'center',
        flexDirection:'row',
    }
})