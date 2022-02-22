import type { NextPage } from "next";
import { useState } from "react";
import Image from "next/image";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

interface PageProps {
  yOffset: Number;
}

const PREFIX = `ConferencesPage`;
const classes = {
  root: `${PREFIX}-root`,
  hero: `${PREFIX}-hero`,
};

const Root = styled("div", {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(({ theme }) => ({
  [`& .${classes.hero}`]: {
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "center",
    minHeight: "100vh",
  },
}));

const ConferencesPage: NextPage<PageProps> = (props: PageProps) => {
  const { yOffset } = props;
  const [expanded, setExpanded] = useState<number | false>(0);
  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (expanded !== panel) setExpanded(isExpanded ? panel : false);
    };

  const accordionData = [
    {
      color: "info.main",
      id: 0,
      image: "/images/sample.png",
      text: "Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.",
      title: "Transcribe",
    },
    {
      color: "error.main",
      id: 1,
      image: "/images/sample.png",
      text: "Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.",
      title: "Translate",
    },
    {
      color: "success.main",
      id: 2,
      image: "/images/sample.png",
      text: "Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.",
      title: "Remix",
    },
    {
      color: "warning.main",
      id: 3,
      image: "/images/sample.png",
      text: "Non nostrud eiusmod culpa anim adipisicing aliqua excepteur cillum cupidatat. Occaecat voluptate voluptate enim culpa fugiat nulla consectetur cillum pariatur. Occaecat pariatur laborum ut. Culpa esse labore aliqua ea.",
      title: "Publish",
    },
  ];

  return (
    <Root className={classes.root}>
      <Container
        fixed
        sx={{
          py: { xs: 16, md: 26 },
          mt: `${yOffset * -1}px`,
        }}
        className={classes.hero}
        maxWidth="xl"
      >
        <Grid container spacing={{ md: 6, lg: 12 }}>
          <Grid item xs={12} lg={5}>
            <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
              <Container disableGutters maxWidth="sm">
                <Typography variant="h1" gutterBottom>
                  Make the most of your conference content
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: { xs: 3, sm: 4 },
                  }}
                >
                  Transcribe, translate, repurpouse and share—meet your audience
                  wherever they are.
                </Typography>
              </Container>
            </Box>
            <Box
              sx={{
                mt: { xs: 3, sm: 4 },
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              <Button
                color="primary"
                sx={{ mr: 1 }}
                size="large"
                variant="contained"
              >
                Stay informed
              </Button>
              <Button
                color="primary"
                sx={{ ml: 1 }}
                size="large"
                variant="outlined"
              >
                Request a demo
              </Button>
            </Box>
            <Box
              sx={{
                // borderColor: "info.main",
                // borderRadius: 5,
                // borderStyle: "solid",
                // borderWidth: 1,
                mt: { xs: 4, md: 8 },
                // p: { xs: 2 },
                mx: { md: 2 * -1 },
              }}
            >
              <Container disableGutters maxWidth="sm">
                {accordionData.map((acc) => {
                  return (
                    <Accordion
                      elevation={0}
                      sx={{
                        background: "none",
                        border: "none",
                        px: 0,
                        [`&:before`]: { display: "none" },
                      }}
                      disableGutters
                      expanded={expanded === acc.id}
                      key={acc.id}
                      onChange={handleChange(acc.id)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon color="disabled" />}
                        aria-controls={`${acc.id}-content`}
                        id={`${acc.id}-header`}
                      >
                        <Typography component="h2">
                          <Typography
                            component="span"
                            sx={{
                              borderBottom: "3px solid",
                              borderColor: acc.color,
                            }}
                            variant="subtitle1"
                          >
                            {acc.title}
                          </Typography>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          color="textSecondary"
                          gutterBottom
                          variant="body2"
                        >
                          {acc.text}
                        </Typography>
                        <Box
                          sx={{
                            lineHeight: 0,
                            mt: { xs: 2, sm: 3 },
                            display: { lg: "none" },
                            border: "1px solid",
                            borderColor: "text.primary",
                            borderRadius: 2,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <Image
                            alt="Translate"
                            height="600px"
                            src={acc.image}
                            width="900px"
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Container>
            </Box>
          </Grid>
          <Grid
            container
            flexDirection="column"
            item
            justifyContent="center"
            lg={7}
            sx={{ position: "relative" }}
            xs={12}
          >
            {accordionData.map((acc) => {
              return (
                <Fade in={expanded === acc.id}>
                  <Paper
                    elevation={6}
                    sx={{
                      border: "1px solid",
                      borderColor: "text.primary",
                      borderRadius: 5,
                      display: { xs: "none", lg: "block" },
                      lineHeight: 0,
                      overflow: "hidden",
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <Image
                      alt="Translate"
                      height="600px"
                      src={acc.image}
                      width="900px"
                    />
                  </Paper>
                </Fade>
              );
            })}
          </Grid>
        </Grid>
      </Container>
    </Root>
  );
};

export default ConferencesPage;
