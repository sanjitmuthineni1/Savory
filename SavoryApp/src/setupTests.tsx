import '@testing-library/jest-dom/extend-expect';
import React, { PropsWithChildren } from 'react';
import { RenderOptions, act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material';
import { Auth0Provider } from '@auth0/auth0-react';
import { AppStore, RootState, persistor, setupStore } from './redux/store';
import { ThemeState } from './redux/Theme/theme-slice';
import { UserState } from './redux/User/user-slice';
import { LocalRecipesState } from './redux/Recipes/recipes-slice';
import { InteractionsState } from './redux/Interactions/interactions-slice';
import createAppTheme from './app/App.theme';
import { persistStore } from 'redux-persist';
import StandardLayout from './modules/StandardLayout';
import SplashPage from './modules/pages/Splash';

// MOCK AUTH0
Object.defineProperty(window, 'crypto', {
    value: {
        subtle: {},
        getRandomValues: jest.fn(),
    },
});
export const testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkxnTXlwWWkweTNzbU5FdTdZUVpVayJ9.eyJodHRwOi8vbG9jYWxob3N0OjgwODAvc2F2b3J5L2luaXR0b3dpbml0L2VtYWlsIjoidGFzdGUudGVzdGVyQHNhdm9yeS5jb20iLCJodHRwOi8vbG9jYWxob3N0OjgwODAvc2F2b3J5L2luaXR0b3dpbml0L3JvbGVzIjoiIiwiaXNzIjoiaHR0cHM6Ly9kZXYtdDZ2c3B1YzhxcnNzYWFyYy51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjVlOGE5YmE1MTRlZDU0ZGEwYjE0MDYyIiwiYXVkIjpbImh0dHBzOi8vZGV2LXQ2dnNwdWM4cXJzc2FhcmMudXMuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2Rldi10NnZzcHVjOHFyc3NhYXJjLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDk3NDc1NTcsImV4cCI6MTcwOTgzMzk1NywiYXpwIjoiUU9objQ3SThWUXBDZDNRUzhyOTh1NnFVWkFqVkNKS3QiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.azYcv8vb8Y3PsozDzzR3uhwmrM6s1yOUyH2d6LeEYbqP2DTaGvfNbqrZ3EkX2rZcvxqQV6UZXq87ieClgeoG9l57NBAo_eDeZdT2T-RSJ6afI23RWO1StAGgW7wjL9I4XoX6_Ez6JBqKi8yoF8vvGoOZfX1OvfCUX_VGyi0LweyET6sUq0d58loSI2qv_a8PQd6iWnHyAhabbp5GSfw4wx6OiY63yM8Q6mscHY1S9AqYr3n7RCMDaL42X1Zcd3rLEm36q94pZLrMxchS8WUqXStJ_IERHUGhto0hzVbhdgsQNiVqo5CG9YOxmTYYoU4Ozx5VVHF6m2XwVbVVKE6-vw';
jest.mock('@auth0/auth0-spa-js', () => ({
    ...jest.requireActual('@auth0/auth0-spa-js'),
    isAuthenticated: true,
    user: {
        name: "savory.taste.tester",
        email: "taste.tester@savory.com",
        picture: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    getAccessTokenWithPopup: jest.fn().mockResolvedValue(testToken),
    logout: jest.fn(),
}));


// INITIAL EMPTY STATE
const testState: Partial<RootState> = {
    userReducer: {
        user: null,
        isAdmin: false,
        isAuthenticated: false,
    } as UserState,
    themeReducer: {mode: 'light',} as ThemeState,
    recipesReducer: {
        recipes: {},
        page: 1,
        sort: 'A',
    } as LocalRecipesState,
    interactionsReducer: {interactions: {},} as InteractionsState,
}
// INITIAL STATE WITH AUTHORIZED USER
export const authState = {
    ...testState,
    userReducer: {
        ...testState.userReducer,
        user: {
            id: 105,
            username: 'savory.taste.tester',
            // password: @iHV2LId!1EqDAeQ
            email: 'taste.tester@savory.com',
            img: '',
            bio: 'Hi, I am a tester for Savory!',
        },
        isAuthenticated: true,   
    }
} as Partial<RootState>;
// REUSABLE RENDER WITH REDUX
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>
    store?: AppStore
}
function routedComponents(components: {path: string, elem: JSX.Element}[]): React.ReactElement {
    return(
        <Routes>
        <Route path="/" element={<StandardLayout/>}>
            <Route index element={<SplashPage/>}/>
            {components.map((comp, index) => (
                <Route path={comp.path} element={comp.elem} key={index}/>
            ))}
            <Route path="*" element={<SplashPage/>}/>
        </Route>
        </Routes>
    );
}
export function renderWithProviders(
    components: {path: string, elem: JSX.Element}[],
    startPage: string,
    {
      preloadedState = testState,
      store = setupStore(preloadedState),
      ...renderOptions
    }: ExtendedRenderOptions = {},
  ) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
            <Auth0Provider
            domain="dev-t6vspuc8qrssaarc.us.auth0.com"
            clientId="QOhn47I8VQpCd3QS8r98u6qUZAjVCJKt"
            authorizationParams={{
                redirect_uri: `${window.location.origin}/login`,
                scope: 'openid profile email'
            }}>
            <ThemeProvider theme={createAppTheme('light')}>
                <MemoryRouter initialEntries={[startPage]}>
                {children}
                </MemoryRouter>
            </ThemeProvider>
            </Auth0Provider>
            </PersistGate>
        </Provider>);
    }
    return { store, ...render(routedComponents(components), { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react'