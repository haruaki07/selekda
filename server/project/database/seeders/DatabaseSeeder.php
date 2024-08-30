<?php

namespace Database\Seeders;

use App\Enum\UserRole;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'username' => 'user',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Atmin',
            'username' => 'atmin',
            'email' => 'admin@main.com',
            'role' => UserRole::Admin
        ]);
    }
}
