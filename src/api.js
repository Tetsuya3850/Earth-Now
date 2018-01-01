import { round_helper } from "./helper";

async function monthlyTimeLocationSearch(cb) {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson`
    );
    const json = await response.json();
    const eObj = {};
    json.features.forEach(feature => {
      const key = round_helper(feature.properties.time);
      feature.geometry.coordinates[2] = feature.properties.mag;
      if (key in eObj) {
        eObj[key].push(feature.geometry.coordinates);
      } else {
        eObj[key] = [feature.geometry.coordinates];
      }
    });
    const startTime = json.features[json.features.length - 1].properties.time;
    cb(eObj, startTime);
  } catch (err) {
    console.log(err);
  }
}

const Client = { monthlyTimeLocationSearch };
export default Client;