import { StyleSheet } from "react-native";

export default StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  day_row: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 2,
    marginHorizontal: 2,
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
    marginBottom: 8
  },
  main_group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  first_subgroup: {
    flexDirection: "row",
    justifyContent: "center",
    flexShrink: 1,
    flexWrap: "wrap",
    alignContent: "flex-start", 
    alignItems: "center",
  },
  big_icon: {
    fontSize: 40,
    textAlign: "center",
    marginRight: 8
  },
  max_temp: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  min_temp: {
    color: "#0000ff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"
  },
  subgroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },
  icon_column: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  small_icon: {
    fontSize: 32,
    marginRight: 4,
  },
  info_column: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  info_title: {
    fontSize: 10,
  },
  info_data: {
    fontSize: 10,
    fontWeight: "600",
  },
  spacer: { 
    height: 8 
  },
});