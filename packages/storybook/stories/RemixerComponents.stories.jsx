import React from "react";

import { data } from "./data/remixer-data";

import {
  ContextFrame,
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
    dispatch={(action) => console.log("dispatch:", action)}
    {...args}
  />
);

export const SlidesAvailable = InsertSlideTpl.bind({});
SlidesAvailable.args = {
  block: {
    key: "slide-block",
  },
};

export const NoSlides = InsertSlideTpl.bind({});
NoSlides.args = {
  sources: [],
  block: {
    key: "slide-block",
  },
};

export const SelectedSlide = InsertSlideTpl.bind({});
SelectedSlide.args = {
  block: {
    key: "slide-block",
    deck: data.sources[0].id,
    slide: data.sources[0].deck.slides[1].id,
  },
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

const ContextTpl = (args) => <ContextFrame {...args} />;
export const Context = ContextTpl.bind({});
Context.args = {
  // block: {
  // key: "transition-block",
  // },
};
