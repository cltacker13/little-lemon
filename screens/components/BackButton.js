import { View, Pressable, Text } from "react-native";

export default function BackButton(navigation){
    const back = "<-";
    return(
        <View>
            <Pressable
                onPress={ () => {
                    navigation.goBack
                    }
                }
                style={styles.button}
                >
                    <Text style={styles.buttonText}>${back}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    button: {
        width: 50,
        borderRadius: 25,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },

});