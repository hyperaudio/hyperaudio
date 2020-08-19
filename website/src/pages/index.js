/* eslint-disable jsx-a11y/anchor-is-valid */
import styled from 'styled-components';

import Layout from '../Layout';

const Test = styled.p`
  color: red;
`;

const Index = () => {
  return (
    <Layout>
      <Test>styled component</Test>
    </Layout>
  );
};

export default Index;
