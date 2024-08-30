<?php

namespace App\Http\Controllers\Api;

use App\Enum\UserRole;
use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Comment::all();

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:100",
            "email" => "required|string|email",
            "subject" => "required|string|max:100",
            "website" => "required|string",
            "content" => "required|string",
            "blog_id" => "required|exists:blogs,id",
        ]);

        $blog =  Blog::find($request->blog_id);
        if (!$blog) {
            throw new InvariantException("invalid blog_id", 400);
        }

        $data = $request->user()->comments()->create($request->all());

        return response()->json(compact('data'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comment =  Comment::find($id);
        if (!$comment) {
            throw new InvariantException("comment not found", 400);
        }

        return response()->json(["data" => $comment]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $values = $request->validate([
            "name" => "string|max:100",
            "email" => "string|email",
            "subject" => "string|max:100",
            "website" => "string",
            "content" => "string"
        ]);

        $comment =  Comment::find($id);
        if (!$comment) {
            throw new InvariantException("comment not found", 400);
        }

        $user = $request->user();
        if ($user->role === UserRole::User && $user->id !== $comment->user_id) {
            throw new InvariantException("forbidden access", 403);
        }

        $comment->update($values);

        return response()->json(["data" => $comment]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comment =  Comment::find($id);
        if (!$comment) {
            throw new InvariantException("comment not found", 400);
        }

        $user = request()->user();
        if ($user->role === UserRole::User && $user->id !== $comment->user_id) {
            throw new InvariantException("forbidden access", 403);
        }

        $comment->delete();

        return response()->noContent();
    }
}
