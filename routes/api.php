<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\MedicalRecordController;

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::apiResource('patients', PatientController::class);
Route::apiResource('records', MedicalRecordController::class);
Route::get('patients/{id}/records', [PatientController::class, 'records']);

Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

Route::get('/patients/{patient}/records', [MedicalRecordController::class, 'index']);
Route::post('/patients/{patient}/records', [MedicalRecordController::class, 'store']);
Route::put('/records/{record}', [MedicalRecordController::class, 'update']);
Route::delete('/records/{record}', [MedicalRecordController::class, 'destroy']);