import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 12,
  },
  current_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    gap: 8,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16
  },
  current_main_group: {
    flexDirection: "column",
    flex: 3,
    alignItems: "flex-start",
    justifyContent: "center",  
  },
  current_sec_group: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 16,
  },
  current_subgroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  current_icon: {
    fontSize: 40
  },
  current_temp: {
    fontSize: 48
  },
  location: {
    fontSize: 20,
    fontWeight: "600",
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
  next_container: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  next_title: {
    fontSize: 18,
    fontWeight: "600",
  },
  hour_column: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff"
  },
  hourly_time: {
    fontSize: 14,
  },
  hourly_icon: {
    fontSize: 24,
    textAlign: "center",
  },
  hourly_temp: {
    fontSize: 16,
    textAlign: "center",
  },
  daily_column: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff"
  },
  daily_time: {
    fontSize: 14,
  },
  daily_icon: {
    fontSize: 24,
    textAlign: "center",
  },
    daily_max_temp: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
  daily_min_temp: {
    color: "#0000ff",
    fontSize: 16,
    textAlign: "center",
  },
});