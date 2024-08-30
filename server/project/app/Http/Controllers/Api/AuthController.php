<?php

namespace App\Http\Controllers\Api;

use App\Enum\UserRole;
use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:100",
            "username" => "required|string|max:15|unique:users,email",
            "email" => "required|email|unique:users,email",
            "password" => ['required', Password::min(6)->letters()->mixedCase()->numbers()],
            "date_of_birth" => "required|date",
            "phone_number" => "required|string|max:13",
            "profile_picture" => "required|image",
        ]);

        $pp = $request->file('profile_picture');
        $filename = Str::random() . "." . $pp->extension();
        $profile_picture = Storage::disk('public')->putFileAs('uploads/pp', $pp, $filename);

        /** @var \App\Models\User */
        $user = User::create([
            "name" => $request->name,
            "username" => $request->username,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "date_of_birth" => $request->date_of_birth,
            "phone_number" => $request->phone_number,
            "profile_picture" => $profile_picture,
            "role" => UserRole::User
        ]);

        $token = $user->createToken("app")->plainTextToken;
        $data = ["token" => $token, "user" => $user];

        return response()->json(compact('data'), 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            "email" => "required|string",
            "password" => "required|string"
        ]);

        // validate email and password
        $success = Auth::attempt($data);
        if (!$success) {
            throw new InvariantException('wrong email and password combination!', 401);
        }

        /** @var \App\Models\User */
        $user = User::where(["email" => $request->email])->first();

        $token = $user->createToken("app")->plainTextToken;
        $data = ["token" => $token, "user" => $user];

        return response()->json(["data" => $data]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
