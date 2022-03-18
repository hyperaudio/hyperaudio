import React from "react";

import Editor from "@hyperaudio/editor";

import transcript from "./data/transcripts/YVBNsWgjvPkGpubCchh2e5-transcript.json";

export default {
  title: "Packages/Editor",
  component: Editor,
};

const Template = (args) => (
  <div style={{ height: "100vh" }}>
    <Editor {...args} />
  </div>
);

export const EmptyEditor = Template.bind({});
EmptyEditor.args = {};
