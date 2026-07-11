<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Incident Response Portal | State NOC</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        :root {
            --bg: #0b0f19;
            --card-bg: #161e2f;
            --text: #f8fafc;
            --text-secondary: #cbd5e1;
            --primary: #38bdf8;
            --danger: #ef4444;
            --success: #10b981;
            --border: #2e3c54;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .container {
            max-width: 600px;
            width: 100%;
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            text-align: center;
        }
        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--danger);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        p {
            color: var(--text-secondary);
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .ip-badge {
            font-family: monospace;
            background: rgba(239, 68, 68, 0.15);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 8px 16px;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 30px;
        }
        .terminal {
            background: #070913;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 15px;
            text-align: left;
            font-family: monospace;
            font-size: 0.85rem;
            color: #38bdf8;
            margin-bottom: 30px;
            overflow-x: auto;
            max-height: 200px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.95rem;
            background-color: var(--primary);
            color: #0b0f19;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
        }
        .btn:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .btn-secondary {
            background-color: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border);
            margin-right: 10px;
        }
        .btn-secondary:hover {
            background-color: rgba(255,255,255,0.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-exclamation-triangle"></i> Incident response</h1>
        <p>You have been redirected to the automated incident response console to investigate a link outage.</p>
        
        <?php
        $ip = isset($_GET['search']) ? htmlspecialchars($_GET['search']) : 'Unknown IP';
        ?>
        
        <div class="ip-badge">Target Host: <?php echo $ip; ?></div>
        
        <div class="terminal">
            <div>$ trace-route <?php echo $ip; ?></div>
            <div style="color: #cbd5e1;">Tracing route to <?php echo $ip; ?>...</div>
            <div style="color: #cbd5e1;">1  192.168.1.1 (Patna Core HQ)  0.42ms</div>
            <div style="color: #cbd5e1;">2  10.0.99.12 (State WAN Gateway)  2.15ms</div>
            <div style="color: var(--danger);">3  <?php echo $ip; ?> - Request timed out (Packet Loss: 100%)</div>
            <div style="color: var(--success); margin-top: 10px;">[System Alert] Ticket #INC-2026-089 has been auto-generated and assigned to the local District FMS support queue.</div>
        </div>
        
        <div>
            <button onclick="window.close()" class="btn btn-secondary"><i class="fas fa-times"></i> Close Window</button>
            <a href="../" class="btn"><i class="fas fa-arrow-left"></i> Return to Dashboard</a>
        </div>
    </div>
</body>
</html>
