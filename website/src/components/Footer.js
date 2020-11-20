import NextLink from 'next/link';
import React from 'react';

import Link from '@material-ui/core/Link';

export default function Footer() {
  return (
    <div>
      <ul>
        <li>
          <NextLink href="/TOS" passHref>
            <Link>Terms of Service</Link>
          </NextLink>
        </li>
        <li>
          <NextLink href="/Licensing" passHref>
            <Link>License</Link>
          </NextLink>
        </li>
        <li>
          <NextLink href="/CLA" passHref>
            <Link>CLA</Link>
          </NextLink>
        </li>
        <li>
          <NextLink href="/COC" passHref>
            <Link>Code of Conduct</Link>
          </NextLink>
        </li>
      </ul>
    </div>
  );
}
