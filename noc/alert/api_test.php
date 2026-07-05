<?php
register_shutdown_function(function() { echo "FATAL ERROR CAUGHT: " . print_r(error_get_last(), true); });
?>
// api.php - NOC Network Monitor API and Engine
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Synchronize all logging and event times to Indian Standard Time (IST)
date_default_timezone_set('Asia/Kolkata');

// Configurable constants
define('PING_TIMEOUT_SEC', 1);
define('PING_INTERVAL_SEC', 20);
define('LOG_FILE', __DIR__ . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'ping_monitor.log');
define('CONFIG_FILE', __DIR__ . DIRECTORY_SEPARATOR . 'config.json');
define('STATE_FILE', __DIR__ . DIRECTORY_SEPARATOR . 'last_state.json');
define('MONITOR_DATA_FILE', __DIR__ . DIRECTORY_SEPARATOR . 'monitor_data.json');

// CLI Background Handler for Async Ping Cycles
if (php_sapi_name() === 'cli') {
    global $argv;
    if (isset($argv[1]) && $argv[1] === '--run_ping_cycle') {
        run_parallel_ping_cycle();
        exit(0);
    }
}

function load_state() {
    if (!file_exists(STATE_FILE)) {
        return [];
    }
    $fp = fopen(STATE_FILE, 'r');
    if (!$fp) {
        return [];
    }
    flock($fp, LOCK_SH);
    $size = filesize(STATE_FILE);
    $content = $size > 0 ? fread($fp, $size) : '';
    flock($fp, LOCK_UN);
    fclose($fp);
    return json_decode($content, true) ?: [];
}

function save_state($state) {
    $fp = fopen(STATE_FILE, 'c');
    if (!$fp) {
        return false;
    }
    $success = false;
    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        $success = (fwrite($fp, json_encode($state, JSON_PRETTY_PRINT)) !== false);
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
    return $success;
}
$endpoint = $_GET['endpoint'] ?? '';

// Load utility functions
function get_env_vars() {
    $env = [];
    if (file_exists('.env')) {
        $lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            $parts = explode('=', $line, 2);
            if (count($parts) === 2) {
                $env[trim($parts[0])] = trim($parts[1]);
            }
        }
    }
    return $env;
}

function get_active_viewers_count() {
    $temp_dir = 'temp';
    if (!file_exists($temp_dir)) {
        mkdir($temp_dir, 0777, true);
    }
    $viewers_file = $temp_dir . DIRECTORY_SEPARATOR . 'active_viewers.json';
    $now = time();
    
    $client_ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $tab_id = $_GET['tab_id'] ?? md5($client_ip . '_' . $user_agent);
    
    $viewers = [];
    
    $fp = fopen($viewers_file, 'c+');
    if ($fp) {
        if (flock($fp, LOCK_EX)) {
            $size = filesize($viewers_file);
            if ($size > 0) {
                $content = fread($fp, $size);
                $viewers = json_decode($content, true) ?: [];
            }
            
            // Transition catch for legacy data format
            if (!empty($viewers) && is_numeric(reset($viewers))) {
                $new_viewers = [];
                foreach ($viewers as $k => $v) {
                    $new_viewers[$k] = ['last_seen' => $v, 'ip' => 'Unknown'];
                }
                $viewers = $new_viewers;
            }
            
            $viewers[$tab_id] = [
                'last_seen' => $now,
                'ip' => $client_ip
            ];
            
            // Purge inactive tabs (inactive for more than 15 seconds)
            foreach ($viewers as $tid => $data) {
                if ($now - $data['last_seen'] > 15) {
                    unset($viewers[$tid]);
                }
            }
            
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($viewers));
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
    }
    
    $unique_ips = array_unique(array_column($viewers, 'ip'));
    
    // Annotate IPs with location from topology
    $config = file_exists(CONFIG_FILE) ? json_decode(file_get_contents(CONFIG_FILE), true) : [];
    $hosts = $config['hosts'] ?? [];
    
    $annotated_ips = [];
    foreach ($unique_ips as $ip) {
        $loc = null;
        if ($ip === '127.0.0.1' || $ip === '::1' || strpos($ip, '10.133.22.') === 0) {
            $loc = 'State HQ';
        } else {
            $viewer_parts = explode('.', $ip);
            if (count($viewer_parts) === 4) {
                $viewer_subnet = $viewer_parts[0] . '.' . $viewer_parts[1] . '.' . $viewer_parts[2];
                foreach ($hosts as $host) {
                    $host_ip = $host['ip'] ?? '';
                    $host_parts = explode('.', $host_ip);
                    if (count($host_parts) === 4) {
                        $host_subnet = $host_parts[0] . '.' . $host_parts[1] . '.' . $host_parts[2];
                        if ($host_subnet === $viewer_subnet) {
                            $desc = $host['description'] ?? 'Unknown Location';
                            $desc = explode('/', $desc)[0]; // Clean up e.g. "Lakhisarai/2960X" -> "Lakhisarai"
                            $loc = trim($desc);
                            break;
                        }
                    }
                }
            }
        }
        
        if ($loc) {
            $annotated_ips[] = $ip . " - " . $loc;
        } else {
            $annotated_ips[] = $ip;
        }
    }
    
    return [
        'count' => count($unique_ips),
        'ips' => array_values($annotated_ips)
    ];
}

function write_log($level, $message) {
    $log_dir = dirname(LOG_FILE);
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0777, true);
    }
    
    // Log rotation: cap at 5MB, keep up to 3 backups
    if (file_exists(LOG_FILE) && filesize(LOG_FILE) > 5 * 1024 * 1024) {
        for ($i = 3; $i > 0; $i--) {
            $old_file = $log_dir . DIRECTORY_SEPARATOR . "ping_monitor_$i.log";
            $prev_file = ($i === 1) ? LOG_FILE : ($log_dir . DIRECTORY_SEPARATOR . "ping_monitor_" . ($i - 1) . ".log");
            if (file_exists($prev_file)) {
                @rename($prev_file, $old_file);
            }
        }
    }
    
    $time = date('Y-m-d H:i:s');
    $log_line = "$time - $level - $message\n";
    file_put_contents(LOG_FILE, $log_line, FILE_APPEND);
}

function get_last_log_lines($n = 35, $filter = null) {
    if (!file_exists(LOG_FILE)) {
        return [];
    }
    
    $fp = fopen(LOG_FILE, "r");
    if (!$fp) return [];
    
    $pos = -2;
    $t = " ";
    $data = "";
    $lines = [];
    
    // Efficient tail: read backwards using fseek (loads only target lines in memory)
    while (count($lines) < $n) {
        if (fseek($fp, $pos, SEEK_END) === -1) {
            break;
        }
        $t = fgetc($fp);
        if ($t === false) {
            break;
        }
        if ($t === "\n") {
            $trimmed = trim($data);
            if ($trimmed !== "") {
                if ($filter === null || stripos($trimmed, $filter) !== false) {
                    $lines[] = $trimmed;
                }
            }
            $data = "";
        } else {
            $data = $t . $data;
        }
        $pos--;
    }
    
    $trimmed = trim($data);
    if ($trimmed !== "") {
        if ($filter === null || stripos($trimmed, $filter) !== false) {
            $lines[] = $trimmed;
        }
    }
    fclose($fp);
    
    return array_slice(array_reverse($lines), -$n);
}

