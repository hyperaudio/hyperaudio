import React from "react";

import { Remixer } from "../../remixer/src/index.js";
import data from "./remixer.data.json";

export default {
  title: "Packages/Remixer",
  component: Remixer,
};

const Template = (args) => (
  <div style={{ height: "100vh" }}>
    <Remixer
      {...args}
      remix={{ ...data.remix }}
      source={{ ...data.source }}
      sources={{ ...data.sources }}
    />
  </div>
);

export const ReadMode = Template.bind({});
ReadMode.args = {
  editable: false,
};

export const EditMode = Template.bind({});
EditMode.args = {
  editable: true,
};
