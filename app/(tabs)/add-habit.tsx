import { DATABASE_ID, HABITS_COLLECTION_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

const FREQUENCIES = ["daily", "weekly", "monthly"]

export default function LoginScreen(){
    type Frequency = (typeof FREQUENCIES)[number];

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const {user} = useAuth();
    const router = useRouter();
    const theme = useTheme();


    const handleSubmit = async () => {

        try {
            if (!user) return;
        
            await databases.createDocument(
                DATABASE_ID, 
                HABITS_COLLECTION_ID, 
                ID.unique(),{
                    user_id: user.$id,
                    title,
                    description,
                    frequency,
                    streak_count: 0,
                    last_completed: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                }
            );

            router.back();  
            } catch (error) {
                if (error instanceof Error){
                    setError(error.message)
                    return;
                } 
                setError("There was an error creating the habit.")
            }
        }
    

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                onChangeText={setTitle}
                label="Title" 
                mode="outlined" 
                cursorColor= "#727272" 
                textColor="#727272" 
            />
            <TextInput 
                style={styles.input}
                onChangeText={setDescription}
                label="Description"
                mode="outlined" 
                cursorColor= "#727272" 
                textColor="#727272"
            />
            <View style={styles.frequencyContainer}>
                <SegmentedButtons 
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                    buttons={FREQUENCIES.map((freq)=>({
                        value: freq,
                        label: freq. charAt(0).toUpperCase() + freq.slice(1),
                        labelStyle: { color: '#727272' }
                    }))} 
                    style={styles.segmentedButtons}
                />
            </View>
            <Button 
                disabled={!title || !description} 
                mode="contained"
                onPress={handleSubmit}
            >Add Habit</Button>
            {error && <Text style={{ color: theme.colors.error}}>{error}</Text>}
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