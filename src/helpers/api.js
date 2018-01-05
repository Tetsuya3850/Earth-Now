import { round_helper } from "./utils";

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

async function liveCamSearch(cb) {
  try {
    const response = await fetch(
      `https://webcamstravel.p.mashape.com/webcams/list/country=IT/category=beach/orderby=popularity/limit=20`,
      {
        headers: {
          "X-Mashape-Key": "7GrfNcOg3gmshkB1n6TPEVEjj6dip1YH8f6jsnWquxtWbig7ZK"
        }
      }
    );
    const json = await response.json();
    const ids = json.result.webcams.map(cam => cam.id);
    cb(ids);
  } catch (err) {
    console.log(err);
  }
}

async function radioSearch(cb) {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson`
    );
    const json = await response.json();
    const equake = json.features.map(feature => feature.geometry.coordinates);
    cb(equake);
  } catch (err) {
    console.log(err);
  }
}

const Client = { monthlyTimeLocationSearch, liveCamSearch, radioSearch };
export default Client;
