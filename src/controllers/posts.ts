/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import fs = require('fs');
import * as csv from 'fast-csv';
import * as path from 'path';
import * as mj from 'mathjs';
import _ from 'lodash';
import haversine from 'haversine-distance';


interface ObjCoordinates {
  lat: number;
  lon: number;
  name: string;
  imp: number;
  click: number;
}

interface ObjFromCsv {
  lat: string;
  lon: string;
  event_type: string;
}

interface ObjDistance {
  distance: number | mj.BigNumber;
  name: string;
  event: string;
}

class Poi {
  private _coordinates: { [key: string]: ObjCoordinates };
  private _events: Array<ObjFromCsv>;

  constructor(coords: Array<ObjCoordinates>) {
    this._coordinates = {};
    this._events = [];

    coords.forEach((coord) => {
      this._coordinates[coord.name] = {
        lat: coord.lat,
        lon: coord.lon,
        name: coord.name,
        imp: 0,
        click: 0,
      };
    });
  }

  /**
   * Display the current variable _coordiantes in the terminal
   */
  getResult(): { [key: string]: ObjCoordinates } {
    console.log(this._coordinates);
    return this._coordinates;
  }

  /**
   * Set score by event
   * @param name
   * @param event
   */
  setScore(name: string, event: string): void {
    this._coordinates[name][event as keyof ObjCoordinates]++;
  }

  /**
   * Read file defined by the variable fileName and save the content in _events
   * @param fileName
   */
  async parseCsv(fileName: string): Promise<void> {
    const parser = fs
      .createReadStream(path.resolve(fileName))
      .pipe(csv.parse({ headers: true }));

    for await (const row of parser) {
      this._events.push(row);
    }
  }

  /**
   * Latitude => x
   * Longitude => y
   *
   * Parameter => [x1, y1], [x2, y2]
   *
   * Calculate the distance with the given coordinates with each events from csv file
   */
  calculateNearestEvent(): void {
    let sorted_arr: Array<ObjDistance> = [];

    this._events.forEach((event) => {
      let distance_arr: Array<ObjDistance> = [];

      let tmp_lat = parseFloat(event.lat);
      let tmp_lon = parseFloat(event.lon);

      Object.entries(this._coordinates).forEach(([k, v]) => {
        let obj_distance: ObjDistance = {
          distance: mj.distance([tmp_lat, v.lat], [tmp_lon, v.lon]),
          //distance: haversine([v.lat, tmp_lat], [v.lon, tmp_lon]),
          name: k,
          event: event.event_type,
        };

        distance_arr.push(obj_distance);
      });

      sorted_arr = _.sortBy(distance_arr, ['distance']);
      this.setScore(sorted_arr[0].name, sorted_arr[0].event);
    });
  }
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns object with the nearest events for each coordinate
 */
const postPoi = async (req: Request, res: Response, next: NextFunction) => {
  const coordinates = new Poi(req.body.coordinates);

  await coordinates.parseCsv('events.csv');
  coordinates.calculateNearestEvent();

  return res.status(200).json(coordinates.getResult());
};

export default { postPoi };