function get_location_engineers($description) {
    static $cached_contacts = null;
    $contacts_file = __DIR__ . '/../contacts.json';
    
    if ($cached_contacts === null) {
        if (!file_exists($contacts_file)) {
            $cached_contacts = [];
        } else {
            $cached_contacts = json_decode(file_get_contents($contacts_file), true) ?: [];
        }
    }
    
    $contacts = $cached_contacts;
    if (empty($contacts)) {
        return [];
    }
    
    $desc_lower = strtolower($description);
    $matched_location = '';
    
    // List of known districts and their alias mappings matching contacts.json locations
    $districts = [
        'arwal' => ['arwal'],
        'araria' => ['araria'],
        'aurangabad' => ['aurangabad'],
        'banka' => ['banka'],
        'begusarai' => ['begusarai', 'begusaria'],
        'bhagalpur' => ['bhagalpur'],
        'bhojpur' => ['bhojpur', 'ara'],
        'buxar' => ['buxar'],
        'darbhanga' => ['darbhanga', 'dharbanga'],
        'gaya' => ['gaya'],
        'gopalganj' => ['gopalganj'],
        'jamui' => ['jamui'],
        'jehanabad' => ['jehanabad'],
        'katihar' => ['katihar'],
        'khagaria' => ['khagaria'],
        'kishanganj' => ['kishanganj'],
        'lakhisarai' => ['lakhisarai'],
        'madhepura' => ['madhepura'],
        'madhubani' => ['madhubani'],
        'munger' => ['munger'],
        'muzaffarpur' => ['muzaffarpur'],
        'nalanda' => ['nalanda'],
        'nawada' => ['nawada'],
        'patna' => ['patna'],
        'purnia' => ['purnia', 'purnea'],
        'rohtas' => ['rohtas', 'sasaram'],
        'saharsa' => ['saharsa'],
        'samastipur' => ['samastipur'],
        'saran' => ['saran', 'chapra'],
        'sheikhpura' => ['sheikhpura', 'shekhpura'],
        'sheohar' => ['sheohar', 'seheohar'],
        'sitamarhi' => ['sitamarhi', 'sitamahari'],
        'siwan' => ['siwan'],
        'supaul' => ['supaul'],
        'vaishali' => ['vaishali', 'hajipur'],
        'west champaran' => ['west champaran', 'bettiah', 'w.champaran'],
        'east champaran' => ['east champaran', 'motihari', 'e.champaran'],
        'kaimur' => ['kaimur', 'bhabhua']
    ];
    
    // Find which district maps to the description
    foreach ($districts as $canonical_name => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($desc_lower, $alias) !== false) {
                $matched_location = $canonical_name;
                break 2;
            }
        }
    }
    
    if (empty($matched_location)) {
        return [];
    }
    
    $numbers = [];
    foreach ($contacts as $contact) {
        $loc = strtolower($contact['location'] ?? '');
        
        // Match conditions corresponding to location
        $is_match = false;
        if ($matched_location === 'patna') {
            $is_match = ($loc === 'patna' || $loc === 'patna hq' || $loc === 'patna du');
        } else if ($matched_location === 'west champaran') {
            $is_match = ($loc === 'west champaran' || strpos($loc, 'bettiah') !== false || strpos($loc, 'west') !== false);
        } else if ($matched_location === 'east champaran') {
            $is_match = ($loc === 'east champaran' || strpos($loc, 'motihari') !== false || strpos($loc, 'east') !== false);
        } else if ($matched_location === 'kaimur') {
            $is_match = ($loc === 'kaimur' || strpos($loc, 'bhabhua') !== false);
        } else if ($matched_location === 'rohtas') {
            $is_match = ($loc === 'rohtas' || strpos($loc, 'sasaram') !== false);
        } else {
            $is_match = ($loc === $matched_location || strpos($loc, $matched_location) !== false);
        }
        
        if ($is_match && !empty($contact['mobile'])) {
            // Clean mobile number (remove trailing .0, spaces, etc.)
            $phone = trim($contact['mobile']);
            if (strpos($phone, '.') !== false) {
                $phone = explode('.', $phone)[0];
            }
            
            // Format phone number to start with +91 if it's 10 digits
            $phone = preg_replace('/[^0-9]/', '', $phone);
            if (strlen($phone) === 10) {
                $phone = '+91' . $phone;
            } else if (strlen($phone) === 12 && strpos($phone, '91') === 0) {
                $phone = '+' . $phone;
            } else if (strlen($phone) > 10 && strpos($phone, '+') !== 0) {
                $phone = '+' . $phone;
            }
            
            if (strlen($phone) >= 11) {
                $numbers[] = [
                    'name' => $contact['name'] ?? 'Engineer',
                    'phone' => $phone,
                    'role' => $contact['role'] ?? ($contact['source'] ?? 'Engineer')
                ];
            }
        }
    }
    
    return $numbers;
}

function check_whatsapp_rate_limit() {
    $temp_dir = __DIR__ . DIRECTORY_SEPARATOR . 'temp';
    if (!file_exists($temp_dir)) {
        @mkdir($temp_dir, 0777, true);
    }
    
    $limit_file = $temp_dir . DIRECTORY_SEPARATOR . 'whatsapp_rate_limit.json';
    $now = time();
    $today_date = date('Y-m-d');
    
    $data = [
        'date' => $today_date,
        'count' => 0,
        'hour_timestamp' => $now,
        'hour_count' => 0
    ];
    
    if (file_exists($limit_file)) {
        $content = @file_get_contents($limit_file);
        if ($content !== false) {
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $data = $decoded;
            }
        }
    }
    
    // Reset daily count if date changed
    if (($data['date'] ?? '') !== $today_date) {
        $data['date'] = $today_date;
        $data['count'] = 0;
    }
    
    // Reset hourly count if 1 hour elapsed
    if ($now - ($data['hour_timestamp'] ?? 0) >= 3600) {
        $data['hour_timestamp'] = $now;
        $data['hour_count'] = 0;
    }
    
    $max_daily = 40;
    $max_hourly = 10;
    
    if (($data['count'] ?? 0) >= $max_daily) {
        write_log("WARNING", "[RATE LIMIT BUFFER] Daily Twilio Sandbox limit reached (" . $data['count'] . "/$max_daily). Suppressing WhatsApp alert dispatch.");
        return false;
    }
    
    if (($data['hour_count'] ?? 0) >= $max_hourly) {
        write_log("WARNING", "[RATE LIMIT BUFFER] Hourly message threshold reached (" . $data['hour_count'] . "/$max_hourly). Suppressing WhatsApp alert dispatch to prevent spam.");
        return false;
    }
    
    // Increment counters
    $data['count'] = ($data['count'] ?? 0) + 1;
    $data['hour_count'] = ($data['hour_count'] ?? 0) + 1;
    
    @file_put_contents($limit_file, json_encode($data));
    return true;
}

