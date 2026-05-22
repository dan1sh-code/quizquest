@extends('layouts.admin') {{-- Sesuaikan dengan nama layout utama kamu --}}

@section('content')
<div class="container mx-auto p-6">
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800">Tambah Kategori Baru</h1>
        <p class="text-sm text-slate-500">Silakan masukkan informasi kategori kuis baru.</p>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm max-w-lg">
        {{-- Form action mengarah ke route store untuk menyimpan data --}}
        <form action="{{ route('category.store') }}" method="POST">
            @csrf
            
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-slate-700 mb-2">Nama Kategori</label>
                <input type="text" name="name" id="name" class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Contoh: Fisika, Sejarah, dll" required>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                {{-- Tombol Batal kembali ke halaman daftar kategori --}}
                <a href="{{ route('category.index') }}" class="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Batal</a>
                <button type="submit" class="px-4 py-2 text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition">Simpan Kategori</button>
            </div>
        </form>
    </div>
</div>
@endsection