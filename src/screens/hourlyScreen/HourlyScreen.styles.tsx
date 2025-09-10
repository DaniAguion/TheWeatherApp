import { StyleSheet } from "react-native";

export default StyleSheet.create({
    hour_row: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 2,
    backgroundColor: "#ffffff"
  },
  hour_desc: {
    fontSize: 14,
    fontWeight: "500",
  },
  medium_icon: {
    fontSize: 32,
    textAlign: "center",
    marginHorizontal: 4
  },
  info_column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 4
  },
  info_title: {
    fontSize: 12,
  },
  info_data: {
    fontSize: 12,
    fontWeight: "600",
  },
});