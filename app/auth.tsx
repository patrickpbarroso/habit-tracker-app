import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen(){
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>("")

    const theme = useTheme()
    const router = useRouter();

    const {signIn, signUp} = useAuth()

    const handleAuth = async () => {
        if (!email || !password){
            setError("Please, fill in all fields.")
        }

        if (password.length < 6){
            setError("Password must be at least 6 characters long.")
        }

        setError(null)

        if (isSignUp) {
            const error = await signUp(email, password)
            if (error){
                setError(error)
                return
            }
        }else{
            const error = await signIn(email, password)
            if (error){
                setError(error)
                return
            }

            router.replace("/")
        }
    };

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    }
    
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding": "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant='headlineMedium'> {isSignUp ? "Create account" : "Welcome back"} </Text>
                <TextInput 
                    label="Email"
                    placeholder="example@email.com" 
                    autoCapitalize="none"
                    keyboardType="email-address"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                    cursorColor= "#727272" 
                    textColor="#727272"
                ></TextInput>
                <TextInput 
                    label="Password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                    cursorColor= "#727272" 
                    textColor="#727272"
                ></TextInput>
                
                {error && <Text style={{ color: theme.colors.error}}>{error}</Text>}

                <Button mode="contained" onPress={handleAuth} style={styles.button}>
                    { isSignUp ? "Sign up" : "Sign in"}
                </Button>
                <Button mode="text" onPress={handleSwitchMode} style={styles.switchModeButton}>
                    { isSignUp ? "Do you already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: "center"
    },
    title: {
        textAlign: "center",
        marginBottom: 24,
        color: "#727272"
    },
    input: {
        marginBottom: 16,
        backgroundColor: "white",
        color: "black"
    },
    button: {
        marginTop: 8
    },
    switchModeButton: {
        marginTop: 16
    }
})