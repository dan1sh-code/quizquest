<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeacherProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Teacher/Profile');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:50', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'school' => ['nullable', 'string', 'max:255'],
            'grade' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject_expertise' => ['nullable', 'string', 'max:255'],
            'education' => ['nullable', 'string', 'max:255'],
            'certification' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'portfolio' => ['nullable', 'file', 'mimes:pdf,doc,docx,ppt,pptx,jpg,jpeg,png', 'max:5120'],
        ]);

        unset($validated['avatar'], $validated['portfolio']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $validated['avatar'] = $request->file('avatar')->store('avatars/teachers', 'public');
        }

        if ($request->hasFile('portfolio')) {
            if ($user->portfolio_path) {
                Storage::disk('public')->delete($user->portfolio_path);
            }

            $file = $request->file('portfolio');
            $validated['portfolio_path'] = $file->store('portfolios/teachers', 'public');
            $validated['portfolio_name'] = $file->getClientOriginalName();
        }

        $user->update($validated);

        return back()->with('success', 'Profil guru berhasil diperbarui.');
    }
}
