type AmenityIconName =
  | "car-outline"
  | "water-outline"
  | "cafe-outline"
  | "basketball-outline"
  | "shirt-outline"
  | "business-outline";

const amenityIcons: Record<string, AmenityIconName> = {
  parking: "car-outline",
  showers: "water-outline",
  cafe: "cafe-outline",
  "equipment rental": "basketball-outline",
};

const getAmenityIcon = (amenity: string): AmenityIconName => {
  return amenityIcons[amenity.toLowerCase()] ?? "business-outline";
};

export default getAmenityIcon;