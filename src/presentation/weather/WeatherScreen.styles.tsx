import { StyleSheet,Dimensions } from "react-native";


// Calculate item width for 5 columns with padding and margin for horizontal scrolling lists
const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTAINER_H_PADDING = 24;
const ELEMENTS_H_PADDING = 6;
const N_COLUMNS = 5;
const ITEM_WIDTH = (SCREEN_WIDTH - (CONTAINER_H_PADDING * 2 + (ELEMENTS_H_PADDING * 2 * N_COLUMNS))) / N_COLUMNS;

// Common shadow style for cards
const cardShadow = {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
};

export default StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#ffffff",
  },
  current_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fbfbfb",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  current_main_group: {
    flex: 1.2,
    flexDirection: "column",
    justifyContent: "center",
  },
  current_sec_group: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 16,
  },
  current_subgroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  loading_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list_container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  list: {
    flexGrow: 0,
  },
  actions_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  action_button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...cardShadow
  },
  action_button_icon: {
    fontSize: 28,
    color: "#1273de",
  },
  days_hours_container: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: CONTAINER_H_PADDING,
    ...cardShadow
  },
  hours_title: {
    fontSize: 18,
    fontWeight: "600"
  },
  hour_column: {
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: ELEMENTS_H_PADDING,
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
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: ELEMENTS_H_PADDING,
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