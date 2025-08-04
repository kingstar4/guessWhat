import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigateButton from '../components/ui/NavigateButton';

type Props = {}
const {width} = Dimensions.get('window');

const TeamMode = (props: Props) => {
  return (
    <SafeAreaView style={{flex:1}}>
      {/* <View style={styles.header}>
        <Text style={{textAlign:'center', fontWeight:700, flex:1,  fontSize:20, color:'#000', marginRight:20}}>Guess What</Text>
        <TouchableOpacity>
          <Ionicons name='settings-outline' size={20}/>
        </TouchableOpacity>
      </View> */}
      <View style={styles.container}>
        <View style={styles.btnContainer}>  
          <NavigateButton title='Create Team' to='/create'/> 
          <NavigateButton title='Join Team' to='/join'/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default TeamMode;

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
  },
  header:{
    height: 72,
    flexDirection:'row',
    alignItems:'center',
    textAlign:'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,

  },
  btnContainer:{
    alignItems: 'center',
    justifyContent:'space-between',
    flexDirection: 'column',
    height: 192,
    width: width,
    
  }
})