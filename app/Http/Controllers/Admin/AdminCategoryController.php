<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class AdminCategoryController extends Controller {
    public function index(): Response { return Inertia::render('Admin/Categories',['categories'=>Category::withCount('quizzes')->get()]); }
    public function store(Request $r) {
        $r->validate(['name'=>'required|string','slug'=>'required|string|unique:categories','icon'=>'nullable|string','color'=>'nullable|string']);
        Category::create($r->only('name','slug','icon','color','description','is_active'));
        return back()->with('success','Kategori dibuat!');
    }
    public function update(Request $r, Category $category) {
        $r->validate(['name'=>'required|string','slug'=>'required|string|unique:categories,slug,'.$category->id]);
        $category->update($r->only('name','slug','icon','color','description','is_active'));
        return back()->with('success','Kategori diperbarui!');
    }
    public function destroy(Category $category) { $category->delete(); return back()->with('success','Kategori dihapus!'); }
}
