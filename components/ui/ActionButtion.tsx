

import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type NavigateButtonProps = {
  title: string;
 
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress?:()=>void;
};

export default function NavigateButton({ title, buttonStyle, textStyle, onPress }: NavigateButtonProps) {
  
  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width:340,
    height:48,
    backgroundColor: '#3ea5d8ff',
    borderRadius: 50,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

