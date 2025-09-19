import { FlatList, Text, View } from "react-native";
import type { Hour } from "../../domain/entities"
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
              <View style={styles.first_subgroup}>
                <Text style={styles.hour_desc}> {new Date(item.dateTime).getHours()}:00</Text>
                <Text style={styles.medium_icon}>{item.icon}</Text>
                <Text style={styles.temp}>{Math.round(item.tempC)}°</Text>
              </View>
              <View style={styles.subgroup}>
                <View style={styles.icon_column}>
                  <Text style={styles.small_icon}>🌧️</Text>
                  <View style={styles.spacer} />
                  <Text style={styles.small_icon}>💧</Text>
                </View>
                <View style={styles.info_column}>
                    <Text style={styles.info_title}>LLuvia</Text>
                    <Text style={styles.info_data}>{Math.round(item.precipitationProb)}% {Math.round(item.precipitationMm)} mm</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.info_title}>Humedad</Text>
                    <Text style={styles.info_data}>{Math.round(item.humidity)}%</Text>
                </View>
              </View>
               <View style={styles.subgroup}>
                <View style={styles.icon_column}>
                  <Text style={styles.small_icon}>💨</Text>
                  <View style={styles.spacer} />
                  <Text style={styles.small_icon}>☀️</Text>
                </View>
                <View style={styles.info_column}>
                    <Text style={styles.info_title}>Viento</Text>
                    <Text style={styles.info_data}>{Math.round(item.windSpeedKmh)} km/h</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.info_title}>Índice UV</Text>
                    <Text style={styles.info_data}>{Math.round(item.uvIndex)}/12</Text>
                </View>
              </View>
            </View>
            /*
            <View style={styles.hour_row}>
              <Text style={styles.hour_desc}> {new Date(item.dateTime).getHours()}:00</Text>
              <Text style={styles.medium_icon}> {item.icon}</Text>
              <View style={styles.info_column}>
                  <Text style={styles.info_title}>Lluvia</Text>
                  <Text style={styles.info_data}>{Math.round(item.precipitationProb)}% {Math.round(item.precipitationMm)} mm</Text>
              </View>
              <Text style={styles.hour_desc}>🌧️ {Math.round(item.precipitationProb)}% {Math.round(item.precipitationMm)} mm</Text>
              <Text style={styles.hour_desc}>💨 {Math.round(item.windSpeedKmh)} km/h</Text>
              <Text style={styles.hour_desc}>💧 {Math.round(item.humidity)}%</Text>
            </View>
            */
          )}
        />
    </View>
  );
}
