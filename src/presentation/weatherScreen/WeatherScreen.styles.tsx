import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 12,
  },
  current_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", 
    gap: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16
  },
  current_main_group: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  current_sec_group: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 16,
    paddingVertical: 16,
  },
  current_subgroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  location: {
    fontSize: 20,
    fontWeight: "600",
  },
  current_icon: {
    fontSize: 50
  },
  current_temp: {
    fontSize: 48
  },
  current_weather_desc: {
    fontSize: 18,
  },
  secondary_text: {
    flex: 1,
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    marginBottom: 8,
  },
  loading: {
    marginTop: 40,
  },
  list_container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  list: {
    flexGrow: 0,
  },
  hours_container: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
  },
  hours_title: {
    fontSize: 18,
    fontWeight: "600"
  },
  hour_column: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: "#fff"
  },
  hour_time: {
    fontWeight: "500",
    fontSize: 14,
  },
  hour_weather_icon: {
    fontSize: 24
  },
  hour_temp: {
    fontSize: 16,
    textAlign: "center",
  },
  day_column: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fff"
  },
  day_time: {
    fontSize: 14,
    fontWeight: "500",
  },
  day_weather_icon: {
    fontSize: 32
  },
  day_max_temp: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
  day_min_temp: {
    color: "#0000ff",
    fontSize: 16,
    textAlign: "center",
  },
});