function resolve_district($description) {
    $desc_lower = strtolower($description);
    $districts = [
        'arwal' => ['arwal'],
        'araria' => ['araria'],
        'aurangabad' => ['aurangabad'],
        'banka' => ['banka'],
        'begusarai' => ['begusarai', 'begusaria'],
        'bhagalpur' => ['bhagalpur'],
        'bhojpur' => ['bhojpur', 'ara'],
        'buxar' => ['buxar'],
        'darbhanga' => ['darbhanga', 'dharbanga'],
        'gaya' => ['gaya'],
        'gopalganj' => ['gopalganj'],
        'jamui' => ['jamui'],
        'jehanabad' => ['jehanabad'],
        'katihar' => ['katihar'],
        'khagaria' => ['khagaria'],
        'kishanganj' => ['kishanganj'],
        'lakhisarai' => ['lakhisarai'],
        'madhepura' => ['madhepura'],
        'madhubani' => ['madhubani'],
        'munger' => ['munger'],
        'muzaffarpur' => ['muzaffarpur'],
        'nalanda' => ['nalanda'],
        'nawada' => ['nawada'],
        'patna' => ['patna'],
        'purnia' => ['purnia', 'purnea'],
        'rohtas' => ['rohtas', 'sasaram'],
        'saharsa' => ['saharsa'],
        'samastipur' => ['samastipur'],
        'saran' => ['saran', 'chapra'],
        'sheikhpura' => ['sheikhpura', 'shekhpura'],
        'sheohar' => ['sheohar', 'seheohar'],
        'sitamarhi' => ['sitamarhi', 'sitamahari'],
        'siwan' => ['siwan'],
        'supaul' => ['supaul'],
        'vaishali' => ['vaishali', 'hajipur'],
        'west champaran' => ['west champaran', 'bettiah', 'w.champaran'],
        'east champaran' => ['east champaran', 'motihari', 'e.champaran'],
        'kaimur' => ['kaimur', 'bhabhua']
    ];
    
    foreach ($districts as $canonical_name => $aliases) {
        foreach ($aliases as $alias) {
            if (strpos($desc_lower, $alias) !== false) {
                return $canonical_name;
            }
        }
    }
    return '';
}

function check_district_rate_limit($district, $is_test = false) {
    if (empty($district)) {
        return true;
    }
    
    $temp_dir = __DIR__ . DIRECTORY_SEPARATOR . 'temp';
    if (!file_exists($temp_dir)) {
        @mkdir($temp_dir, 0777, true);
    }
    
    $limit_file = $temp_dir . DIRECTORY_SEPARATOR . 'district_rate_limit.json';
    $today_date = date('Y-m-d');
    $now = time();
    
    $data = [
        'date' => $today_date,
        'districts' => []
    ];
    
    if (file_exists($limit_file)) {
        $content = @file_get_contents($limit_file);
        if ($content !== false) {
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $data = $decoded;
            }
        }
    }
    
    // Reset daily count if date changed
    if (($data['date'] ?? '') !== $today_date) {
        $data['date'] = $today_date;
        $data['districts'] = [];
    }
    
    $district_data = $data['districts'][$district] ?? ['count' => 0, 'last_time' => 0];
    
    // Enforce 30-minute time gap between notifications (bypassed for manual tests)
    $last_time = $district_data['last_time'] ?? 0;
    if (!$is_test && $last_time > 0 && ($now - $last_time) < 1800) {
        $remaining_min = ceil((1800 - ($now - $last_time)) / 60);
        write_log("WARNING", "[DISTRICT GAP LIMIT] Alert gap for '$district' is less than 30 minutes (last sent " . date('H:i:s', $last_time) . "). Suppressing WhatsApp. $remaining_min minutes remaining.");
        return false;
    }
    
    $count = $district_data['count'] ?? 0;
    if ($count >= 2) {
        write_log("WARNING", "[DISTRICT LIMIT BUFFER] Daily notification cap reached for district '$district' ($count/2). Suppressing WhatsApp alert dispatch.");
        return false;
    }
    
    // Increment count and update timestamp
    $data['districts'][$district] = [
        'count' => $count + 1,
        'last_time' => $now
    ];
    
    @file_put_contents($limit_file, json_encode($data));
    return true;
}

function send_telegram_alert($ip, $description, $event_type) {
    $env = get_env_vars();
    $bot_token = $env['TELEGRAM_BOT_TOKEN'] ?? '';
    $chat_id = $env['TELEGRAM_CHAT_ID'] ?? '';
    
    if (empty($bot_token) || empty($chat_id)) {
        return false;
    }
    
    $time_str = date('Y-m-d H:i:s');
    $emoji = ($event_type === 'DOWN') ? '🚨' : '✅';
    
    if ($event_type === 'DOWN') {
        $text = "$emoji <b>[DEVICE DOWN ALERT]</b>\n" .
                "━━━━━━━━━━━━━━━━━━━\n" .
                "🖥️ <b>Device</b>: " . htmlspecialchars($description) . "\n" .
                "🌐 <b>IP Address</b>: {$ip}\n" .
                "⚠️ <b>Status</b>: UNREACHABLE\n" .
                "⏰ <b>Time</b>: {$time_str}\n" .
                "━━━━━━━━━━━━━━━━━━━\n" .
                "📊 <b>View live logs & dashboard</b>:\n" .
                "🔗 http://10.133.22.8/alert/";
    } else {
        $text = "$emoji <b>[DEVICE RECOVERY ALERT]</b>\n" .
                "━━━━━━━━━━━━━━━━━━━\n" .
                "🖥️ <b>Device</b>: " . htmlspecialchars($description) . "\n" .
                "🌐 <b>IP Address</b>: {$ip}\n" .
                "🟢 <b>Status</b>: BACK ONLINE\n" .
                "⏰ <b>Time</b>: {$time_str}\n" .
                "━━━━━━━━━━━━━━━━━━━\n" .
                "📊 <b>View live logs & dashboard</b>:\n" .
                "🔗 http://10.133.22.8/alert/";
    }
    $url = "https://api.telegram.org/bot" . $bot_token . "/sendMessage";
    $data = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 8
        ]
    ];
    
    $context  = stream_context_create($options);
    $res = @file_get_contents($url, false, $context);
    
    if ($res === false) {
        write_log("ERROR", "Telegram API dispatch failed for $description ($ip)");
        return false;
    }
    
    write_log("INFO", "Telegram alert successfully sent to chat $chat_id for $description ($ip)");
    return true;
}

