<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InvariantException;
use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortfolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Portfolio::all();

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
            "description" => "required|string"
        ]);

        $image = $request->file('image');
        $filename = Str::random() . "." . $image->extension();
        $image_url = Storage::disk('public')->putFileAs('uploads/portfolios', $image, $filename);

        $data = $request->user()->portfolios()->create([
            "title" => $request->title,
            "image_url" => $image_url,
            "description" => $request->description
        ]);

        return response()->json(compact('data'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $portfolio = Portfolio::find($id);
        if (!$portfolio) {
            throw new InvariantException("portfolio not found", 400);
        }

        return response()->json(["data" => $portfolio]);
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
        ]);

        $portfolio = Portfolio::find($id);
        if (!$portfolio) {
            throw new InvariantException("portfolio not found", 400);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::random() . "." . $image->extension();
            $image_url = Storage::disk('public')->putFileAs('uploads/portfolios', $image, $filename);
            $values["image_url"] = $image_url;
        }

        $portfolio->update($values);

        return response()->json(["data" => $portfolio]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $portfolio = Portfolio::find($id);
        if (!$portfolio) {
            throw new InvariantException("portfolio not found", 400);
        }

        $portfolio->delete();

        return response()->noContent();
    }
}
