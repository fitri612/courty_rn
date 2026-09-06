const getSportIcon = (sport: string) => {
  switch (sport.toLowerCase()) {
    case "padel":
      return "tennisball-outline";

    case "tennis":
      return "tennisball-outline";

    default:
      return "fitness-outline";
  }
};

export default getSportIcon;