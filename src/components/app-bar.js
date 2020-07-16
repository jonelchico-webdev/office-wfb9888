import React, { useState, useContext, useEffect, Fragment, useRef } from 'react';
import clsx from 'clsx';
import { AppBar, Toolbar, IconButton, MenuItem, Menu, Typography, Avatar, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import LanguageOutlined from '@material-ui/icons/LanguageOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountIcon from '@material-ui/icons/AccountCircleOutlined';
import useLanguages from '../hooks/use-languages';
import { LanguageContext, ZH, EN } from '../language-context';
import MenuFoldIcon from '../icons/menu-fold';
import MenuUnfoldIcon from '../icons/menu-unfold';
import { LayoutContext } from '../layout-context';
import { LOGIN, PERSONAL_INFORMATION } from '../paths';
import { TabButton, TabButtonContainer } from '../components/tab-button';
import { ROOT } from '../paths';
import Cookies from 'universal-cookie';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'

import Notifications from './notification-messages'

import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  padding: {
    padding: theme.spacing(1)
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      //marginLeft: drawerWidth,
      //width: calc(100% - ${drawerWidth}px),
    },
    [theme.breakpoints.down('xs')]: {
      //marginLeft: 0,
      //width: '100%',
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    display: 'flex',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  menuDesktopButton: {
    display: 'none',
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuItemSelected: {
    backgroundColor: theme.palette.background.selectedPrimary
  },
  avatar: {
    marginRight: 10,
  },
  hoverPointer: {
    cursor: 'pointer'
  },
  button: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid #D0DBE5',
    boxShadow: 'none',
    borderRadius: 0,
    display: 'flex',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingLeft: theme.spacing(1)
    
  },
  buttonContainer: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      alignItems: 'flex-end',
      height: 65,
      marginBottom: -1,
    },
  },
}));

