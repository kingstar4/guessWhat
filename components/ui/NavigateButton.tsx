
import { Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type NavigateButtonProps = {
  title: string;
  to: Href; 
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export default function NavigateButton({ title, to, buttonStyle, textStyle }: NavigateButtonProps) {
  const router = useRouter();

  const handlePress = ()=>{
    router.push(to)
    
  }

  return (
    <Pressable
      style={[styles.button, buttonStyle]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width:340,
    height:48,
    backgroundColor: '#ADD6EB',
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

