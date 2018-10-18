/* eslint jsx-a11y/anchor-has-content: 0 */
/* eslint react/button-has-type: 0 */
import { array, func, object, oneOfType, shape, string } from "prop-types";
import React from "react";
import styled from "styled-components";

import { lightThm } from "@hyperaudio/ui/themes";
import { font, time, track } from "@hyperaudio/ui/settings";
import { setSpace } from "@hyperaudio/ui/mixins";

const ButtonEl = styled.a`
  ${setSpace("pam")};
  background-color: transparent;
  border-color: ${({ theme }) => theme.actionColor};
  border-style: solid;
  border-width: 1px;
  color: ${({ theme }) => theme.actionColor};
  cursor: pointer;
  display: inline-block;
  font-family: ${font.sans};
  font-size: inherit;
  font-weight: 600;
  letter-spacing: ${track.s};
  line-height: 1em;
  outline: none;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: background ${time.m}, color ${time.m};
  white-space: nowrap;
  width: ${({ block }) => (block ? `100%` : `auto`)};
  &:hover {
    background: ${({ theme }) => theme.actionColor};
    color: ${({ theme }) => theme.background};
  }
`;

const Button = props => {
  const { onClick } = props;
  if (onClick) {
    return <ButtonEl as="button" type="button" {...props} />;
  }
  return <ButtonEl {...props} />;
};

Button.propTypes = {
  children: oneOfType([array, object, string]),
  href: string,
  onClick: func,
  theme: shape({
    actionColor: string
  }),
  to: string
};

Button.defaultProps = {
  children: null,
  href: "",
  onClick: null,
  theme: {
    background: lightThm.background,
    actionColor: lightThm.actionColor
  },
  to: null
};

export default Button;
