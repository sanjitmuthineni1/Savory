import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Menu, Typography, IconButton, AppBar, Toolbar, Box,
  Avatar, Button, Tooltip, MenuItem, TextField, Grid } from '@mui/material';
import {LocalDining, Search } from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { clearUser } from '../../redux/User/user-slice';
import { clearRecipes } from '../../redux/Recipes/recipes-slice';
import { clearInteractions } from '../../redux/Interactions/interactions-slice';
import { useAuth0 } from '@auth0/auth0-react';

const ResponsiveAppBar = () => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const savoryAuth = useSelector((state: RootState) => state.userReducer.isAuthenticated);
  const { logout } = useAuth0();
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = async () => {
    try {
      dispatch(clearUser());
      dispatch(clearRecipes());
      dispatch(clearInteractions());
      await logout({logoutParams: {to: window.location.origin}});
    } catch(error) {console.error("Error logging out: ", error);}
  }

  const username = user?.username || '';
  const userId = String(user?.id) || '';
  const img = user?.img || '';
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null); 
  const openProfileOptions = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };
  const closeProfileOptions = () => {
    setProfileAnchor(null);
  };


  return (
    <AppBar position='sticky'>
      <Toolbar>
        <Grid container justifyContent='space-between' alignItems='center' p='0 1vw'>
          <Grid container item justifyContent='flex-start' alignItems='center' sm={10} md={9} lg={8} xl={7}>
            <Grid item xs={2}><LogoButton {...{savoryAuth}}/></Grid>
            <Grid container item  alignItems='center' xs={6}>
              <NavigationButtons {...{isAuthenticated: savoryAuth}}/>
            </Grid>
          </Grid>
          <Grid container item justifyContent='flex-end' alignItems='center' sm={2} md={3} lg={4} xl={5}>
            <Grid container item justifyContent='flex-end' alignItems='center' xs={7}>
              {savoryAuth ?  <SearchBar/> : <></>}
            </Grid>
            <Grid item xs={1}>
              <ProfileButton {...{username, img, openProfileOptions}}/>
              <ProfileOptions {...{username, userId, profileAnchor, closeProfileOptions, isAuthenticated: savoryAuth, logoutHandler}}/>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

const LogoButton = ({savoryAuth}: {savoryAuth: boolean}) => {
  return(
    <>
    {
      savoryAuth ?
      <Link to='/feed'><Button sx={{p: 0}} data-testid='savory-home-button'>
        <LocalDining style={{fill: '#fefae0', height: '5.5vh', width: '5.5vh'}}/>
        <Typography style={{color: '#fefae0'}}>SAVORY</Typography>
      </Button></Link> :
      <Button sx={{p: 0}} data-testid='savory-home-button'>
        <LocalDining style={{fill: '#fefae0', height: '5.5vh', width: '5.5vh'}}/>
        <Typography style={{color: '#fefae0'}}>SAVORY</Typography>
      </Button>
    }
    </>
  );
}

const NavigationButtons = ({isAuthenticated}: {isAuthenticated: boolean}) => {
  const navMenuOptions =  isAuthenticated ? 
  [
    { to: '/', text: 'About' },
    { to: '/post/new', text: 'Add Post' },
    { to: '/feed/bookmarks', text: 'Bookmarks' },
  ] : 
  [
    { to: '/', text: 'About' },
  ];
  return (
    <>
      {navMenuOptions.map((option) => (
        <Grid item key={option.text}><Link to={option.to}>
          <Button color='cream' sx={{p: '0 .75vw'}}><Typography maxWidth='11vw'>{option.text}</Typography></Button>
        </Link></Grid>
      ))}
    </>
  );
}

const ProfileButton = ({username, img, openProfileOptions} :
  {username: string, img: string, openProfileOptions: (event: React.MouseEvent<HTMLElement>) => void}) => {
  return(
    <Tooltip title='Profile Options'>
      <IconButton onClick={openProfileOptions}>
        <Avatar alt={username} src={img} data-testid="mui-avatar">
          {!img ? username.toUpperCase().charAt(0) : ''}
        </Avatar>
      </IconButton>
    </Tooltip>
  );
}

const ProfileOptions = ({username, userId, profileAnchor, closeProfileOptions, isAuthenticated, logoutHandler} :
   {username: string, userId: string, profileAnchor: HTMLElement | null, closeProfileOptions: () => void, isAuthenticated: boolean,
     logoutHandler: () => void}) => {

    const dropDownOptions = isAuthenticated ? 
    [
      { to: `/profile/${username}`, text: 'Profile' },
      { to: `/settings`, text: 'Settings' },
    ] : [];
    return(
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeProfileOptions}
        slotProps={{paper: {style: {maxHeight: '20vh'}}}}
      >  
        {dropDownOptions.map((option, index) => (
              <MenuItem key={index} onClick={closeProfileOptions} sx={{p: 0, m: '.25vw'}}>
                <Link to={option.to}><Button variant='text' fullWidth sx={{p: 0}}>
                        <Typography>{option.text}</Typography>
                    </Button></Link>
              </MenuItem>
            ))}
        <MenuItem onClick={isAuthenticated ? logoutHandler : () => {}} sx={{p: 0, m: '.25vw'}}>
            {isAuthenticated ? <Button variant='text' fullWidth sx={{p: 0}}>
                <Typography>Logout</Typography>
            </Button> : <Link to='/login'><Button variant='text' fullWidth sx={{p: 0}}>
                <Typography>Log in</Typography>
            </Button></Link>}
          </MenuItem>    
      </Menu>
    );
}

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  function handleSearch() {
    navigate(`/feed/search/${query.toLowerCase()}`);
  }

  return (
    <Box>
        <form onSubmit={handleSearch} data-testid='savory-search-bar'>
          <Grid container alignItems='center'>
            <Grid item xs={10}>
              <TextField
              data-testid="savory-search-text"
              id="search-bar"
              variant="outlined"
              placeholder="Search"
              size="small"
              value={query}
              color='cream'
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                sx: {
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid #fefae0",
                  },
                  "&:hover": {
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #fefae0",
                    },
                  },
                  input: {
                    color: '#fefae0'
                  },
                }}}
              />
          </Grid>  
          <Grid item xs={2}><IconButton type="submit" aria-label="search">
            <Search style={{ fill: "#fefae0", height: '3.5vh', width: '3.5vh'}} />
          </IconButton></Grid>  
          </Grid>  
        </form>
    </Box>
);}

export default ResponsiveAppBar;