function send_whatsapp_alert($ip, $description, $event_type, $is_test = false) {
    $env = get_env_vars();
    $provider = strtolower($env['WHATSAPP_PROVIDER'] ?? 'none');
    $recipient_str = str_replace([' ', '-'], '', $env['RECIPIENT_PHONE'] ?? '');
    
    // Rule: Suppress recovery (UP) alerts. Only DOWN alerts are sent!
    if ($event_type !== 'DOWN') {
        write_log("INFO", "[UP FILTER] Suppressing alert notification: Recovery alerts (link UP) are suppressed.");
        return false;
    }
    
    // Rule: Suppress notifications outside working hours (10:30 AM to 5:30 PM, Mon-Fri), unless it is a manual test!
    if (!$is_test) {
        $day_of_week = (int)date('N'); // 1 (Mon) - 7 (Sun)
        if ($day_of_week > 5) {
            write_log("INFO", "[WORKING HOURS FILTER] Suppressing notification: today is weekend (Day $day_of_week).");
            return false;
        }
        
        $current_minutes = (int)date('H') * 60 + (int)date('i');
        $start_minutes = 10 * 60 + 30; // 10:30 AM
        $end_minutes = 17 * 60 + 30;   // 05:30 PM
        
        if ($current_minutes < $start_minutes || $current_minutes > $end_minutes) {
            write_log("INFO", "[WORKING HOURS FILTER] Suppressing notification: current time (" . date('H:i') . ") is outside 10:30 AM - 05:30 PM working hours.");
            return false;
        }
    }
    
    // Resolve the district for this alert event
    $district = resolve_district($description);
    if (!empty($district)) {
        // Enforce per-district rate limit cap (Max 2 alert events per day and 30-minute time gap), unless it is a manual test!
        if (!check_district_rate_limit($district, $is_test)) {
            return false;
        }
    }
    
    // Broadcast Telegram Alert if token and chat ID are configured
    send_telegram_alert($ip, $description, $event_type);
    
    // If WhatsApp is not configured, we successfully complete here
    if ($provider === 'none' || !$recipient_str) {
        write_log("INFO", "[Alert Dispatched]: Telegram broadcast complete. No WhatsApp channel configured.");
        return true;
    }
    
    $recipients = explode(',', $recipient_str);
    
    // Find location-specific engineers/NIC employees dynamically from contacts database
    $engineers = get_location_engineers($description);
    $engineer_recipients = [];
    if (!empty($engineers)) {
        $eng_logs = [];
        foreach ($engineers as $eng) {
            $engineer_recipients[] = $eng['phone'];
            $eng_logs[] = "{$eng['name']} ({$eng['role']}: {$eng['phone']})";
        }
        write_log("INFO", "Location-based alert: routing also to " . implode(", ", $eng_logs));
    }
    
    // Ensure the supreme numbers (+919897577007 and +918809864007) are always included in the alerts
    $recipients[] = '+919897577007';
    $recipients[] = '+918809864007';
    
    $recipients = array_merge($recipients, $engineer_recipients);
    $recipients = array_unique($recipients);
    $time_str = date('Y-m-d H:i:s');
    $status_text = ($event_type === 'DOWN') ? 'DOWN' : 'RECOVERED';
    $emoji = ($event_type === 'DOWN') ? '🚨' : '✅';
    
    if ($event_type === 'DOWN') {
        $text_message = "$emoji *[DEVICE DOWN ALERT]*\n" .
                        "━━━━━━━━━━━━━━━━━━━\n" .
                        "🖥️ *Device*: $description\n" .
                        "🌐 *IP Address*: $ip\n" .
                        "⚠️ *Status*: UNREACHABLE\n" .
                        "⏰ *Time*: $time_str\n" .
                        "━━━━━━━━━━━━━━━━━━━\n" .
                        "📊 *View live logs & dashboard*:\n" .
                        "🔗 http://10.133.22.8/alert/";
    } else {
        $text_message = "$emoji *[DEVICE RECOVERY ALERT]*\n" .
                        "━━━━━━━━━━━━━━━━━━━\n" .
                        "🖥️ *Device*: $description\n" .
                        "🌐 *IP Address*: $ip\n" .
                        "🟢 *Status*: BACK ONLINE\n" .
                        "⏰ *Time*: $time_str\n" .
                        "━━━━━━━━━━━━━━━━━━━\n" .
                        "📊 *View live logs & dashboard*:\n" .
                        "🔗 http://10.133.22.8/alert/";
    }
    $template_params = [$description, $ip, $status_text];
    $overall_success = true;
    
    foreach ($recipients as $recipient) {
        $recipient = trim($recipient);
        if (empty($recipient)) continue;
        
        // Apply rate limit safeguard
        if (!check_whatsapp_rate_limit()) {
            $overall_success = false;
            continue;
        }
        
        write_log("INFO", "Sending WhatsApp notification via $provider to $recipient for $description ($ip)");
        
        if ($provider === 'meta') {
            $phone_id = $env['META_PHONE_NUMBER_ID'] ?? '';
            $token = $env['META_ACCESS_TOKEN'] ?? '';
            $template = $env['META_TEMPLATE_NAME'] ?? '';
            $lang = $env['META_TEMPLATE_LANGUAGE'] ?? 'en_US';
            
            if (!$phone_id || !$token) {
                write_log("ERROR", "Meta WhatsApp API credentials missing.");
                $overall_success = false;
                continue;
            }
            
            $url = "https://graph.facebook.com/v20.0/$phone_id/messages";
            $headers = [
                "Authorization: Bearer $token",
                "Content-Type: application/json"
            ];
            
            if ($template) {
                $parameters = [];
                if ($template !== 'hello_world') {
                    foreach ($template_params as $param) {
                        $parameters[] = ["type" => "text", "text" => strval($param)];
                    }
                }
                
                $payload = [
                    "messaging_product" => "whatsapp",
                    "to" => str_replace('+', '', $recipient),
                    "type" => "template",
                    "template" => [
                        "name" => $template,
                        "language" => ["code" => $lang]
                    ]
                ];
                
                if (!empty($parameters)) {
                    $payload['template']['components'] = [
                        [
                            "type" => "body",
                            "parameters" => $parameters
                        ]
                    ];
                }
            } else {
                $payload = [
                    "messaging_product" => "whatsapp",
                    "recipient_type" => "individual",
                    "to" => str_replace('+', '', $recipient),
                    "type" => "text",
                    "text" => ["body" => $text_message]
                ];
            }
            
            $res = post_request($url, json_encode($payload), $headers);
            write_log("INFO", "Meta WhatsApp API response for $recipient: " . ($res ? "SUCCESS" : "FAILED"));
            if (!$res) $overall_success = false;
            
        } else if ($provider === 'twilio') {
            $sid = $env['TWILIO_ACCOUNT_SID'] ?? '';
            $token = $env['TWILIO_AUTH_TOKEN'] ?? '';
            $sender = $env['TWILIO_SENDER_PHONE'] ?? '+14155238886';
            $content_sid = $env['TWILIO_CONTENT_SID'] ?? '';
            
            if (!$sid || !$token) {
                write_log("ERROR", "Twilio credentials missing in .env.");
                $overall_success = false;
                continue;
            }
            
            $url = "https://api.twilio.com/2010-04-01/Accounts/$sid/Messages.json";
            
            $to_number = (strpos($recipient, 'whatsapp:') === 0) ? $recipient : "whatsapp:$recipient";
            $from_number = (strpos($sender, 'whatsapp:') === 0) ? $sender : "whatsapp:$sender";
            
            $data = [
                "To" => $to_number,
                "From" => $from_number
            ];
            
            $use_template = !empty($content_sid);
            if ($use_template) {
                $data["ContentSid"] = $content_sid;
                $time_only = date('H:i:s');
                $variables = [
                    "1" => "$description ($ip)",
                    "2" => "$status_text at $time_only",
                    "3" => $status_text
                ];
                $data["ContentVariables"] = json_encode($variables);
            } else {
                $data["Body"] = $text_message;
            }
            
            $auth = base64_encode("$sid:$token");
            $headers = [
                "Authorization: Basic $auth",
                "Content-Type: application/x-www-form-urlencoded"
            ];
            
            $payload = http_build_query($data);
            $res = post_request($url, $payload, $headers);
            
            // If template dispatch fails (e.g. Content Variable mismatch or unapproved template),
            // fall back automatically to raw text body. This guarantees delivery in all cases!
            if (!$res && $use_template) {
                write_log("WARNING", "Twilio Template dispatch failed. Falling back to raw text message body for $recipient.");
                unset($data["ContentSid"]);
                unset($data["ContentVariables"]);
                $data["Body"] = $text_message;
                
                $payload = http_build_query($data);
                $res = post_request($url, $payload, $headers);
            }
            
            write_log("INFO", "Twilio WhatsApp API response for $recipient: " . ($res ? "SUCCESS" : "FAILED"));
            if (!$res) $overall_success = false;
        }
    }
    
    return $overall_success;
}

