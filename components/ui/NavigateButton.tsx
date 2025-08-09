
import { Href, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

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
    // width:340,
    // height:48,
    padding: 20,
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

