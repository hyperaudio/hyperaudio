import React from "react";

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
    onTextChange={(str) => console.log("onTextChange:", str)}
    onSetFullSize={(bool) => console.log("onSetFullSize:", bool)}
    {...args}
  />
);
export const EmptyTitle = InsertTitleTpl.bind({});
EmptyTitle.args = {};
export const FullSizeTitle = InsertTitleTpl.bind({});
FullSizeTitle.args = {
  text: "This is a full-size title",
  fullSize: true,
};
export const LowerThirdsTitle = InsertTitleTpl.bind({});
LowerThirdsTitle.args = {
  text: "This is a lower-thirds title",
  fullSize: false,
};

const InsertSlideTpl = (args) => <InsertSlide {...args} />;
export const Slide = InsertSlideTpl.bind({});
Slide.args = {};

const InsertTransitionTpl = (args) => (
  <InsertTransition
    onDurationChange={(val) => console.log("onDurationChange", val)}
    {...args}
  />
);
export const Transition = InsertTransitionTpl.bind({});
Transition.args = {};
