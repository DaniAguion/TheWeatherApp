import { FlatList, Text, View } from "react-native";
import type { Day } from "../../domain/entities"
import styles from "./DailyScreen.styles";

type Props = { route: { params: { days: Day[]; title?: string } } };

export default function DailyScreen({ route }: Props) {
  const { days, title } = route.params;

  return (
    <View style={{ flex: 1 }}>
        <FlatList
          data={days}
          keyExtractor={(d) => String(d.dateTime)}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.day_row}>
              <Text style={styles.day_desc}>  {new Date(item.dateTime).toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long"
              }).replace(/^\w/, c => c.toUpperCase())}</Text>
              <Text style={styles.weather_desc}>{item.weather_desc}</Text>
              <View style={styles.main_group}>
                <View style={styles.first_subgroup}>
                  <Text style={styles.big_icon}>{item.icon}</Text>
                  <View>
                    <Text style={styles.max_temp}>{Math.round(item.maxC)}°</Text>
                    <Text style={styles.min_temp}>{Math.round(item.minC)}°</Text>
                  </View>
                </View>
                <View style={styles.subgroup}>
                  <View style={styles.icon_column}>
                    <Text style={styles.small_icon}>🌧️</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.small_icon}>☁️</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.small_icon}>💨</Text>
                  </View>
                  <View style={styles.info_column}>
                      <Text style={styles.info_title}>LLuvia</Text>
                      <Text style={styles.info_data}>{Math.round(item.precipitationProb)}% {Math.round(item.precipitationMm)} mm</Text>
                      <View style={styles.spacer} />
                      <Text style={styles.info_title}>Nubosidad</Text>
                      <Text style={styles.info_data}>{Math.round(item.cloudCover)} %</Text>
                      <View style={styles.spacer} />
                      <Text style={styles.info_title}>Viento</Text>
                      <Text style={styles.info_data}>{Math.round(item.windSpeedKmh)} km/h</Text>
                  </View>
                </View>
                <View style={styles.subgroup}>
                  <View style={styles.icon_column}>
                    <Text style={styles.small_icon}>☀️</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.small_icon}>🌅</Text>
                    <View style={styles.spacer} />
                    <Text style={styles.small_icon}>🌆</Text>
                  </View>
                  <View style={styles.info_column}>
                      <Text style={styles.info_title}>Índice UV</Text>
                      <Text style={styles.info_data}>{Math.round(item.uvIndex)}/12</Text>
                      <View style={styles.spacer} />
                      <Text style={styles.info_title}>Amanecer</Text>
                      <Text style={styles.info_data}>{new Date(item.sunrise).getHours()}:00</Text>
                      <View style={styles.spacer} />
                      <Text style={styles.info_title}>Ocaso</Text>
                      <Text style={styles.info_data}>{new Date(item.sunset).getHours()}:00</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
    </View>
  );
}