function post_request($url, $payload, $headers) {
    // Construct headers for curl.exe
    $curl_headers = [];
    foreach ($headers as $header) {
        $curl_headers[] = "-H " . escapeshellarg($header);
    }
    $headers_str = implode(' ', $curl_headers);
    
    // We will write the payload to a temp file and tell curl.exe to read from it
    $temp_dir = __DIR__ . DIRECTORY_SEPARATOR . 'temp';
    if (!file_exists($temp_dir)) {
        @mkdir($temp_dir, 0777, true);
    }
    
    $payload_file = $temp_dir . DIRECTORY_SEPARATOR . 'curl_' . uniqid('p_') . '.txt';
    $temp_fields_files = [];
    $data_param = '';
    
    if (strpos(trim($payload), '{') === 0) {
        // Payload is raw JSON (Meta provider). Write payload to file and use --data @filename
        file_put_contents($payload_file, $payload);
        $data_param = "--data " . escapeshellarg("@" . $payload_file);
    } else {
        // Payload is form-urlencoded (Twilio provider).
        // Parse back to array and build --data-urlencode parameters
        parse_str($payload, $parsed_data);
        
        $curl_data = [];
        // We will create individual temp files for fields containing newlines (like Body or ContentVariables)
        // to avoid passing newlines on the Windows command line!
        foreach ($parsed_data as $key => $val) {
            if (strpos($val, "\n") !== false || strpos($val, "\r") !== false || strlen($val) > 100) {
                // Large or multiline value: write to a temp file and read using key@filename
                $field_file = $temp_dir . DIRECTORY_SEPARATOR . 'field_' . uniqid($key . '_') . '.txt';
                file_put_contents($field_file, $val);
                $temp_fields_files[] = $field_file;
                $curl_data[] = "--data-urlencode " . escapeshellarg($key . "@" . $field_file);
            } else {
                // Short simple value: pass directly on command line
                $curl_data[] = "--data-urlencode " . escapeshellarg("$key=$val");
            }
        }
        $data_param = implode(' ', $curl_data);
    }
    
    // Execute request securely using system curl.exe
    $cmd = "curl.exe -s -i -X POST " . $headers_str . " " . $data_param . " " . escapeshellarg($url);
    $response = shell_exec($cmd);
    
    // Clean up temporary files immediately
    if (file_exists($payload_file)) {
        @unlink($payload_file);
    }
    if (!empty($temp_fields_files)) {
        foreach ($temp_fields_files as $f) {
            if (file_exists($f)) {
                @unlink($f);
            }
        }
    }
    
    if (!$response) {
        write_log("ERROR", "curl.exe execution returned empty response or failed.");
        return false;
    }
    
    // Split headers and body
    $parts = explode("\r\n\r\n", $response, 2);
    if (count($parts) < 2) {
        $parts = explode("\n\n", $response, 2);
    }
    
    $header_section = $parts[0] ?? '';
    $body_section = $parts[1] ?? '';
    
    // Parse HTTP Status code
    $is_success = false;
    if (preg_match('/HTTP\/\d\.\d\s+(200|201)/i', $header_section)) {
        $is_success = true;
    }
    
    if (!$is_success && $body_section) {
        $err_msg = trim(preg_replace('/\s+/', ' ', strip_tags($body_section)));
        write_log("ERROR", "API Request Failed. Error Response: " . substr($err_msg, 0, 200));
    }
    
    return $is_success;
}

