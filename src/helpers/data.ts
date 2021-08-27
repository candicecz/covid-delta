import _ from "lodash";
import population from "public/data/usa-population.json";
import mask_mandates from "public/data/usa-mask.json";

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

export type MapDataProps = {
  location: string;
  date: string;
  totalDeltaCountRolling: number;
  totalDeltaCountRollingPerCapita: number;
};

export interface DataProps {
  date: string;
  data: MapDataProps[];
}

// Strip unnecessary characters from 2-letter state code.
const formatLocation = (str: string) => {
  return str.replace("USA_US-", "");
};

// Group and order data by date
export const groupByDate = (data: csvRow[]) => {
  return Object.entries(
    _.groupBy(
      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
      d => d.date,
    ),
  );
};

// Clean up + structure of raw data for map viz.
export const processRawData = (raw: csvRow[]) => {
  let processed = groupByDate(raw).map(([date, group]) => {
    return {
      date,
      data: Object.values(
        group.reduce(
          (
            r: {[key: string]: MapDataProps},
            {location, lineage_count_rolling, date},
            i,
          ) => {
            if (location === "USA") {
              return r;
            }
            // two-letter state abbreviation.
            const abbr = formatLocation(location) as keyof typeof population;

            if (!r[abbr]) {
              r[abbr] = {
                date: date,
                location: abbr,
                totalDeltaCountRolling: 0,
                totalDeltaCountRollingPerCapita: 0,
              };
            }
            // Sum and sum/per capita (100 000 people)of all delta lineage sequences on a given day in a given location
            r[abbr]["totalDeltaCountRolling"] += lineage_count_rolling;
            r[abbr]["totalDeltaCountRollingPerCapita"] = population[abbr]
              ? (r[abbr]["totalDeltaCountRolling"] / population[abbr]) * 100000 //per 100 000
              : 0;

            return r;
          },
          {},
        ),
      ),
    };
  });

  return {
    data: processed,
  };
};

// Returns a boolean representing whether a mask mandate is in order at the given location on the given date.
export const getIsMaskMandated = (
  abbr: keyof typeof mask_mandates,
  current_date: string,
) => {
  const stateMandate = mask_mandates[abbr];
  if (!stateMandate || stateMandate.dates.length === 0) {
    return false;
  }

  const maskMandateDates = stateMandate.dates;
  const isMaskMandated = maskMandateDates.map(({start, end}) => {
    if (new Date(current_date).getTime() >= new Date(start).getTime()) {
      // Null end data occurs if a mask mandate is still in progress.
      if (!end) {
        return true;
      }

      return new Date(current_date).getTime() < new Date(end).getTime();
    }
    return false;
  });

  return isMaskMandated.includes(true);
};

export const numberWithSpaces = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
