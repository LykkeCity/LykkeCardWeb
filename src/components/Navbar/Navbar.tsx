import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

const {
  // tslint:disable-next-line:variable-name
  NavLink: _NavLink,
  Toolbar
  // tslint:disable-next-line:no-var-requires
} = require('rebass');

export const NavLink = styled(_NavLink)`
  text-transform: uppercase;
  color: white;
  font-weight: 300;
  letter-spacing: ${rem('1px')};
  font-size: ${rem('14px')};
  font-family: 'Akrobat';
`;

export const Navbar = styled(Toolbar)`
  background: inherit;
`;

export default () => (
  <Navbar mt={3}>
    <NavLink ml="auto" pl={180} mr={40}>
      About
    </NavLink>
    <NavLink mr={40}>Quotes</NavLink>
    <NavLink mr={40}>Features</NavLink>
    <NavLink>Fees</NavLink>
    <NavLink ml="auto" mr={40}>
      My Cards
    </NavLink>
    <NavLink>Dustin</NavLink>
  </Navbar>
);
