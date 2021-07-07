<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function success($msg = 'Operação realizada com sucesso', $data = [], $nameData = 'data') 
    {
        return response()->json(['status' => 200, 'success' => $msg,  $nameData => $data], 200);
    }

    public function error($msg = 'Erro ao realizer operação')
    {
        return response()->json(['status' => 400, 'error' => $msg], 200);
    }
}
