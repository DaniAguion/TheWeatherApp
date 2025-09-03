import { SectionList, Text, View } from "react-native";
import type { Day } from "../api-weather/types";

type Props = { route: { params: { days: Day[]; title?: string } } };

export default function ForecastScreen({ route }: Props) {
  const { days, title } = route.params;

  return (
    <View style={{ flex: 1 }}>
      {title ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{title}</Text>
        </View>
      ) : null}

      <SectionList
        sections={days.map(d => ({ title: d.date, data: d.hours }))}
        keyExtractor={(h) => String(h.dateTime)}
        renderSectionHeader={({ section }) => (
          <View style={{ padding: 8, backgroundColor: "#eee" }}>
            <Text style={{ fontWeight: "600" }}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ padding: 12, flexDirection: "row", justifyContent: "space-between" }}>
            <Text>{new Date(item.dateTime * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
            <Text style={{ fontWeight: "600" }}>{Math.round(item.tempC)}°</Text>
          </View>
        )}
      />
    </View>
  );
}
