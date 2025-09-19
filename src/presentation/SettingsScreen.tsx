import { useEffect, useState } from "react";
import { View, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_TEMP_UNIT = "settings:tempUnit"; // "C" | "F"

export default function SettingsScreen() {
  const [useFahrenheit, setUseFahrenheit] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY_TEMP_UNIT);
      if (saved === "F") setUseFahrenheit(true);
    })();
  }, []);

  const toggle = async () => {
    const next = !useFahrenheit;
    setUseFahrenheit(next);
    await AsyncStorage.setItem(KEY_TEMP_UNIT, next ? "F" : "C");
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Ajustes</Text>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Usar Fahrenheit</Text>
          <Text style={{ color: "#666" }}>Si está apagado, se usan °C</Text>
        </View>
        <Switch value={useFahrenheit} onValueChange={toggle} />
      </View>
    </View>
  );
}
