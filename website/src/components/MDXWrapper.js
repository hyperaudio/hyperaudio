import theme from '../theme';

const Wrapper = ({ children }) => (
  <div className="mdx">
    <style scoped>
      {`
      .mdx h1,
      .mdx h2,
      .mdx h3,
      .mdx h4,
      .mdx h5,
      .mdx h6 {
        font-family: 'Montserrat', sans-serif;
        color: ${theme.palette.primary.main};
      }
    `}
    </style>
    {children}
  </div>
);

export default Wrapper;
