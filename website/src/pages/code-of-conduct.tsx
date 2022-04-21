import React from 'react';
import type { NextPage } from 'next';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Root = styled('main', {
  // shouldForwardProp: (prop: any) => prop !== 'isActive',
})(() =>
  // {theme}
  ({}),
);

const CodeOfConduct: NextPage = () => (
  <Root>
    <Container fixed maxWidth="md" sx={{ py: { xs: 6, lg: 12 } }}>
      <Typography variant="h1" gutterBottom>
        Hyperaudio Code of Conduct
      </Typography>
      <Typography variant="h2" gutterBottom>
        (Community Participation Guidelines)
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Introduction
      </Typography>
      <Typography variant="body2" gutterBottom>
        The Hyperaudio Team is committed to building a safe, welcoming, harassment-free culture for everyone. We not
        only strive for an environment that is free from hostility; but also one that is actively welcoming and
        inclusive. By celebrating diversity, we believe that together we can build a stronger and more welcoming
        community.
      </Typography>
      <Typography variant="body2" gutterBottom>
        The Hyperaudio community is active in a number of social spaces:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            Slack
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            GitHub
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Twitter
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Google Groups
          </Typography>
        </li>
      </ul>
      <Typography variant="body2" gutterBottom>
        And on the Hyperaudio Platform itself.
      </Typography>
      <Typography variant="body2" gutterBottom>
        What follows is a description of our values and behaviour that we hope will ensure vibrant and safe places in
        which to express ourselves and be creative.
      </Typography>
      <Typography variant="body2" gutterBottom>
        We’ll also outline what you can do if you feel that behaviour does not fit with our or even your* values.
      </Typography>
      <Typography variant="body2" gutterBottom>
        *this document should evolve and so we welcome feedback on how we can improve it as we move forward together
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Values
      </Typography>
      <Typography variant="body2" gutterBottom>
        We strive to create a welcoming and inclusive culture that empowers and encourages people to be collaboratively
        creative, whether writing code or mixing media. The atmosphere we seek requires an open exchange of ideas
        balanced by thoughtful guidelines:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            Practice empathy and humility.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Allow room for others in any conversation.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Seek to understand your fellow community member’s context.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Presume the value of others. Everyone’s ideas, skills, and contributions have value.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Be kind in all interactions and communications, especially when debating the merits of different options.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Be direct, constructive and positive.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Treat other people’s identities and cultures with respect. Make an effort to say or spell people’s names
            correctly and refer to them by their chosen pronouns.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Strive to build tools that are open and free technology for public use. Activities that aim to foster public
            use, not private gain, are prioritised.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Work to ensure that the community is well-represented in the planning, design, and implementation of civic
            tech. This includes encouraging participation from women, minorities, and traditionally marginalized groups.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Actively involve community groups and those with subject matter expertise in the decision-making process.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Provide an environment where people are free from discrimination or harassment.
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            Encourage all voices. Help new perspectives be heard and listen actively.
          </Typography>
        </li>
      </ul>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Unacceptable behaviour
      </Typography>
      <Typography variant="body2" gutterBottom>
        To help community members understand the kind of behaviours that run counter to the culture we seek to foster,
        verbal, written or audiovisual comment or physical conduct based on the following is unwelcome:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            race
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            religion
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            colour
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            sex (with or without sexual conduct and including pregnancy and sexual orientation involving transgender
            status/gender identity, and sex-stereotyping)
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            national origin
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            age
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            disability (physical or mental)
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            genetic information
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            sexual orientation
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            gender identity
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            parental status
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            marital status
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            socioeconomic status
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            accent
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            language
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            illness (physical or mental)
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            body size
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            neuro(a)typicality
          </Typography>
        </li>
      </ul>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Reporting unacceptable behaviour
      </Typography>
      <Typography variant="body2" gutterBottom>
        The behaviours listed in this section undermine the culture of inclusion and respect that we are trying to build
        within the Hyperaudio community. We encourage you to report incidents of unacceptable behaviour to
        safespace@hyperaud.io so that we can take any necessary steps to ensure that we have a safe and welcoming team.
      </Typography>
      <Typography variant="body2" gutterBottom>
        The report will be sent to our community representative who will triage and call together appropriate members of
        the Hyperaudio team to decide upon the necessary action. You will be kept informed at all stages of the process
        and all details will be kept private and your anonymity guaranteed.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
        Credits
      </Typography>
      <Typography variant="body2" gutterBottom>
        The Hyperaudio Team is greatly appreciative of the multiple sources that we drew from to build this Code of
        Conduct, including:
      </Typography>
      <ul>
        <li>
          <Typography variant="body2" gutterBottom>
            <a href="https://18f.gsa.gov/code-of-conduct/">TTS Code of Conduct</a>
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            <a href="https://github.com/codeforamerica/codeofconduct">Code for America Code of Conduct</a>
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            <a href="https://geekfeminism.org/about/code-of-conduct/">Geek Feminism Code of Conduct</a>
          </Typography>
        </li>
        <li>
          <Typography variant="body2" gutterBottom>
            <a href="https://www.mozilla.org/en-US/about/governance/policies/participation/">
              Mozilla Community Participation Guidelines
            </a>
          </Typography>
        </li>
      </ul>
      <Typography variant="body2" gutterBottom>
        Dated: April 2022
      </Typography>
    </Container>
  </Root>
);

export default CodeOfConduct;
