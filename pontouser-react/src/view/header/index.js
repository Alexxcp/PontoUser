import React from 'react'
import { logout } from '../../store/actions/auth.action'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Link as Linkhref } from '@material-ui/core'
import { FaHome, FaUser, FaWhatsapp, FaSignOutAlt } from 'react-icons/fa'
import { MdMenu } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'




export default function Header(props) {
    const dispatch = useDispatch()
    const [state, setState] = React.useState({
        open: false,
        logout: false
    })

    return (
        <>
            {(window.innerWidth < 577) ?
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setState({ open: true })}>
                            <MdMenu />
                        </IconButton>
                        <Typography variant="h6">
                            {props.title}
                        </Typography>
                        {props.button}
                    </Toolbar>
                </AppBar>
                :
                <nav className="header navbar navbar-expand-lg navbar-light bg-white p-0">
                    <div className="container">
                        <Link className="navbar-brand" to="/home">
                            <img src="/logo.png" alt="AlexPereira" height="50" />
                        </Link>

                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">
                                    <FaHome className="icon-lg mr-2" /> Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/account/edit">
                                    <FaUser className="icon-lg mr-2" /> Minha conta
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Linkhref className="nav-link" href="https://api.whatsapp.com/send?phone=5511969646373&text=Ol%C3%A1%2C%20Alex!%20Preciso%20de%20ajuda" target="_blank">
                                    <FaWhatsapp className="icon-lg mr-2" /> Ajuda
                                </Linkhref>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" onClick={() => dispatch(logout()).then(res => (res === true) && setState({
                                    ...state,
                                    logout: true
                                }))}>
                                    <FaSignOutAlt className="icon-lg mr-2" /> Sair
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            }
            <Drawer anchor="left" open={state.open} onClose={() => setState({ open: false })}>
                <div style={{ width: 320, maxWidth: window.innerWidth - 70 }}>
                    <List component="nav" className="menu-mobile">
                        <ListItem>
                            <img className="img-fluid logo-mobile" src="/logo.png" alt="AlexPereira" height="60" />
                        </ListItem>

                        <Divider className="mt-2 mb-3" />

                        <ListItem
                            component={Link}
                            to="/home"
                            onClick={() => setState({ open: false })}
                        >
                            <ListItemIcon>
                                <FaHome />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>

                        <ListItem
                            component={Link}
                            to="/account/edit"
                            onClick={() => setState({ open: false })}
                        >
                            <ListItemIcon>
                                <FaUser />
                            </ListItemIcon>
                            <ListItemText primary="Minha conta" />
                        </ListItem>

                        <ListItem
                            component={Linkhref}
                            href="https://api.whatsapp.com/send?phone=5511969646373&text=Ol%C3%A1%2C%20Alex!%20Preciso%20de%20ajuda"
                            target="_blank"
                            onClick={() => setState({ open: false })}
                        >
                            <ListItemIcon>
                                <FaWhatsapp />
                            </ListItemIcon>
                            <ListItemText primary="Ajuda" />
                        </ListItem>

                        <Divider className="mt-2 mb-2" />

                        <ListItem
                            component={Link}
                            
                            onClick={() => dispatch(logout()).then(res => (res === true) && setState({
                                ...state,
                                logout: true
                            }))}
                        >
                            <ListItemIcon>
                                <FaSignOutAlt />
                            </ListItemIcon>
                            <ListItemText primary="Sair" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>

            {(state.logout) && <Redirect to="/" />}

        </>
    )
}
