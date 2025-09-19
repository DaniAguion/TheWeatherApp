import { FlatList, Text, View } from "react-native";
import type { Hour } from "../../domain/entities"
import styles from "./HourlyScreen.styles";


export type HourlyScreenParams = { hours: Hour[]; title: string };
type HourlyScreenProps = { route: { params: HourlyScreenParams} };

export default function HourlyScreen({ route }: HourlyScreenProps) {
  const hours = route.params.hours;

  return (
    <View style={ styles.view_container }>
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
          )}
        />
    </View>
  );
}
