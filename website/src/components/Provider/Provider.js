import { ThemeProvider } from '@material-ui/core/styles';

import useTheme from 'src/hooks/useTheme';

export default function Provider(props) {
  const theme = useTheme();
  return <ThemeProvider {...props} theme={theme} />;
}
