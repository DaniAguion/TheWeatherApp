import { SectionList, Text, View } from "react-native";
import type { Day } from "../../api-weather/types";
import styles from "./DailyScreen.styles";

type Props = { route: { params: { days: Day[]; title?: string } } };

export default function DailyScreen({ route }: Props) {
  const { days, title } = route.params;

  return (
    <View style={{ flex: 1 }}>
      {title ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>
        </View>
      ) : null}
        <Text style={styles.daily_title}>Próximos días</Text>
        <FlatList
          data={data.days}
          keyExtractor={(d) => String(d.dateTime)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.daily_column}>
              <Text style={styles.daily_time}>{new Date(item.dateTime).toLocaleDateString("es-ES", { weekday: "short" })}</Text>
              <Text style={styles.daily_icon}>{item.icon}</Text>
              <Text style={styles.daily_max_temp}>{Math.round(item.maxC)}°</Text>
              <Text style={styles.daily_min_temp}>{Math.round(item.minC)}°</Text>
            </View>
          )}
        />
    </View>
  );
}
