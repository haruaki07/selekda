<?php

namespace App\Http\Controllers\Api;

use App\Enum\UserRole;
use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = User::all();

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:100",
            "username" => "required|string|max:15|unique:users,email",
            "email" => "required|email|unique:users,email",
            "password" => ['required', Password::min(6)->letters()->mixedCase()->numbers()],
            "date_of_birth" => "required|date",
            "phone_number" => "required|string|max:13",
            "profile_picture" => "required|image",
            "role" => ["required", Rule::enum(UserRole::class)]
        ]);

        $pp = $request->file('profile_picture');
        $filename = Str::random() . "." . $pp->extension();
        $profile_picture = Storage::disk('public')->putFileAs('uploads/pp', $pp, $filename);

        $data = User::create([
            "name" => $request->name,
            "username" => $request->username,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "date_of_birth" => $request->date_of_birth,
            "phone_number" => $request->phone_number,
            "profile_picture" => $profile_picture,
            "role" => $request->role
        ]);

        return response()->json(compact('data'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            throw new InvariantException("user not found", 400);
        }

        return response()->json(["data" => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "string|max:100",
            "username" => "string|max:15|unique:users,email",
            "email" => "email|unique:users,email",
            "password" => [Password::min(6)->letters()->mixedCase()->numbers()],
            "date_of_birth" => "date",
            "phone_number" => "string|max:13",
            "profile_picture" => "image",
            "role" => [Rule::enum(UserRole::class)]
        ]);

        $values = $request->except(['username', 'email']);

        $user = User::find($id);
        if (!$user) {
            throw new InvariantException("user not found", 400);
        }

        if ($request->hasFile('profile_picture')) {
            $pp = $request->file('profile_picture');
            $filename = Str::random() . "." . $pp->extension();
            $profile_picture = Storage::disk('public')->putFileAs('uploads/pp', $pp, $filename);
            $values["profile_pricture"] = $profile_picture;
        }

        if ($request?->username !== $user->username) {
            $values["username"] = $request->username;
        }

        if ($request?->email !== $user->email) {
            $values["email"] = $request->email;
        }

        $user->update($values);

        return response()->json(["data" => $user], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            throw new InvariantException("user not found", 400);
        }

        $user->delete();

        return response()->noContent();
    }
}
