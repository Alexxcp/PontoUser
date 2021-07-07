import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask'
import { CircularProgress, InputAdornment } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { change, cep, index } from '../../store/actions/account.action'




const TextMaskCustomCep = (props) => {
  const { inputRef, ...other } = props;
  let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={mask}
      guide={false}
    />
  )
}

const TextMaskCustomCpf = (props) => {
  const { inputRef, ...other } = props;
  let mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={mask}
      guide={false}
    />
  )
}

const TextMaskCustomPis = (props) => {
  const { inputRef, ...other } = props;
  let mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, '-', /\d/];

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={mask}
      guide={false}
    />
  )
}

export default function AddressForm() {
  const dispatch = useDispatch();
  const { user, error } = useSelector(state => state.accountReducer);

  const [state, setState] = React.useState({
    isLoadingCep: false,
    LoadingAccount: true
  })

  React.useEffect(() => {
    _index();
  }, [])

  const _index = () => {
    dispatch(index()).then(res => res && setState({
      ...state,
      LoadingAccount: false
    }))
  }

  return (
    <>
    {(state.LoadingAccount) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            error={(error.name) && true}
            helperText={(error.name) && error.name[0]}
            id="name"
            name="name"
            label="Nome"
            fullWidth
            autoComplete="name"
            value={user.name || ''}
            onChange={text => {
              dispatch(change({ name: text.target.value }));
              if (error.name && delete error.name);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.cpf) && true}
            helperText={(error.cpf) && error.cpf[0]}
            id="cpf"
            type="tel"
            name="cpf"
            label="Número do CPF"
            fullWidth
            autoComplete="cpf"
            value={user.cpf || ''}
            InputProps={{
              inputComponent: TextMaskCustomCpf,
              onChange: text => {
                dispatch(change({ cpf: text.target.value }));
                if (error.cpf && delete error.cpf);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="tel"
            error={(error.pis) && true}
            helperText={(error.pis) && error.pis[0]}
            required
            id="pis"
            name="pis"
            label="Número do PIS"
            fullWidth
            autoComplete="pis"
            value={user.pis || ''}
            InputProps={{
              inputComponent: TextMaskCustomPis,
              onChange: text => {
                dispatch(change({ pis: text.target.value }));
                if (error.pis && delete error.pis);
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.address_zipCode) && true}
            helperText={(error.address_zipCode) && error.address_zipCode[0]}
            type="tel"
            id="address_zipCode"
            name="address_zipCode"
            label="CEP"
            fullWidth
            autoComplete="address_zipCode"
            InputProps={{
              inputComponent: TextMaskCustomCep,
              value: user.address_zipCode || '',
              onChange: text => {
                dispatch(change({ address_zipCode: text.target.value }));
                if (text.target.value.length > 8) {
                  setState({
                    ...state,
                    isLoadingCep: true
                  })
                  dispatch(cep(text.target.value)).then(res => res && setState({
                    ...state,
                    isLoadingCep: false
                  }))
                  if (error.address_zipCode) {
                    delete error.address_zipCode;
                  }
                }
              },
              endAdornment: (
                <InputAdornment position="start">
                  {(state.isLoadingCep) ? <CircularProgress size={32} /> : <></>}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        {(user.address_country) && delete error.address_country}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.address_country) && true}
            helperText={(error.address_country) && error.address_country[0]}
            id="address_country"
            name="address_country"
            label="País"
            fullWidth
            autoComplete="address_country"
            value={user.address_country || ''}
            disabled
          />
        </Grid>
        {(user.address_state) && delete error.address_state}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.address_state) && true}
            helperText={(error.address_state) && error.address_state[0]}
            id="address_state"
            name="address_state"
            label="Estado"
            fullWidth
            autoComplete="address_state"
            value={user.address_state || ''}
            disabled
          />
        </Grid>
        {(user.address_city) && delete error.address_city}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.address_city) && true}
            helperText={(error.address_city) && error.address_city[0]}
            id="address_city"
            name="address_city"
            label="Município"
            fullWidth
            autoComplete="address_city"
            value={user.address_city || ''}
            disabled
          />
        </Grid>
        {(user.address_street) && delete error.address_street}
        <Grid item xs={12}>
          <TextField
            required
            error={(error.address_street) && true}
            helperText={(error.address_street) && error.address_street[0]}
            id="address_street"
            name="address_street"
            label="Rua"
            fullWidth
            autoComplete="address_street"
            value={user.address_street || ''}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            error={(error.address_number) && true}
            helperText={(error.address_number) && error.address_number[0]}
            id="address_number"
            name="address_number"
            label="Número"
            fullWidth
            autoComplete="address_number"
            value={user.address_number || ''}
            onChange={text => {
              dispatch(change({ address_number: text.target.value }));
              if (error.address_number && delete error.address_number);
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={(error.address_complement) && true}
            helperText={(error.address_complement) && error.address_complement[0]}
            id="address_complement"
            name="address_complement"
            label="Complemento"
            autoComplete="address_complement"
            value={user.address_complement || ''}
            onChange={text => {
              dispatch(change({ address_complement: text.target.value }));
              if (error.address_complement && delete error.address_complement);
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
}
</>
  );
}