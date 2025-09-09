import { FlatList, Text, View } from "react-native";
import type { Hour } from "../../api-weather/types";
import styles from "./HourlyScreen.styles";

type Props = { route: { params: { hours: Hour[]; title?: string } } };

export default function HourlyScreen({ route }: Props) {
  const { hours, title } = route.params;

  return (
    <View style={{ flex: 1 }}>
        <FlatList
          data={hours}
          keyExtractor={(d) => String(d.dateTime)}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.hour_row}>
              <Text style={styles.hour_desc}> {new Date(item.dateTime).getHours()}:00</Text>
              <Text style={styles.hour_desc}> {item.icon}</Text>
              <Text style={styles.hour_desc}>🌧️ {Math.round(item.precipitationProb)}% {Math.round(item.precipitationMm)} mm</Text>
              <Text style={styles.hour_desc}>💨 {Math.round(item.windSpeedKmh)} km/h</Text>
              <Text style={styles.hour_desc}>💧 {Math.round(item.humidity)}%</Text>
            </View>
          )}
        />
    </View>
  );
}
