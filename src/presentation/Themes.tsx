
import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const PersonalizedLigthTheme: Theme = {
    ...DefaultTheme,
    colors: {
        primary: 'rgb(0, 122, 255)',
        background: 'rgb(255, 255, 255)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
    }
};

export const PersonalizedDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
        primary: 'rgb(10, 132, 255)',
        background: 'rgb(27, 27, 27)',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
    }
};


export const palette = {
  light: {
    border: "#E0E0E0",
    secondary_bg: "#FAFAFA",
    higlighted: "#1273DE",
    text: "#1E1E1E",
    secondary_text: "#666666",
    inverted_text: "#FFFFFF",
    tempMax: "#FF0000",
    tempMin: "#0000FF",
    shadowColor: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    border: "#74AAED",
    secondary_bg: "#A7BCD9",
    higlighted: "#74AAED",
    text: "#FFFFFF",
    secondary_text: "#A3A3A3",
    inverted_text: "#1E1E1E",
    tempMax: "#FF5F50",
    tempMin: "#5CA9FF",
    shadowColor: "rgba(255, 255, 255, 1)",
  }
};
