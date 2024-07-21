import { RouteObject } from "react-router";

export const MAIN_PATHES = {
  MAIN: "main",
};

export const mainRoutes: RouteObject[] = [
  //* main pages
  {
    path: MAIN_PATHES.MAIN,
    element: <h1>mail</h1>,
  },
];
