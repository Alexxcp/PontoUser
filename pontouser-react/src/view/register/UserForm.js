import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux'
import { change } from '../../store/actions/register.action'

export default function UserForm() {
  const dispatch = useDispatch();
  const { user, error } = useSelector(state => state.registerReducer);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Dados de acesso
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            error={(error.email) && true}
            helperText={(error.email) && error.email}
            type="email"
            id="email"
            label="Email"
            fullWidth
            autoComplete="email"
            value={user.email || ''}
            onChange={text => {
              dispatch(change({ email: text.target.value }));
              if (error.email && delete error.email);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            error={(error.password) && true}
            helperText={(error.password) && error.password}
            type="password"
            id="password"
            label="Senha"
            fullWidth
            autoComplete="password"
            value={user.password || ''}
            onChange={text => {
              dispatch(change({ password: text.target.value }));
              if (error.password && delete error.password);
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