function run_parallel_ping_cycle() {
    echo "STARTED PING CYCLE\n";
    // Process locking to prevent concurrent runs stacking up
    $lock_file = 'ping.lock';
    if (file_exists($lock_file)) {
        $lock_time = intval(file_get_contents($lock_file));
        // If the lock is less than 10 seconds old, another cycle is active
        if (time() - $lock_time < 10) {
            return false;
        }
    }
    file_put_contents($lock_file, strval(time()));
    if (!file_exists(CONFIG_FILE)) {
        return false;
    }
    
    $config = json_decode(file_get_contents(CONFIG_FILE), true);
    $hosts = $config['hosts'] ?? [];
    
    if (empty($hosts)) {
    echo "CHECKING HOSTS\n";
        return false;
    }
    
    // Load last state
    $state = ['states' => [], 'muted' => [], 'is_paused' => false, 'last_ping_time_sec' => 0];
    $state = load_state() ?: $state;
    
    $prev_states = $state['states'] ?? [];
    $muted = $state['muted'] ?? [];
    $is_paused = $state['is_paused'] ?? false;
    
    if ($is_paused) {
    echo "CHECKING PAUSE\n";
        return false;
    }
    
    // Create temporary directory for ping outputs
    $temp_dir = "temp";
    if (!file_exists($temp_dir)) {
        mkdir($temp_dir, 0777, true);
    }
    
    // Clean up old orphan temp files (> 60 seconds old) to keep the filesystem clean
    $files_in_temp = glob($temp_dir . DIRECTORY_SEPARATOR . "ping_*");
    if ($files_in_temp) {
        $now_time = time();
        foreach ($files_in_temp as $f) {
            if ($now_time - filemtime($f) > 60) {
                @unlink($f);
            }
        }
    }
    
    // Launch all pings in parallel with unique request tracking
    $req_id = uniqid('p_');
    $files = [];
    $processes = [];
    
    foreach ($hosts as $idx => $host) {
        $ip = $host['ip'];
        $temp_file = $temp_dir . DIRECTORY_SEPARATOR . "ping_" . $req_id . "_" . $idx . "_" . str_replace('.', '_', $ip) . ".txt";
        $files[$idx] = $temp_file;
        
        // Spawn background ping in Windows redirection
        $cmd = "start /B cmd /C ping -n 1 -w " . (PING_TIMEOUT_SEC * 1000) . " " . escapeshellarg($ip) . " > " . escapeshellarg($temp_file);
        pclose(popen($cmd, "r"));
    }
    
    // Wait for all pings to complete (timeout + 500ms for robust file writing handles under Windows/IIS concurrency)
    usleep((PING_TIMEOUT_SEC * 1000 + 500) * 1000);
    
    // Read and parse all outputs
    $results = [];
    $up_count = 0;
    $down_count = 0;
    
    // Track how many transition verifications we run in this single cycle
    // to prevent cascading delays if a large-scale network outage occurs.
    $transition_verifications = 0;

    foreach ($hosts as $idx => $host) {
        $ip = $host['ip'];
        $desc = $host['description'];
        $temp_file = $files[$idx];
        $prev_status = $prev_states[$ip] ?? 'UP';
        
        $stdout = "No response file created.";
        $is_up = false;
        $latency = null;
        
        if (file_exists($temp_file)) {
            $stdout = file_get_contents($temp_file);
            unlink($temp_file);
            
            // Check Windows ping success
            $is_up = (strpos($stdout, 'Reply from') !== false && strpos(strtolower($stdout), 'unreachable') === false && strpos(strtolower($stdout), 'timed out') === false);
            if ($is_up) {
                if (preg_match('/time[=<]([\d\.]+)\s*ms/i', $stdout, $matches)) {
                    $latency = floatval($matches[1]);
                } else {
                    $latency = 1.0;
                }
            } else {
                // If parallel ping fails, verify via retry ONLY if:
                // 1. It was previously UP (meaning it is a potential transition to DOWN).
                // 2. We haven't exceeded 3 transition verifications in this single API call (caps delay at ~3 sec max).
                if ($prev_status === 'UP' && $transition_verifications < 3) {
                    $transition_verifications++;
                    $max_retries = 2;
                    for ($retry = 1; $retry <= $max_retries; $retry++) {
                        usleep(250000); // Fast 250ms delay
                        $retry_stdout = [];
                        $retry_status = -1;
                        // Use a fast 500ms timeout for verification retries
                        exec("ping -n 1 -w 500 " . escapeshellarg($ip), $retry_stdout, $retry_status);
                        $retry_stdout_str = implode("\n", $retry_stdout);
                        $retry_up = ($retry_status === 0 && strpos($retry_stdout_str, 'Reply from') !== false && strpos(strtolower($retry_stdout_str), 'unreachable') === false && strpos(strtolower($retry_stdout_str), 'timed out') === false);
                        if ($retry_up) {
                            $is_up = true;
                            $stdout = $retry_stdout_str;
                            if (preg_match('/time[=<]([\d\.]+)\s*ms/i', $stdout, $matches)) {
                                $latency = floatval($matches[1]);
                            } else {
                                $latency = 1.0;
                            }
                            break; // Recovered! It was a transient packet drop.
                        }
                    }
                }
            }
        }
        
        $status_text = $is_up ? 'UP' : 'DOWN';
        
        if ($host['category'] !== 'SSB') {
            if ($is_up) {
                $up_count++;
            } else {
                $down_count++;
            }
        }
        
        $prev_status = $prev_states[$ip] ?? 'UP'; // Default to UP if no previous state exists
        $is_muted = in_array($ip, $muted);
        
        // Alert checking & logging
        if ($status_text !== $prev_status) {
            $prev_states[$ip] = $status_text;
            
            if ($status_text === 'DOWN') {
                write_log("WARNING", "[STATE CHANGE] $desc ($ip) has transitioned to DOWN.");
                if (!$is_muted) {
                    send_whatsapp_alert($ip, $desc, 'DOWN');
                } else {
                    write_log("INFO", "[MUTED ALERT] WhatsApp alert suppressed for $desc ($ip)");
                }
            } else {
                write_log("INFO", "[STATE CHANGE] $desc ($ip) has transitioned to UP.");
                if (!$is_muted) {
                    send_whatsapp_alert($ip, $desc, 'RECOVERY');
                } else {
                    write_log("INFO", "[MUTED ALERT] WhatsApp recovery alert suppressed for $desc ($ip)");
                }
            }
        } else {
            // Still DOWN logs
            if ($status_text === 'DOWN') {
                write_log("WARNING", "[STILL DOWN] $desc ($ip) is offline.");
            }
        }
        
        $temp = null;
        $battery_status = null;
        
        static $ups_snmp_data = null;
        if ($ups_snmp_data === null) {
            $snmp_path = __DIR__ . DIRECTORY_SEPARATOR . "ups_snmp.json";
            if (file_exists($snmp_path)) {
                $ups_snmp_data = json_decode(file_get_contents($snmp_path), true) ?: [];
            } else {
                $ups_snmp_data = [];
            }
        }
        
        if (isset($ups_snmp_data[$ip])) {
            if (isset($ups_snmp_data[$ip]['temp'])) {
                $temp = round(floatval($ups_snmp_data[$ip]['temp']), 1);
            }
            if (isset($ups_snmp_data[$ip]['battery_status'])) {
                $battery_status = intval($ups_snmp_data[$ip]['battery_status']);
            }
        }
        
        if (($host['category'] ?? '') === 'UPS' && $is_up) {
            if ($ip === '10.133.15.43') {
                // CS141 REST API (Newer firmware)
                $login_opts = [
                    'http' => [
                        'method' => 'POST',
                        'header' => "Content-Type: application/json\r\n",
                        'content' => json_encode(['userName' => 'admin', 'password' => 'Nknbr@321']),
                        'timeout' => 1
                    ]
                ];
                $login_ctx = stream_context_create($login_opts);
                $login_resp = @file_get_contents("http://$ip/api/login", false, $login_ctx);
                if ($login_resp) {
                    $json_end = strrpos($login_resp, '}');
                    if ($json_end !== false) {
                        $login_resp = substr($login_resp, 0, $json_end + 1);
                    }
                    $login_json = json_decode($login_resp, true);
                    if (isset($login_json['accessToken'])) {
                        $token = $login_json['accessToken'];
                        $data_opts = [
                            'http' => [
                                'method' => 'GET',
                                'header' => "Cookie: accessToken=$token\r\n",
                                'timeout' => 1
                            ]
                        ];
                        $data_ctx = stream_context_create($data_opts);
                        $data_resp = @file_get_contents("http://$ip/api/devices/ups/report", false, $data_ctx);
                        if ($data_resp) {
                            $json_end = strrpos($data_resp, '}');
                            if ($json_end !== false) {
                                $data_resp = substr($data_resp, 0, $json_end + 1);
                            }
                            $data_json = json_decode($data_resp, true);
                            if (isset($data_json['ups']['valtable']['TEMPDEG'])) {
                                $temp = $data_json['ups']['valtable']['TEMPDEG'];
                            }
                        }
                    }
                }
            } else {
                // Legacy data.cgi (fallback if SNMP wasn't available)
                if ($temp === null) {
                    $context = stream_context_create([
                        'http' => [
                            'method' => 'POST',
                            'header' => 'Content-Type: application/x-www-form-urlencoded',
                            'content' => http_build_query(['json' => 'ups', 'ups_id' => '0']),
                            'timeout' => 1
                        ]
                    ]);
                    $ups_resp = @file_get_contents("http://$ip/data.cgi", false, $context);
                    if ($ups_resp) {
                        $ups_json = json_decode($ups_resp, true);
                        if (isset($ups_json['ups']['valtable']['TEMPDEG'])) {
                            $temp = $ups_json['ups']['valtable']['TEMPDEG'];
                        }
                    }
                }
            }
        }
        
        if (($host['category'] ?? '') === 'PAC' && $is_up) {
            $context = stream_context_create([
                'http' => [
                    'timeout' => 5,
                    'header'  => "Authorization: Basic " . base64_encode("Liebert:Vertiv@123") . "\r\n"
                ]
            ]);
            $pac_resp = @file_get_contents("http://$ip/httpGetSet/httpGet.htm?devId=0&p1=vel~pnt~31", false, $context);
            if ($pac_resp) {
                if (preg_match('/p1="([^"]+)"/', $pac_resp, $matches)) {
                    $raw_temp = floatval($matches[1]);
                    // The PAC returns temperature multiplied by 10 (e.g. 287.6 = 28.76C)
                    $temp = round($raw_temp / 10, 1);
                }
            }
        }
        
        $res_item = [
            "ip" => $ip,
            "description" => $desc,
            "category" => $host['category'] ?? 'DHQ',
            "status" => $status_text,
            "latency" => $latency,
            "muted" => $is_muted,
            "last_ping_time" => date('Y-m-d H:i:s'),
            "ping_history" => [$status_text], // Simplify history to just current status for PHP bridge
            "last_stdout" => $stdout
        ];
        
        if ($temp !== null) {
            $res_item['temp'] = $temp;
        }
        if ($battery_status !== null) {
            $res_item['battery_status'] = $battery_status;
        }
        
        $results[] = $res_item;
    }
    
    // Save updated states and trigger parameters
    $state['states'] = $prev_states;
    $state['last_ping_time_sec'] = time();
    $state['trigger_test_alert'] = false;
    $force_save = true;
    save_state($state);
    
    // Load historical data for cap
    $total_valid = $up_count + $down_count;
    echo "REACHED STATS\n";
    $monitor_data = [
        "status" => "success",
        "timestamp" => date('H:i:s'),
        "stats" => [
            "total" => $total_valid,
            "up" => $up_count,
            "down" => $down_count,
            "uptime_ratio" => $total_valid > 0 ? (intval(($up_count / $total_valid) * 100) . "%") : "0%"
        ],
        "config" => [
            "provider" => strtolower(get_env_vars()['WHATSAPP_PROVIDER'] ?? 'none'),
            "recipient" => get_env_vars()['RECIPIENT_PHONE'] ?? '',
            "twilio_sender" => str_replace('whatsapp:', '', get_env_vars()['TWILIO_SENDER_PHONE'] ?? '+14155238886'),
            "twilio_join_msg" => get_env_vars()['TWILIO_JOIN_MESSAGE'] ?? 'join at-cath'
        ],
        "hosts" => $results,
        "last_updated" => date('Y-m-d H:i:s'),
        "logs" => get_last_log_lines(35),
        "whatsapp_logs" => get_last_log_lines(35, 'whatsapp'),
        "stats_history" => []
    ];
    
    if (file_exists(MONITOR_DATA_FILE)) {
        $old_data = json_decode(file_get_contents(MONITOR_DATA_FILE), true);
        $hist = $old_data['stats_history'] ?? [];
        
        // Retain historical ping histories if matching
        $old_hosts_map = [];
        if (isset($old_data['hosts'])) {
            foreach ($old_data['hosts'] as $oh) {
                $old_hosts_map[$oh['ip'] . '_' . $oh['description']] = $oh['ping_history'] ?? [];
            }
        }
        
        foreach ($monitor_data['hosts'] as &$h) {
            $key = $h['ip'] . '_' . $h['description'];
            $hist_list = $old_hosts_map[$key] ?? [];
            $hist_list[] = $h['status'];
            if (count($hist_list) > 10) {
                array_shift($hist_list);
            }
            $h['ping_history'] = $hist_list;
        }
    } else {
        foreach ($monitor_data['hosts'] as &$h) {
            $h['ping_history'] = [$h['status']];
        }
    }
    
    // Add current stats history entry
    $hist[] = [
        "time" => date('H:i'),
        "up" => $up_count,
        "down" => $down_count
    ];
    if (count($hist) > 20) {
        array_shift($hist);
    }
    $monitor_data['stats_history'] = $hist;
    
    // --- INJECT NATIVE ML/SNMP DATA ---
    $native_data_path = __DIR__ . DIRECTORY_SEPARATOR . "native_data.json";
    if (file_exists($native_data_path)) {
        $native = json_decode(file_get_contents($native_data_path), true);
        if ($native) {
            // Inject Camera
            if (isset($native['cam_temp'])) {
                $monitor_data['hosts'][] = [
                    "ip" => "10.133.15.18", "description" => "Data Center (IP Cam)", "category" => "Environment",
                    "status" => "UP", "latency" => 1, "muted" => false, "last_ping_time" => date("Y-m-d H:i:s"),
                    "ping_history" => array_fill(0, 10, "UP"), "temp" => $native['cam_temp'], "last_stdout" => "Native ML Inferencing"
                ];
            }
            // Update UPSes
            foreach ($monitor_data['hosts'] as &$host) {
                if ($host['ip'] === "10.133.15.42") {
                    $host['battery_status'] = $native['ups1_bat'];
                    $host['temp'] = $native['ups1_tmp'];
                    $host['last_stdout'] = "Native SNMP Poller";
                } elseif ($host['ip'] === "10.133.15.45") {
                    $host['battery_status'] = $native['ups2_bat'];
                    $host['temp'] = $native['ups2_tmp'];
                    $host['last_stdout'] = "Native SNMP Poller";
                }
            }
            unset($host);
        }
    }
    
    file_put_contents(MONITOR_DATA_FILE, json_encode($monitor_data, JSON_PRETTY_PRINT));
    
    if (file_exists('ping.lock')) {
        unlink('ping.lock');
    }
    return true;
}

