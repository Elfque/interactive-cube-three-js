import * as three from "three";

const coordinates = [
  {
    lat: 3.363803,
    long: 6.680248,
  },
  {
    lat: 51.5072,
    long: -0.1276,
  },
  {
    lat: 40.7128,
    long: -74.006,
  },
  {
    lat: 35.6762,
    long: 139.6503,
  },
  {
    lat: 25.2048,
    long: 55.2708,
  },
  {
    lat: -23.5505,
    long: -46.6333,
  },
];

export const latLongToVector3 = (lat, lon, radius) => {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon - 180) * Math.PI) / 180;

  const x = -(radius * Math.cos(phi) * Math.cos(theta));
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.sin(theta);

  return new three.Vector3(x, y, z);
};

export const positions = coordinates.map((coor) =>
  latLongToVector3(coor.lat, coor.long, 4.1),
);

export const lines = [
  {
    start: positions[4],
    end: positions[3],
  },
  {
    start: positions[1],
    end: positions[5],
  },
  {
    start: positions[2],
    end: positions[5],
  },
  {
    start: positions[0],
    end: positions[1],
  },
];
