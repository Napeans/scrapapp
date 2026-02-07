import { StyleSheet } from 'react-native';
const Colors = {
  buttonbackground: '#65AF44',
  buttonTextColor: '#fff',
};

const GlobalStyles = StyleSheet.create({
   button: {
    width: '100%',
    backgroundColor: Colors.buttonbackground,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: Colors.buttonTextColor, fontSize: 18 },  
  buttonTextDisabled: {
    color: '#fff',
  },
});

export default GlobalStyles;
