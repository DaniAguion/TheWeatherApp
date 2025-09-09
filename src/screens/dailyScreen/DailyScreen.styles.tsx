import { StyleSheet } from "react-native";

export default StyleSheet.create({
  day_row: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 2,
    backgroundColor: "#ffffff"
  },
  day_desc: {
    fontSize: 14,
    fontWeight: "500",
  },
  weather_desc: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  main_group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12
  },
  first_subgroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8,
  },
  big_icon: {
    fontSize: 40,
    textAlign: "center",
    marginRight: 8
  },
  max_temp: {
    color: "#ff0000",
    fontSize: 16,
    textAlign: "center",
  },
  min_temp: {
    color: "#0000ff",
    fontSize: 16,
    textAlign: "center"
  },
  subgroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon_column: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  small_icon: {
    fontSize: 24,
    marginRight: 8
  },
  info_column: {
    flexDirection: "column",
    alignItems: "flex-start"
  },
  info_title: {
    fontSize: 12,
  },
  info_data: {
    fontSize: 12,
    fontWeight: "600",
  },
  spacer: { 
    height: 8 
  },
});