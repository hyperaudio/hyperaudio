import React from "react";

import {
  InsertSlide,
  InsertTitle,
  InsertTransition,
} from "../../remixer/src/components";

export default {
  title: "Packages/Remix Insert",
};

const InsertTitleTpl = (args) => <InsertTitle {...args} />;
export const Title = InsertTitleTpl.bind({});
Title.args = {};

const InsertSlideTpl = (args) => <InsertSlide {...args} />;
export const Slide = InsertSlideTpl.bind({});
Slide.args = {};

const InsertTransitionTpl = (args) => <InsertTransition {...args} />;
export const Transition = InsertTransitionTpl.bind({});
Transition.args = {};
