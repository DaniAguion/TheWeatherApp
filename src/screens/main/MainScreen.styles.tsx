import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 12,
  },
  header_container: {
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
  header_main_group: {
    flexDirection: "column",
    flex: 3,
    alignItems: "flex-start",
    justifyContent: "center",  
  },
  header_sec_group: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 16,
  },
  temp_icon_group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  icon: {
    fontSize: 40
  },
  temp: {
    fontSize: 48
  },
  location: {
    fontSize: 20,
    fontWeight: "600",
  },
  weather_desc_text: {
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
  }
});