/* eslint jsx-a11y/anchor-has-content: 0 */
/* eslint react/button-has-type: 0 */
import { array, func, object, oneOfType, shape, string } from "prop-types";
import React from "react";
import styled from "styled-components";

import { lightThm } from "@hyperaudio/ui/themes";
import { font, time } from "@hyperaudio/ui/settings";

const LinkEl = styled.a`
  background: transparent;
  border-color: transparent;
  border-style: solid;
  border-width: 0 0 2px;
  color: ${({ theme }) => theme.actionColor};
  cursor: pointer;
  display: inline-block;
  font-family: ${font.sans};
  font-size: inherit;
  font-weight: 400;
  line-height: inherit;
  text-align: center;
  text-decoration: none;
  transition: color ${time.m}, transform ${time.m};
  white-space: nowrap;
  ${({ isActive, theme }) =>
    isActive
      ? `
        background-color: ${theme.actionColor};
        color: ${theme.background};
        transform: rotate(-5deg);
  `
      : ``};
`;

const Link = props => {
  const { onClick } = props;
  if (onClick) {
    return <LinkEl as="a" {...props} />;
  }
  return <LinkEl {...props} />;
};

Link.propTypes = {
  children: oneOfType([array, object, string]),
  href: string,
  onClick: func,
  theme: shape({
    actionColor: string
  }),
  to: string
};

Link.defaultProps = {
  children: null,
  href: "",
  onClick: null,
  theme: {
    actionColor: lightThm.actionColor
  },
  to: null
};

export default Link;
