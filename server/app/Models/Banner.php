<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "image_url",
        "description",
        "status"
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
