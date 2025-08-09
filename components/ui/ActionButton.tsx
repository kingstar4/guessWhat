

import { Platform, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type NavigateButtonProps = {
  title: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress?:()=>void;
  disabled?: boolean;
};

export default function ActionButton({ title, buttonStyle, textStyle, onPress, disabled }: NavigateButtonProps) {
  
  return (
    <Pressable style={[styles.button, buttonStyle]} disabled={disabled} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width:340,
    height:48,
    backgroundColor: '#007AFF',
    borderRadius: 50,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    marginVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

