import {fontFace, normalize, rem} from 'polished';
import * as React from 'react';
import styled, {injectGlobal} from 'styled-components';
import {Button} from './components/Button';
import {Card} from './components/Card';
import {CardCarousel} from './components/CardCarousel';
import {CardForm} from './components/CardForm';
import {Navbar} from './components/Navbar';
import {Heading, SubHeading, Title} from './components/Typography';

const {
  Flex,
  Provider,
  Row,
  Column,
  Container,
  Absolute
  // tslint:disable-next-line:no-var-requires
} = require('rebass');

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  ${fontFace({
    fileFormats: ['otf'],
    fontFamily: 'Akrobat',
    fontFilePath: `${process.env.PUBLIC_URL}/fonts/Akrobat-Regular`,
    fontStretch: '',
    fontStyle: '',
    fontVariant: '',
    fontWeight: '',
    localFonts: [''],
    unicodeRange: {} as any
  }) as any}
  ${normalize() as any}
  * { box-sizing: border-box; }
`;

const Top = styled(Absolute)`
  background: black;
  & > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.25;
    background-image: radial-gradient(
      circle at 50% -1%,
      #f1f5ff,
      rgba(117, 118, 124, 0)
    );
  }
  height: ${rem('900px')};
  z-index: -2;
`;

export const App = () => (
  <Provider>
    <Container>
      {/* tslint:disable-next-line:jsx-boolean-value */}
      <Top top left right>
        <div>&nbsp;</div>
      </Top>
      <Navbar />
      <Heading>My Lykke Cards</Heading>
      <CardCarousel>
        <Card />
      </CardCarousel>
      <Flex align="center" justify="center" mb={110}>
        <Button>Add card</Button>
      </Flex>
      <SubHeading>New LykkeCard</SubHeading>
      <Row>
        <Column>
          <CardForm />
        </Column>
        <Column>
          <Title>Total price</Title>
        </Column>
      </Row>
    </Container>
  </Provider>
);

export default App;
