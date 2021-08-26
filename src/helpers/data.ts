import _ from "lodash";
import * as d3 from "d3";
import population from "public/data/usa-population.json";
import mask_mandates from "public/data/usa-mask.json";
import theme from "src/theme";

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

type DataProps = {
  location: string;
  date: string;
  population: number;
  totalDeltaCountRolling: number;
  totalDeltaCountRollingPerCapita: number;
};

export interface MapDataProps {
  date: string;
  data: DataProps[];
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
            r: {[key: string]: DataProps},
            {location, lineage_count_rolling, date},
            i,
          ) => {
            // two-letter state abbreviation.
            const abbr = formatLocation(location) as keyof typeof population;

            if (!r[abbr]) {
              r[abbr] = {
                date: date,
                location: abbr,
                population: population[abbr] ?? 0,
                totalDeltaCountRolling: 0,
                totalDeltaCountRollingPerCapita: 0,
              };
            }
            // Sum and sum/per capita (100 000 people)of all delta lineage sequences on a given day in a given location
            r[abbr]["totalDeltaCountRolling"] += lineage_count_rolling;
            r[abbr]["totalDeltaCountRollingPerCapita"] = population[abbr]
              ? (r[abbr]["totalDeltaCountRolling"] / population[abbr]) * 100000
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

export interface VizPropertiesProps {
  date: string;
  location: string;
  colorValue: number;
  fill: string[];
  totalDeltaCountRollingPerCapita: number;
  totalDeltaCountRolling: number;
}

export interface VizDataProps {
  date: string;
  data: VizPropertiesProps[];
}

// Viz specific data processing.
export const processMapVizData = (data: MapDataProps[]): VizDataProps[] => {
  // Min and max values for color scale.
  const colorScaleExtent = getMapMinMax(data, "totalDeltaCountRollingPerCapita")
    .map(d => {
      if (!d?.totalDeltaCountRollingPerCapita) {
        return 0;
      }
      return Math.ceil(d.totalDeltaCountRollingPerCapita);
    })
    .reverse();

  const colorScale = (data: number): string =>
    d3
      .scaleSequential()
      .domain(colorScaleExtent)
      .interpolator(d3.interpolatePlasma)(data);

  // Format data with visualization values. (Nationwide result filtered out - not needed)
  return data.map(daily_data => {
    return {
      date: daily_data.date,
      data: daily_data.data
        .filter(datum => datum.location !== "USA")
        .map(
          ({
            date,
            location,
            totalDeltaCountRollingPerCapita,
            totalDeltaCountRolling,
          }) => {
            return {
              date,
              location,
              colorValue: Math.ceil(totalDeltaCountRollingPerCapita),
              fill: [
                colorScale(Math.ceil(totalDeltaCountRollingPerCapita)) ||
                  theme.colors.disabled,
              ],
              totalDeltaCountRollingPerCapita,
              totalDeltaCountRolling,
            };
          },
        ),
    };
  });
};

// Returns min and max value of a given property. Optional: boolean to omit nationwide data from results.
export const getMapMinMax = (
  mapData: MapDataProps[],
  property: keyof DataProps,
  onlyStatesData: boolean = true,
) => {
  let flattened = mapData.flatMap(daily => daily.data);

  // Omits nationwide results.
  if (onlyStatesData) {
    flattened = flattened.filter(d => d.location !== "USA");
  }

  const min = _.minBy(flattened, d => d[property]);
  const max = _.maxBy(flattened, d => d[property]);

  return [min, max];
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
