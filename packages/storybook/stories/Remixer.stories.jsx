import React from "react";

import { Remixer } from "../../remixer/src/index.js";

export default {
  title: "Packages/Remixer",
  component: Remixer,
};

const Template = (args) => <Remixer {...args} text="Hello world" />;

export const LoggedIn = Template.bind({});

export const LoggedOut = Template.bind({});
