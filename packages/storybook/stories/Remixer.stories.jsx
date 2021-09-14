import React from "react";

import { Remixer } from "../../remixer/src/index.js";

export default {
  title: "Packages/Remixer",
  component: Remixer,
};

const Template = (args) => (
  <Remixer {...args} source="Hello Source" remix="Hello Remix" />
);

export const Playground = Template.bind({});
