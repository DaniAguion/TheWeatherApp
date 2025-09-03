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
  }
});