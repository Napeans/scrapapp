import { StyleSheet } from 'react-native';
export const Colors = {
  buttonbackground: '#65AF44',
  buttonTextColor: '#fff',
  BACKGROUND_COLOR : '#F0F4F2',
  PRIMARY_BLUE: '#65AF44',
  ERROR_RED:'#FF3B30'
};

export const GlobalFontSize = {
  HeaderSize: 22,
  InputSize: 18,
};

const GlobalStyles = StyleSheet.create({
   button: {
    width: '100%',
    backgroundColor: Colors.buttonbackground,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: Colors.buttonTextColor, fontSize: 15 },  
  buttonTextDisabled: {
    color: '#fff',
  },
  input: {
    height: 45,
    borderColor: Colors.buttonbackground,
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
    headerLabel: {
    fontSize: 25,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
});

export default GlobalStyles;
