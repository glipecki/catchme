import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { Layout } from './ui-elements/layout';
import { AppRouting } from './app.routing';
import { useAuthentication } from './auth/use-authentication';
import { AuthenticationStatus } from './auth/authentication.state';
import { ProfileIcon } from './profile/profile-icon';
import { UserNotVerified } from './auth/user-not-verified';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeModeContext } from './theme/theme-mode.context';

const LazyLogin = lazy(() =>
  import('./login/login').then((m) => ({
    default: m.Login,
  }))
);

const LogoWrapper = styled(Layout)``;

export const App = () => {
  const { state: auth } = useAuthentication();
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  return (
    <>
      <ThemeIconWrapper>
        <IconButton onClick={themeMode.change} color="inherit">
          {theme.palette.mode === 'dark' ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </ThemeIconWrapper>
      <LogoWrapper>
        <a href="/">
          <img
            src="assets/cebula.webp"
            alt="Logo aplikacji"
            width="100px"
            height="91px"
          />
        </a>
      </LogoWrapper>
      {auth.state === AuthenticationStatus.Pending && (
        <Layout>
          <CircularProgress />
        </Layout>
      )}
      {auth.state === AuthenticationStatus.Logged && (
        <>
          {!auth.firebaseUser?.emailVerified && <UserNotVerified />}
          <BrowserRouter>
            <AppRouting />
          </BrowserRouter>
        </>
      )}
      {auth.state === AuthenticationStatus.NotLogged && (
        <Suspense fallback={null}>
          <LazyLogin />
        </Suspense>
      )}
      {auth.state === AuthenticationStatus.Logged && (
        <ProfileIconWrapper>
          <ProfileIcon />
        </ProfileIconWrapper>
      )}
    </>
  );
};

const ProfileIconWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 8px;
`;

const ThemeIconWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 8px;
`;
