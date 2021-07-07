<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;

class ApiController extends Controller
{
    public function register(Request $request)
    {
        static $rules = [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'cpf' => 'required|numeric|digits:11|unique:users,cpf',
            'pis' => 'required|numeric|digits:11|unique:users,pis',
            'address_zipCode' => 'required|string|min:9|max:9',
            'address_country' => 'required|string',
            'address_state' => 'required|string',
            'address_city' => 'required|string',
            'address_street' => 'required|string',
            'address_number' => 'required|string',
            'address_complement' => 'max:255',
            'password' => 'required|string|min:6|max:50'
        ];

        $validator = Validator::make($request->all(), $rules, User::$messages);
        if ($validator->fails()) {
            return $this->error($validator->errors());
        }

        $user = new User;
        $user->fill($request->all());
        $user->password = bcrypt($request->password);
        $user->save();

        try {
            $token = JWTAuth::fromUser($user);

            if (!$token) {
                return $this->error('Não foi possível efetuar o cadastro');
            }
        } catch (JWTException $e) {
            return $this->error('Não foi possível criar token, avise o suporte');
        }

        // Token criado, retorna com resposta de sucesso e token jwt
        return $this->success('Cadastro efetuado com sucesso', $token, 'token');
    
    }

    public function githubUrl()
    {

        $url = Socialite::driver('github')->stateless()->redirect()->getTargetUrl();
        return $this->success('Url gerada com sucesso', $url, 'url');
    }

    public function githubLogin()
    {

        $user = Socialite::driver('github')->stateless()->user();

        $user = User::firstOrCreate([
            'email' => $user->email
        ], [
            'name' => $user->name,
            'password' => bcrypt(Str::random(24)),
            'status_register' => 0

        ]);

        //Credenciais inválidas
        try {
            $token = JWTAuth::fromUser($user);

            if (!$token) {
                return $this->error('As credenciais de login são inválidas');
            }
        } catch (JWTException $e) {
            return $this->error('Não foi possível criar token, avise o suporte');
        }

        // Token criado, retorna com resposta de sucesso e token jwt
        return response()->json(['status' => 200, 'message' => 'Login efetuado', 'token' => $token, 'status_register' => $user->status_register], 200);

    }

    public function authenticate(Request $request)
    {
        $login = $request->login;

        if (is_numeric($login)) {
            $field = 'cpf';
            $rules = [
                'cpf' => 'required|numeric|digits:11',
                'password' => 'required|string'
            ];
        } else {
            $rules = [
                'email' => 'required|email',
                'password' => 'required|string'
            ];
            $field = 'email';
        }

        $request->$field = $login;

        $credentials = [
            $field => $login,
            'password' => $request->password
        ];


        //validar credenciais
        $validator = Validator::make($credentials, $rules, [
            'cpf.digits' => 'O campo CPF ou PIS deve ter 11 dígitos.',
            'email.required' => 'Email, CPF ou PIS precisa ser informado para efetuar o login.'
        ]);

        //falha no envio de resposta se a solicitação não for válida
        if ($validator->fails()) {
            return $this->error($validator->errors());
        }

        //Credenciais inválidas
        try {
            $token = JWTAuth::attempt($credentials);

            if (!$token) {
                $credentials = [
                    'pis' => $login,
                    'password' => $request->password
                ];

                $token = JWTAuth::attempt($credentials);
            }

            if (!$token) {
                return $this->error('As credenciais de login são inválidas');
            }
        } catch (JWTException $e) {
            return $this->error('Não foi possível criar token, avise o suporte');
        }

        // Token criado, retorna com resposta de sucesso e token jwt
        return $this->success('Login efetuado', $token, 'token');
    }

    public function logout(Request $request)
    {
        //valid credential
        $validator = Validator::make($request->only('token'), [
            'token' => 'required'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return $this->error($validator->errors());
        }

        //Request is validated, do logout        
        try {
            JWTAuth::invalidate($request->token);

            return $this->success('Logout efetuado com sucesso');
        } catch (JWTException $exception) {
            return $this->error('Não foi possível efetuar logout, avise o suporte');
        }
    }

    public function get_user(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        $user = JWTAuth::authenticate($request->token);

        return $this->success('Dados cadastrais listados', $user, 'user');
    }

    public function edit_user(Request $request)
    {
        $user = JWTAuth::authenticate($request->token);

        if (isset($user->id)) {

            $rules = [
                'name' => 'required|string',
                'cpf' => 'required|numeric|digits:11|unique:users,cpf,' . $user->id,
                'pis' => 'required|numeric|digits:11|unique:users,pis,' . $user->id,
                'address_zipCode' => 'required|string|min:9|max:9',
                'address_country' => 'required|string',
                'address_state' => 'required|string',
                'address_city' => 'required|string',
                'address_street' => 'required|string',
                'address_number' => 'required|string',
                'address_complement' => 'max:255',
            ];


            $validator = Validator::make($request->all(), $rules, User::$messages);
            if ($validator->fails()) {
                return $this->error($validator->errors());
            }

            $user->fill($request->all());

            unset($user->email);
            unset($user->password);
            $user->status_register = 1;
            if ($user->save()) {
                return $this->success('Dados atualizados com sucesso', $user, 'user');
            }
            return $this->error('Erro ao atualizar dados');
        }

        return $this->error('Usuário não encontrada');
    }

    public function delete_user(Request $request)
    {
        //valid credential
        $validator = Validator::make($request->only('token'), [
            'token' => 'required'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return $this->error($validator->errors());
        }

        $user = JWTAuth::authenticate($request->token);
        // Request is validated, do logout        
        try {
            JWTAuth::invalidate($request->token);
            if($user->delete()){
                return $this->success('Conta excluída com sucesso');
            }

        } catch (JWTException $exception) {
            return $this->error('Não foi possível efetuar logout, avise o suporte');
        }
    }
}
