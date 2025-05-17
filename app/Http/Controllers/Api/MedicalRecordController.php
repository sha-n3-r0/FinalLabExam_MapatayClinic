<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Models\Patient;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Patient $patient)
    {
        $records = $patient->records()->get();
        return response()->json($records);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'diagnosis' => 'required|string',
            'visit_date' => 'required|date',
            'prescription' => 'nullable|string',
        ]);

        $patient = Patient::findOrFail($id);
        return $patient->medicalRecords()->create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicalRecord $record) 
    {
        return $record;
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $record = MedicalRecord::findOrFail($id);

        $validated = $request->validate([
            'diagnosis' => 'required|string',
            'visit_date' => 'required|date',
            'prescription' => 'nullable|string'
        ]);

        $record->update($validated);

        return response()->json($record);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        MedicalRecord::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
