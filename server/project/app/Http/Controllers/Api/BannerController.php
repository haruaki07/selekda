<?php

namespace App\Http\Controllers\Api;

use App\Enum\BannerStatus;
use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Banner::all();

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
            "status" => ["required", Rule::enum(BannerStatus::class)],
        ]);

        $image = $request->file('image');
        $filename = Str::random() . "." . $image->extension();
        $image_url = Storage::disk('public')->putFileAs('uploads/banners', $image, $filename);

        $data = Banner::create([
            "title" => $request->title,
            "image_url" => $image_url,
            "description" => $request->description,
            "status" => $request->status,
        ]);

        return response()->json(compact('data'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            throw new InvariantException("banner not found", 400);
        }

        return response()->json(["data" => $banner]);
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
            "status" => [Rule::enum(BannerStatus::class)],
        ]);

        $banner = Banner::find($id);
        if (!$banner) {
            throw new InvariantException("banner not found", 400);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::random() . "." . $image->extension();
            $image_url = Storage::disk('public')->putFileAs('uploads/banners', $image, $filename);
            $values["image_url"] = $image_url;
        }

        $banner->update($values);

        return response()->json(["data" => $banner]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            throw new InvariantException("banner not found", 400);
        }

        $banner->delete();

        return response()->noContent();
    }
}
