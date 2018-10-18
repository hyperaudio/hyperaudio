import React from "react";
import { func } from "prop-types";

const withObfuscation = ObfuscatedButton => props => {
  const { email, headers, text, preText, children, ...others } = props;
  const reverseString = s =>
    s
      .split("")
      .reverse()
      .join("");
  const combineHeaders = (searchParams = {}) =>
    Object.keys(searchParams)
      .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
      .join("&");
  const createContactLink = (e, h) => {
    let link;
    if (e) {
      link = `mailto:${e}`;
      if (h) {
        link += `?${combineHeaders(h)}`;
      }
    }
    return link;
  };
  const handleClickObfuscatedClick = event => {
    event.preventDefault();
    window.location.href = createContactLink(email, headers);
  };
  const CustomTextButton = () => (
    <ObfuscatedButton
      {...others}
      onClick={event => handleClickObfuscatedClick(event)}
      href="obfuscated"
    >
      {text}
    </ObfuscatedButton>
  );
  const AddressTextButton = () => (
    <ObfuscatedButton
      {...others}
      onClick={event => handleClickObfuscatedClick(event)}
      href="obfuscated"
    >
      {preText}{" "}
      <span style={{ direction: "rtl", unicodeBidi: "bidi-override" }}>
        {reverseString(email) || children}
      </span>
    </ObfuscatedButton>
  );
  return text ? <CustomTextButton /> : <AddressTextButton />;
};

export default withObfuscation;

withObfuscation.propTypes = {
  onClick: func
};

withObfuscation.defaultProps = {
  onClick: null
};
