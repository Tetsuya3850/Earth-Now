async function dailySearch(cb) {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`
    );
    const json = await response.json();
    const earthquakes = json.features.map(feature => feature.properties.title);
    cb(earthquakes);
  } catch (err) {
    console.log(err);
  }
}

async function dailyLocationSearch(cb) {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson`
    );
    const json = await response.json();
    const earthquakes = json.features.map(
      feature => feature.geometry.coordinates
    );
    cb(earthquakes);
  } catch (err) {
    console.log(err);
  }
}

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
    cb(eObj);
  } catch (err) {
    console.log(err);
  }
}

function round_helper(num) {
  return Math.round(num / 100000000);
}

const Client = { dailySearch, dailyLocationSearch, monthlyTimeLocationSearch };
export default Client;
