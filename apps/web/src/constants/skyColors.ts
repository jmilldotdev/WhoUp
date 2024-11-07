// Define the type for a color set
export interface ColorSet {
  sky1: string;
  sky2: string;
  sky3: string;
  sky4: string;
  ground: string;
}

// Base green color for ground
const baseGround = "#22D91E";

export const colorSets = [
  {
    sky1: "#F6D8C1",
    sky2: "#A17184",
    sky3: "#CC1D18",
    sky4: "#4E1C28",
    ground: baseGround,
  }, // Midnight 0-1 done
  {
    sky1: "#DCDED2",
    sky2: "#10181C",
    sky3: "#510A05",
    sky4: "#678882",
    ground: baseGround,
  }, // Late Night 2-3 done
  {
    sky1: "#ECDFCF",
    sky2: "#CC1D18",
    sky3: "#95A7BC",
    sky4: "#CBADAD",
    ground: baseGround,
  }, // Dawn 4-5 done
  {
    sky1: "#FFFFFF",
    sky2: "#FFF505",
    sky3: "#879BBB",
    sky4: "#9D9CB3",
    ground: baseGround,
  }, // Sunrise 6-7 done
  {
    sky1: "#FEFFF7",
    sky2: "#ADD19A",
    sky3: "#E1C8BF",
    sky4: "#95A6C9",
    ground: baseGround,
  }, // Morning 8-9 done
  {
    sky1: "#F5F1EB",
    sky2: "#708B75",
    sky3: "#CD9265",
    sky4: "#78AAC2",
    ground: baseGround,
  }, // Late Morning 10-11 done
  {
    sky1: "#F9F5E8",
    sky2: "#A6C6B8",
    sky3: "#EBC4A5",
    sky4: "#6EC1E6",
    ground: baseGround,
  }, // Noon 12-13 done
  {
    sky1: "#FFFBED",
    sky2: "#FEFE91",
    sky3: "#FE770D",
    sky4: "#85BCD6",
    ground: baseGround,
  }, // Late Afternoon 14-15 done
  {
    sky1: "#FEFCE8",
    sky2: "#FCD2C0",
    sky3: "#BF2022",
    sky4: "#42999F",
    ground: baseGround,
  }, // Sunset 16-17 done
  {
    sky1: "#FFFFFB",
    sky2: "#FE6E0B",
    sky3: "#16214F",
    sky4: "#779599",
    ground: baseGround,
  }, // Evening 18-19 done
  {
    sky1: "#F6D8C1",
    sky2: "#A17184",
    sky3: "#CC1D18",
    sky4: "#4E1C28",
    ground: baseGround,
  }, // Night 20-21 tbd
  {
    sky1: "#F6D8C1",
    sky2: "#A17184",
    sky3: "#CC1D18",
    sky4: "#4E1C28",
    ground: baseGround,
  }, // Late Night 22-23 tbd
];

export const colorSets2 = [
  {
    sky1: "#E6F3FF",
    sky2: "#B3D9FF",
    sky3: "#80BFFF",
    sky4: "#4DA6FF",
    ground: baseGround,
  }, // Lightest blue
  {
    sky1: "#CCE6FF",
    sky2: "#99CCFF",
    sky3: "#66B3FF",
    sky4: "#3399FF",
    ground: baseGround,
  },
  {
    sky1: "#B3D9FF",
    sky2: "#80BFFF",
    sky3: "#4DA6FF",
    sky4: "#1A8CFF",
    ground: baseGround,
  },
  {
    sky1: "#99CCFF",
    sky2: "#66B3FF",
    sky3: "#3399FF",
    sky4: "#0073E6",
    ground: baseGround,
  },
  {
    sky1: "#80BFFF",
    sky2: "#4DA6FF",
    sky3: "#1A8CFF",
    sky4: "#005CB3",
    ground: baseGround,
  },
  {
    sky1: "#66B3FF",
    sky2: "#3399FF",
    sky3: "#0073E6",
    sky4: "#004C99",
    ground: baseGround,
  },
  {
    sky1: "#4DA6FF",
    sky2: "#1A8CFF",
    sky3: "#005CB3",
    sky4: "#003D73",
    ground: baseGround,
  },
  {
    sky1: "#3399FF",
    sky2: "#0073E6",
    sky3: "#004C99",
    sky4: "#002E59",
    ground: baseGround,
  },
  {
    sky1: "#0073E6",
    sky2: "#004C99",
    sky3: "#002E59",
    sky4: "#001526",
    ground: baseGround,
  },
  {
    sky1: "#1A8CFF",
    sky2: "#005CB3",
    sky3: "#003D73",
    sky4: "#001F3F",
    ground: baseGround,
  },
  {
    sky1: "#0073E6",
    sky2: "#004C99",
    sky3: "#002E59",
    sky4: "#001526",
    ground: baseGround,
  },
  {
    sky1: "#005CB3",
    sky2: "#003D73",
    sky3: "#001F3F",
    sky4: "#000C13",
    ground: baseGround,
  },
];
