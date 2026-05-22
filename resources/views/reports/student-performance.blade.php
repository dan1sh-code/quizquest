<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Performa Siswa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        h1 {
            text-align: center;
            color: #7C3AED;
            margin-bottom: 30px;
            font-size: 24px;
        }
        .report-info {
            margin-bottom: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #7C3AED;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <h1>📊 Laporan Performa Siswa</h1>
    <div class="report-info">
        <p>Laporan Dihasilkan: {{ date('d/m/Y H:i:s') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Email</th>
                <th>Level</th>
                <th>XP</th>
                <th>Total Attempt</th>
                <th>Rata-rata Skor</th>
                <th>Pass Rate</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $student)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $student['name'] }}</td>
                <td>{{ $student['email'] }}</td>
                <td>{{ $student['level'] }}</td>
                <td>{{ number_format($student['xp']) }}</td>
                <td>{{ $student['total_attempts'] }}</td>
                <td>{{ $student['avg_score'] }}</td>
                <td>{{ $student['pass_rate'] }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>QuizQuest Platform © 2024 | Laporan Rahasia</p>
    </div>
</body>
</html>