export default withRouter(function MyAppBar(props) {
  const { handleMobileDrawerToggle, handleDesktopDrawerToggle, isDrawerDesktopOpen } = useContext(LayoutContext);
  const classes = useStyles();
  const cookies = new Cookies()
  const theme = useTheme();
  const strings = useLanguages(ROOT);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [notiAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { language, setLanguage } = useContext(LanguageContext);
  const { history } = props
  const [tabSelectedIndex] = useState(0)

  const noScrollBar = useRef(null)

  if (!props.testArr.find(o => (o.url === history.location.pathname)) &&
    history.location.pathname.split('/').length <= 4 &&
    history.location.pathname !== "/" &&
    history.location.state
  ) {
    props.testArr.push({
      url: history.location.pathname,
      label: history.location.state
    })
  }

  useEffect(() => {
    if (props.testArr.find(o => (o.url === history.location.pathname))) {
      let element = document.getElementById(history.location.state)
      if(element) {
        element.scrollIntoView({ behavior: "auto" })
      }
    }
  }, [history.location.pathname, history.location.state, props.testArr, props.testArr.length])

  const [refresh, setRefresh] = useState(true)

  function handleClickHandler(url) {
    history.push(url)
  }
  /* END */

  // function logoIconButton() {
  //   props.setTestArr([])
  //   history.push("/")
  // }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }
  function handleMenuClose() {
    setAnchorEl(null);
    setAccountAnchorEl(null);
    handleMobileMenuClose();
  }
  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }
  function signOut() {
    cookies.remove("ID", { path: "/" })
    cookies.remove("JWT", { path: "/" })
    cookies.remove("Username", { path: "/" })
    cookies.remove("Logged", { path: "/" })
    cookies.remove("userType", { path: "/" })
    props.setTestArr([])
    history.push(LOGIN)
  }

  function scrollLeft() {
    let scrollBar = document.getElementById('noScrollAppBar')
    scrollBar.scrollLeft -= 200
  }

  function scrollRight() {
    let scrollBar = document.getElementById('noScrollAppBar')
    scrollBar.scrollLeft += 200
  }

  const languageMenuId = 'language-menu';
  const renderLanguageMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={languageMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem className={language === ZH ? classes.menuItemSelected : ''} onClick={() => {
        setLanguage(ZH);
        handleMenuClose();
      }}>{strings.chineseLanguage}</MenuItem>
      {/* <MenuItem className={language === ZHT ? classes.menuItemSelected : ''} onClick={() => {
        setLanguage(ZHT);
        handleMenuClose();
      }}>{strings.chineseTaiwanLanguage}</MenuItem> */}
      <MenuItem className={language === EN ? classes.menuItemSelected : ''} onClick={() => {
        setLanguage(EN);
        handleMenuClose();
      }}>{strings.englishLanguage}</MenuItem>
    </Menu>
  );
  const accountMenuId = 'account-menu';
  const renderAccountMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={accountAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(accountAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        handleMenuClose();
        history.push({ pathname: `${PERSONAL_INFORMATION}/${cookies.get('Username')}`, state: 'personalInformation' });
      }}>{strings.personalInformation}</MenuItem>
      <MenuItem onClick={() => {
        handleMenuClose()
        history.push({ pathname: `${PERSONAL_INFORMATION}/${cookies.get('Username')}`, state: 'personalInformation' });
      }}>{strings.changePassword}</MenuItem>
      <MenuItem onClick={signOut}>{strings.signOut}</MenuItem>
    </Menu>
  );
  const mobileMenuId = 'menu-mobile';
  const renderMobileMenu = (
   
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
      {
      cookies.get("Logged") === "true" ?
      <Notifications notiAnchor={notiAnchorEl} icon={true} history={history}/>
      :
      null
    }
        {/* <IconButton aria-label="Show new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton> */}
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={(event) => setAccountAnchorEl(event.currentTarget)}>
        <IconButton aria-label="Account"
          aria-controls="account-menu"
          aria-haspopup="true"
          color="inherit">
          <AccountIcon />
        </IconButton>
        <p>{cookies.get('Username')}</p>
      </MenuItem>
      <MenuItem onClick={(event) => setAnchorEl(event.currentTarget)}>
        <IconButton
          aria-label="Languages"
          aria-controls="languages-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <LanguageOutlined color="primary" />
        </IconButton>
        <p>Languages</p>
      </MenuItem>
    </Menu>
  ); 

  return <div>
    <AppBar position="fixed" className={clsx(classes.appBar, {
      [classes.appBarShift]: isDrawerDesktopOpen,
    })} elevation={0}
    >
      <Toolbar disableGutters={false}>
        <div className={classes.sectionDesktop}>
        <img
              alt="Profile Picture"
              src="/logo-blue.png"
              style={{ maxWidth: 160, marginRight: 30 }}
            />
          {/* <Logo
            // src={logo}

            style={{ maxWidth: 160, marginRight: 30 }}
            onClick={() => logoIconButton()}
            className={classes.hoverPointer}
          /> */}
          {/* <Typography style={{ marginRight: 24 }} className={classes.padding} variant="h6" classes={{ root: classes.appName }} color="textPrimary">
            {strings.appName}
          </Typography> */}
        </div>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={handleMobileDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon htmlColor={theme.palette.text.primary} />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={handleDesktopDrawerToggle}
          className={classes.menuDesktopButton}
        >
          {isDrawerDesktopOpen ?
            <MenuFoldIcon htmlColor={theme.palette.text.primary} />
            :
            <MenuUnfoldIcon htmlColor={theme.palette.text.primary} />
          }
        </IconButton>
	{props.testArr.length >= 13 ? <div className={classes.buttonContainer} style={{paddingLeft: 1, paddingRight:1}}><IconButton className={classes.button} onClick={scrollLeft} > <ArrowBackIos style={{ fontSize: "0.75rem", }} /> </IconButton> </div>: null}
        <TabButtonContainer ref={noScrollBar} testArr={props.testArr} tabSelectedIndex={tabSelectedIndex}>
          {
            props.testArr.map((o, idx) => {
              let arr = props.testArr
              return <Fragment>
                <TabButton
                  ref={o.ref}
                  key={idx}
                  label={o.label}
                  index={idx}
                  setRefresh={setRefresh}
                  refresh={refresh}
                  history={history}
                  testArr={arr}
                  variant="scrollable"
                  clickFunction={() => handleClickHandler(o.url)}
                  selected={history.location.pathname === o.url}
                />
              </Fragment>
            })
          }

        </TabButtonContainer>
        {props.testArr.length >= 13 ? <div className={classes.buttonContainer} style={{paddingLeft: 1, paddingRight:2}}><IconButton className={classes.button} onClick={scrollRight}> <ArrowForwardIos style={{ fontSize: "0.75rem", }} /> </IconButton> </div>: null}
        {props.testArr.length < 13 ? <div className={classes.grow} /> : null}
        <div className={classes.sectionDesktop}>
          {/* <IconButton aria-label="Show new notifications" 
          size="small" color="inherit">
          <Badge badgeContent={17} color="secondary">
            <NotificationsIcon htmlColor={theme.palette.text.primary} fontSize="large" />
          </Badge>
          </IconButton>  */}
          {
            cookies.get("Logged") === "true" && cookies.get("userType") === "staff" ?
            <Notifications history={history}/>
            :
            null
          }
          <Button
            aria-label="Account"
            aria-controls={accountMenuId}
            aria-haspopup="true"
            onClick={(event) => setAccountAnchorEl(event.currentTarget)}
            color="inherit"
          >
            <Avatar
              alt="Profile Picture"
              src="/profile2.png"
              className={classes.avatar}
            />
            <Typography color="textPrimary">{cookies.get('Username')}</Typography>
            <ExpandMoreIcon htmlColor={theme.palette.text.primary} />
          </Button>
          <IconButton
            size="small"
            edge="end"
            aria-label="Languages"
            aria-controls={languageMenuId}
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            color="inherit"
          >
            <LanguageOutlined color="primary" fontSize="large" />
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="Show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon htmlColor={theme.palette.text.primary} />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    {renderMobileMenu}
    {renderLanguageMenu}
    {renderAccountMenu}
  </div>

});