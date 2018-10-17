import { sizes } from "ui/settings";
import fluidify from "./ofMixins/fluidify";

export const setHeight = val =>
  fluidify([`height`], sizes[val][0], sizes[val][1]);
export const setWidth = val =>
  fluidify([`width`], sizes[val][0], sizes[val][1]);
export const setSize = val =>
  fluidify([`width`, `height`], sizes[val][0], sizes[val][1]);
