import React from "react";

import Typography from "@mui/material/Typography";

export default {
  title: "Common/Typography",
  component: Typography,
};

const TypographyTpl = (args) => (
  <div style={{ height: "100vh" }}>
    <Typography display="block" gutterBottom variant="h1">
      Typography variant h1
    </Typography>
    <Typography display="block" gutterBottom variant="h2">
      Typography variant h2
    </Typography>
    <Typography display="block" gutterBottom variant="h3">
      Typography variant h3
    </Typography>
    <Typography display="block" gutterBottom variant="h4">
      Typography variant h4
    </Typography>
    <Typography display="block" gutterBottom variant="h5">
      Typography variant h5
    </Typography>
    <Typography display="block" gutterBottom variant="h6">
      Typography variant h6
    </Typography>
    <Typography display="block" gutterBottom variant="subtitle1">
      Typography variant subtitle1
    </Typography>
    <Typography display="block" gutterBottom variant="subtitle2">
      Typography variant subtitle2
    </Typography>
    <Typography display="block" gutterBottom variant="body1">
      Typography variant body1
    </Typography>
    <Typography display="block" gutterBottom variant="body2">
      Typography variant body2
    </Typography>
    <Typography display="block" gutterBottom variant="button">
      Typography variant button
    </Typography>
    <Typography display="block" gutterBottom variant="overline">
      Typography variant overline
    </Typography>
    <Typography display="block" gutterBottom variant="caption">
      Typography variant caption
    </Typography>
  </div>
);

export const Default = TypographyTpl.bind({});
Default.args = {};
