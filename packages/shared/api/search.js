import { Subject, combineLatest, BehaviorSubject } from "rxjs";
import { startWith, switchMap, tap, filter, map, share } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { flatten, uniq } from "ramda";
import Item from "./item";

import { organizations$ } from "./organizations";

export const SEARCH_STATES = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  LOADED: "LOADED",
};

export const searchState$ = new BehaviorSubject(SEARCH_STATES.IDLE);

export const search$ = new Subject();

export const groups$ = organizations$.pipe(
  filter((orgs) => orgs.length > 0),
  map((orgs) => flatten(orgs.map((org) => org.groups))),
  share()
);

export const searchTerm$ = new Subject();

export const searchResults$ = combineLatest([search$, groups$]).pipe(
  filter(([term, groups]) => term.length > 0 && groups.length > 0),
  tap(() => searchState$.next(SEARCH_STATES.LOADING)),
  switchMap(([text, groups]) => {
    searchTerm$.next(text);
    const groupIds = groups.map((group) => group.id);
    const filterByGroupIds = `any(${groupIds.join(",")})`;
    const url = `https://hub.arcgis.com/api/v3/datasets?q=${text}&filter[groupIds]=${filterByGroupIds}&page[size]=99`;
    return ajax(url);
  }),
  map((data) => data.response.data.map((result) => Item.from(result))),
  tap(() => searchState$.next(SEARCH_STATES.LOADED)),
  tap((data) => console.log("search: ", data)),
  startWith([]),
  share()
);
