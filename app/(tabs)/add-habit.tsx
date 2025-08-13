import { StyleSheet, View } from 'react-native'
import { Button, SegmentedButtons, TextInput } from 'react-native-paper'

const FREQUENCIES = ["daily", "weekly", "monthly"]

export default function LoginScreen(){
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} label="Title" mode="outlined" cursorColor= "#727272" textColor="#727272" />
            <TextInput style={styles.input} label="Description" mode="outlined" cursorColor= "#727272" textColor="#727272"/>
            <View style={styles.frequencyContainer}>
                <SegmentedButtons 
                    buttons={FREQUENCIES.map((freq)=>({
                        value: freq,
                        label: freq. charAt(0).toUpperCase() + freq.slice(1),
                        labelStyle: { color: '#727272' }
                    }))} 
                    style={styles.segmentedButtons}
                />
            </View>
            <Button style={styles.button} mode="contained">Add Habit</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
        justifyContent: "center"
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white"
    },
    frequencyContainer: {
        marginBottom: 8,
    },
    segmentedButtons: {
        marginBottom: 8,
        color: "black"
    },
})