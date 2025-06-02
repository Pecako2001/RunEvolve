import React, { useContext } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, ThemeContext } from "./ThemeContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { FontSizeProvider } from "./FontSizeContext";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { colors } = useContext(ThemeContext);
  return (
    <FontSizeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: colors.accent },
            headerTintColor: "#ffffff",
          }}
        >
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onSuccess={() => console.log("login successful")}
                onError={() => console.log("login failed")}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FontSizeProvider>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </PaperProvider>
  );
}
