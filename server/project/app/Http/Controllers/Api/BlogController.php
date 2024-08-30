<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Blog::all();

        return response()->json(compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "title" => "required|string",
            "image" => "required|image",
            "description" => "required|string",
            "tags" => "required|string"
        ]);

        $image = $request->file('image');
        $filename = Str::random() . "." . $image->extension();
        $image_url = Storage::disk('public')->putFileAs('uploads/blogs', $image, $filename);

        $data = $request->user()->blogs()->create([
            "title" => $request->title,
            "image_url" => $image_url,
            "description" => $request->description,
            "tags" => $request->tags,
        ]);

        return response()->json(compact('data'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            throw new InvariantException("blog not found", 400);
        }

        return response()->json(["data" => $blog]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $values = $request->validate([
            "title" => "string",
            "image" => "image",
            "description" => "string",
            "tags" => "string",
        ]);

        $blog = Blog::find($id);
        if (!$blog) {
            throw new InvariantException("blog not found", 400);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::random() . "." . $image->extension();
            $image_url = Storage::disk('public')->putFileAs('uploads/blogs', $image, $filename);
            $values["image_url"] = $image_url;
        }

        $blog->update($values);

        return response()->json(["data" => $blog]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            throw new InvariantException("blog not found", 400);
        }

        $blog->delete();

        return response()->noContent();
    }
}
