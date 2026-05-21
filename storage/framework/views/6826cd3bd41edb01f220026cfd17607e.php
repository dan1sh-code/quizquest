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
        <p>Laporan Dihasilkan: <?php echo e(date('d/m/Y H:i:s')); ?></p>
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
            <?php $__currentLoopData = $students; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $student): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td><?php echo e($index + 1); ?></td>
                <td><?php echo e($student['name']); ?></td>
                <td><?php echo e($student['email']); ?></td>
                <td><?php echo e($student['level']); ?></td>
                <td><?php echo e(number_format($student['xp'])); ?></td>
                <td><?php echo e($student['total_attempts']); ?></td>
                <td><?php echo e($student['avg_score']); ?></td>
                <td><?php echo e($student['pass_rate']); ?>%</td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>

    <div class="footer">
        <p>QuizQuest Platform © 2024 | Laporan Rahasia</p>
    </div>
</body>
</html>
<?php /**PATH D:\Pemrograman Web\quizquest\resources\views/reports/student-performance.blade.php ENDPATH**/ ?>