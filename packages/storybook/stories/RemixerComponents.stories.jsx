import React from "react";

import { data } from "./data/remixer-data";

import {
  InsertSlide,
  InsertTitle,
  InsertTransition,
} from "../../remixer/src/components";

export default {
  title: "Packages/Remix Inserts",
};

const InsertTitleTpl = (args) => (
  <InsertTitle
    dispatch={(action) => console.log("dispatch:", action)}
    {...args}
  />
);

export const EmptyTitle = InsertTitleTpl.bind({});
EmptyTitle.args = {
  block: {
    key: "title-block",
    text: "",
  },
};

export const FullSizeTitle = InsertTitleTpl.bind({});
FullSizeTitle.args = {
  block: {
    key: "title-block",
    text: "This is a full-size title",
    fullSize: true,
  },
};

export const LowerThirdsTitle = InsertTitleTpl.bind({});
LowerThirdsTitle.args = {
  block: {
    key: "title-block",
    text: "This is a lower-thirds title",
    fullSize: false,
  },
};

const InsertSlideTpl = (args) => (
  <InsertSlide
    sources={data.sources}
    onChooseSlide={({ deck, slide }) =>
      console.log("onChooseSlide:", { deck, slide })
    }
    {...args}
  />
);

export const SlidesAvailable = InsertSlideTpl.bind({});
SlidesAvailable.args = {};

export const NoSlides = InsertSlideTpl.bind({});
NoSlides.args = { sources: [] };

export const SelectedSlide = InsertSlideTpl.bind({});
SelectedSlide.args = {
  deck: data.sources[0].id,
  slide: data.sources[0].deck.slides[1].id,
};

const InsertTransitionTpl = (args) => (
  <InsertTransition
    dispatch={(action) => console.log("dispatch:", action)}
    {...args}
  />
);
export const Transition = InsertTransitionTpl.bind({});
Transition.args = {
  block: {
    key: "transition-block",
  },
};
