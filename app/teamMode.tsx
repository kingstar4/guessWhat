import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import NavigateButton from '../components/ui/NavigateButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';

type Props = {}
const { width } = Dimensions.get('window');

const TeamMode = (props: Props) => {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.btnContainer}>
          <NavigateButton title='Create Team' to='/create' buttonStyle={styles.btn} />
          <NavigateButton title='Join Team' to='/join' buttonStyle={styles.btn} />
        </View>
      </View>
    </ScreenBackground>
  )
}

export default TeamMode;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: 192,
    width: width - 40,

  }
})