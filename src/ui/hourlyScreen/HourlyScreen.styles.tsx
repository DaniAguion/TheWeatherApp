import { StyleSheet } from "react-native";

export default StyleSheet.create({
  hour_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 2,
    marginHorizontal: 2,
    backgroundColor: "#ffffff"
  },
  first_subgroup: {
    flexDirection: "row",
    justifyContent: "center",
    flexShrink: 1,
    flexWrap: "wrap",
    alignContent: "flex-start", 
    alignItems: "center",
    gap: 4
  },
  hour_desc: {
    fontSize: 12,
    fontWeight: "500",
  },
  medium_icon: {
    fontSize: 32,
    textAlign: "center",
    marginHorizontal: 4
  },
  temp: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 4
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