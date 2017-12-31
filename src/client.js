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
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson`
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

const Client = { dailySearch, dailyLocationSearch };
export default Client;
