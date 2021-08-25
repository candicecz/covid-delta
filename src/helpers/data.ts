import _ from "lodash";

export interface csvRow {
  date: string;
  lineage: keyof LineageProps;
  lineage_count: number;
  lineage_count_rolling: number;
  location: string;
  proportion: number;
  proportion_ci_lower: number;
  proportion_ci_upper: number;
  total_count: number;
  total_count_rolling: number;
}

export type LineageProps = {
  "AY.1": number;
  "AY.2": number;
  "AY.3": number;
  "AY.3.1": number;
  "AY.4": number;
  "AY.5": number;
  "AY.6": number;
  "AY.7": number;
  "AY.9": number;
  "AY.10": number;
  "AY.11": number;
  "AY.12": number;
  "B.1.617.2": number;
};

export type LocationDataProps = Partial<LineageProps> & {
  location: string;
  total_count: number;
};

// Group data by date and location.
export const get_processed_data = (data: csvRow[]) => {
  const grouped_by_date = _.groupBy(data, d => d.date);

  return Object.entries(grouped_by_date).map(([date, entries]) => {
    const location_data = Object.entries(
      _.groupBy(entries, d => d.location),
    ).reduce((r: {[key: string]: LocationDataProps}, [location, data]) => {
      if (!r[location]) {
        r[location] = {
          total_count: 0,
          location,
        };
      }
      data.map(d => {
        const {lineage, lineage_count, total_count} = d;
        if (!(lineage in r[location])) {
          r[location] = {
            ...r[location],
            total_count,
            [lineage]: 0,
          };
        }
        // add lineage count for a given lineage.
        r[location][lineage]! += lineage_count;
      });
      return r;
    }, {});

    return {
      date,
      entries: Object.values(location_data),
    };
  });
};