// ROUTER CONTROLLERS
switch ($endpoint) {
    case 'webhook':
        $env = get_env_vars();
        $verify_token = $env['META_WEBHOOK_VERIFY_TOKEN'] ?? 'nic_noc_alert_verify';
        
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $mode = $_GET['hub_mode'] ?? '';
            $token = $_GET['hub_verify_token'] ?? '';
            $challenge = $_GET['hub_challenge'] ?? '';
            
            if ($mode === 'subscribe' && $token === $verify_token) {
                header('Content-Type: text/plain');
                echo $challenge;
                exit;
            } else {
                http_response_code(403);
                echo "Verification failed";
                exit;
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = file_get_contents('php://input');
            write_log("INFO", "[WEBHOOK RECEIVED]: " . $data);
            echo json_encode(['status' => 'success']);
            exit;
        }
        break;

    case 'status':
        $last_state = ['states' => [], 'muted' => [], 'is_paused' => false, 'last_ping_time_sec' => 0];
        $last_state = load_state() ?: $last_state;
        
        $last_ping = $last_state['last_ping_time_sec'] ?? 0;
        $is_paused = $last_state['is_paused'] ?? false;
        
        // Execute a new ping cycle asynchronously if interval has elapsed and it's not paused
        if (!$is_paused && (time() - $last_ping >= PING_INTERVAL_SEC || !file_exists(MONITOR_DATA_FILE))) {
            $script_path = __FILE__;
            pclose(popen("start /B C:\\php\\php.exe " . escapeshellarg($script_path) . " --run_ping_cycle", "r"));
            
            // Immediately update the last ping time to prevent duplicate spawning before it finishes
            $last_state['last_ping_time_sec'] = time();
            save_state($last_state);
        }
        
        // Check for trigger test alert requests
        if (($last_state['trigger_test_alert'] ?? false)) {
            send_whatsapp_alert('10.133.22.8', 'Test Alert Triggered', 'DOWN');
            $last_state['trigger_test_alert'] = false;
            save_state($last_state);
        }
        
        if (file_exists(MONITOR_DATA_FILE)) {
            $data = json_decode(file_get_contents(MONITOR_DATA_FILE), true);
            
            // --- INJECT NATIVE ML/SNMP DATA ON THE FLY ---
            $native_data_path = __DIR__ . DIRECTORY_SEPARATOR . "native_data.json";
            if (file_exists($native_data_path)) {
                $native = json_decode(file_get_contents($native_data_path), true);
                if ($native) {
                    if (isset($native['cam_temp'])) {
                        $data['hosts'][] = [
                            "ip" => "10.133.15.18", "description" => "Data Center (IP Cam)", "category" => "Environment",
                            "status" => "UP", "latency" => 1, "muted" => false, "last_ping_time" => date("Y-m-d H:i:s"),
                            "ping_history" => array_fill(0, 10, "UP"), "temp" => $native['cam_temp'], "last_stdout" => "Native ML Inferencing"
                        ];
                    }
                    foreach ($data['hosts'] as &$host) {
                        if ($host['ip'] === "10.133.15.42") {
                            $host['battery_status'] = $native['ups1_bat'] ?? "N/A";
                            $host['temp'] = $native['ups1_tmp'] ?? "N/A";
                        }
                        if ($host['ip'] === "10.133.15.45") {
                            $host['battery_status'] = $native['ups2_bat'] ?? "N/A";
                            $host['temp'] = $native['ups2_tmp'] ?? "N/A";
                        }
                    }
                }
            }

            // Sync current logs and config
            $data['logs'] = get_last_log_lines(35);
            $data['whatsapp_logs'] = get_last_log_lines(35, 'whatsapp');
            $data['is_paused'] = $is_paused;
            $data['active_viewers'] = get_active_viewers_count();
            echo json_encode($data);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Monitor data could not be built.']);
        }
        break;
        
    case 'hosts/ping':
        $input = json_decode(file_get_contents('php://input'), true);
        $ip = $input['ip'] ?? '';
        if (!$ip) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'IP is required.']);
            break;
        }
        
        $stdout = [];
        $status = -1;
        exec("ping -n 1 -w 2000 " . escapeshellarg($ip), $stdout, $status);
        $stdout_str = implode("\n", $stdout);
        $is_up = ($status === 0 && strpos($stdout_str, 'Reply from') !== false && strpos(strtolower($stdout_str), 'unreachable') === false);
        
        $latency = null;
        if ($is_up) {
            if (preg_match('/time[=<]([\d\.]+)\s*ms/i', $stdout_str, $matches)) {
                $latency = floatval($matches[1]);
            } else {
                $latency = 1.0;
            }
        }
        
        $status_text = $is_up ? 'UP' : 'DOWN';
        
        // Sync back immediately
        $state = load_state();
        if (!empty($state)) {
            $state['states'][$ip] = $status_text;
            pclose(popen("start /B C:\\inetpub\\wwwroot\\alert\\python\\python.exe C:\\inetpub\\wwwroot\\alert\\native_poller.py", "r"));
    save_state($state);
        }
        
        if (file_exists(MONITOR_DATA_FILE)) {
            $mdata = json_decode(file_get_contents(MONITOR_DATA_FILE), true);
            foreach ($mdata['hosts'] as &$host) {
                if ($host['ip'] === $ip) {
                    $host['status'] = $status_text;
                    $host['latency'] = $latency;
                    $host['last_ping_time'] = date('Y-m-d H:i:s');
                    $host['last_stdout'] = $stdout_str;
                    
                    $hist = $host['ping_history'] ?? [];
                    $hist[] = $status_text;
                    if (count($hist) > 10) array_shift($hist);
                    $host['ping_history'] = $hist;
                }
            }
            file_put_contents(MONITOR_DATA_FILE, json_encode($mdata, JSON_PRETTY_PRINT));
        }
        
        echo json_encode([
            'status' => 'success',
            'ip' => $ip,
            'device_status' => $status_text,
            'latency' => $latency,
            'stdout' => $stdout_str
        ]);
        break;
        
    case 'hosts/mute':
        $input = json_decode(file_get_contents('php://input'), true);
        $ip = $input['ip'] ?? '';
        if (!$ip) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'IP is required.']);
            break;
        }
        
        $muted = [];
        $is_muted = false;
        $state = load_state();
        if (!empty($state)) {
            $muted = $state['muted'] ?? [];
            if (in_array($ip, $muted)) {
                $muted = array_values(array_diff($muted, [$ip]));
                $is_muted = false;
            } else {
                $muted[] = $ip;
                $is_muted = true;
            }
            $state['muted'] = $muted;
            pclose(popen("start /B C:\\inetpub\\wwwroot\\alert\\python\\python.exe C:\\inetpub\\wwwroot\\alert\\native_poller.py", "r"));
    save_state($state);
        }
        
        if (file_exists(MONITOR_DATA_FILE)) {
            $mdata = json_decode(file_get_contents(MONITOR_DATA_FILE), true);
            foreach ($mdata['hosts'] as &$host) {
                if ($host['ip'] === $ip) {
                    $host['muted'] = $is_muted;
                }
            }
            file_put_contents(MONITOR_DATA_FILE, json_encode($mdata, JSON_PRETTY_PRINT));
        }
        
        echo json_encode(['status' => 'success', 'ip' => $ip, 'muted' => $is_muted]);
        break;
        
    case 'diagnostics/tracert':
        $ip = $_GET['ip'] ?? '';
        if (!$ip) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'IP is required.']);
            break;
        }
        $stdout = [];
        exec("tracert -d -h 10 " . escapeshellarg($ip), $stdout);
        echo json_encode(['status' => 'success', 'stdout' => implode("\n", $stdout)]);
        break;
        
    case 'trigger-active-outages':
        $state = load_state();
        if (!empty($state)) {
            $hosts = $state['hosts'] ?? [];
            $triggered_count = 0;
            
            // Temporarily reset rate limits to ensure this manual hover override succeeds
            $limit_file = __DIR__ . DIRECTORY_SEPARATOR . 'temp' . DIRECTORY_SEPARATOR . 'whatsapp_rate_limit.json';
            if (file_exists($limit_file)) {
                @unlink($limit_file);
            }
            
            foreach ($hosts as $ip => $host) {
                if (($host['status'] ?? 'UP') === 'DOWN') {
                    $description = $host['description'] ?? $ip;
                    // Trigger alert with $is_test=true to bypass working hours / schedule filters
                    send_whatsapp_alert($ip, $description, 'DOWN', true);
                    $triggered_count++;
                }
            }
            
            echo json_encode([
                'status' => 'success',
                'message' => "Triggered alerts for $triggered_count active outages."
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'State file could not be loaded.']);
        }
        break;
        
    case 'test-alert':
        $state = load_state();
        if (!empty($state)) {
            $state['trigger_test_alert'] = true;
            pclose(popen("start /B C:\\inetpub\\wwwroot\\alert\\python\\python.exe C:\\inetpub\\wwwroot\\alert\\native_poller.py", "r"));
    save_state($state);
            
            $desc = isset($_GET['desc']) ? $_GET['desc'] : 'Test Alert Triggered';
            send_whatsapp_alert('10.133.22.8', $desc, 'DOWN');
            
            $state['trigger_test_alert'] = false;
            pclose(popen("start /B C:\\inetpub\\wwwroot\\alert\\python\\python.exe C:\\inetpub\\wwwroot\\alert\\native_poller.py", "r"));
    save_state($state);
            
            echo json_encode(['status' => 'success', 'message' => 'Test alert triggered and sent.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'State file could not be loaded.']);
        }
        break;
        
    case 'logs/download':
        $type = $_GET['type'] ?? 'system';
        if (file_exists(LOG_FILE)) {
            header('Content-Description: File Transfer');
            header('Content-Type: text/plain');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            
            if ($type === 'whatsapp') {
                header('Content-Disposition: attachment; filename="whatsapp_monitor.log"');
                $lines = file(LOG_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                $whatsapp_lines = array_filter($lines, function($line) {
                    return stripos($line, 'whatsapp') !== false;
                });
                echo implode("\n", $whatsapp_lines);
            } else {
                header('Content-Disposition: attachment; filename="ping_monitor.log"');
                header('Content-Length: ' . filesize(LOG_FILE));
                readfile(LOG_FILE);
            }
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Log file not found.']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Endpoint not found.']);
        break;
}
?>


