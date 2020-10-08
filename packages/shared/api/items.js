import { ajax } from "rxjs/ajax";
import { share, tap, map, switchMap, startWith } from "rxjs/operators";
import AsyncState from "./async_state";
import Item from "./item";

const state = new AsyncState();
export const itemsState$ = state.currentState;

// TODO: show 'authoritative' or 'deprecated' badge
// check 'content status' field in the item json response
// 

const tags = `idaho%20geospatial%20council%20-%20executive%20committee%20(igc-ec)%20framework%20layer`
// const url = `https://opendata.arcgis.com/api/v2/datasets?q=${tags}&fields[items]=tags`;

// ttps://hub.arcgis.com/api/v3/ is an alias of opendata
const url = `https://opendata.arcgis.com/api/v3/datasets?q=*&filter[tags]=any(${tags})`;

export const items$ = ajax(url).pipe(
  tap((_) => state.setLoading()),
  map((data) => data.response.data.map((result) => Item.from(result))),
  tap((_) => state.setLoaded()),
  startWith([]),
  share()
);
