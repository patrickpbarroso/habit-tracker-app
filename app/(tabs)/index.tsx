import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>hey buddy this is the home page! :D</Text>
      <Link href="/login" style={styles.button}>Login page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: 'yellow',
    padding: 8,
    margin: 8,
    textAlign: "center",
    alignItems: "center"
  }
})
