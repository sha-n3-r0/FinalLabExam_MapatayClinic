<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    protected $fillable = ['diagnosis', 'visit_date', 'prescription'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
