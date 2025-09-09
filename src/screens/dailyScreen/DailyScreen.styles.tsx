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
  main_group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 8,
    gap: 12
  },
  weather_desc: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  precip_prob_text: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  first_subgroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 12
  },
  icon: {
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
    textAlign: "center",
  },
  second_subgroup: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 8
  },
  subgroup_row: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16
  },
  info_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  info_icon: {
    fontSize: 24,
    textAlign: "center",
    marginRight: 8
  },
  info_title: {
    fontSize: 12,
  },
  info_data: {
    fontSize: 12,
    fontWeight: "600",
  },
});