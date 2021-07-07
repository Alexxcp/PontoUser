import React from 'react'
import { success } from '../../store/actions/auth.action'
import { index } from '../../store/actions/home.action'
import { Redirect } from 'react-router-dom'
import { Button, CircularProgress, Link as LinkHref } from '@material-ui/core'
import { FaFolder } from 'react-icons/fa'
import Header from '../header'
import { useDispatch } from 'react-redux'



export default function Home() {
    const dispatch = useDispatch()
    const [user, setUser] = React.useState([])
    const [isLoading, setLoading] = React.useState(true)

    dispatch(success(false))

    React.useEffect(() => {
        _index();
    }, [])

    const _index = () => {
        dispatch(index()).then(res => {
            if (res) {
                setUser(res)
                setLoading(false)
            }
        })
    }

    return (
        <>
            <Header title="Home" />
            <div className="container mt-4 pt-3">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
                    <>
                        <div className="row mb-5">
                            <div className="col-md-6 col-xs-12 justify-content-start">
                                <h3 className="font-weight-normal">Olá, <b>{user.name || 'usuário'}</b>! Seja bem vindo, abaixo documentação da <b>API PontoUser</b></h3>
                            </div>
                            <div className="col-md-6 col-xs-6 d-flex">
                                <LinkHref href="https://documenter.getpostman.com/view/13078417/Tzm3pdJQ" target="_blank" className="ml-auto">
                                    <Button variant="contained" color="secondary" size="large">
                                        <FaFolder size="1.5em" className="mr-2" />
                                        Collection Postman
                                    </Button>
                                </LinkHref>
                                <LinkHref href="https://desenvolvimento.alexpereira.net.br/docAPI.html" target="_blank" className="ml-3">
                                    <Button variant="contained" color="primary" size="large">
                                        <FaFolder size="1.5em" className="mr-2" />
                                        Doc Api
                                    </Button>
                                </LinkHref>
                            </div>
                        </div>

                        <div className="card">
                            <iframe src="https://desenvolvimento.alexpereira.net.br/docAPI.html" width="100%" height="600px"></iframe>
                        </div>
                    </>
                }
                {(user.status_register === 0) && <Redirect to="/account/edit" />}

            </div>
        </>
    )
}
