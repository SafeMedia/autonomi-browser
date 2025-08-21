use dirs::data_dir;
use std::fs;
use std::path::PathBuf;

use anttp::config::anttp_config::AntTpConfig;

fn prepare_directories() -> (String, String) {
    // Get OS-specific "data" directory (e.g., ~/.local/share on Linux, AppData/Roaming on Windows, etc.)
    let base_dir: PathBuf = data_dir()
        .expect("Cannot find system data dir")
        .join("autonomi-browser");

    let media_dir = base_dir.join("media");
    let cache_dir = base_dir.join("cache");

    // Create them if they don't exist
    fs::create_dir_all(&media_dir).expect("Failed to create media dir");
    fs::create_dir_all(&cache_dir).expect("Failed to create cache dir");

    (
        media_dir.to_string_lossy().to_string(),
        cache_dir.to_string_lossy().to_string(),
    )
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            // Prepare folders before starting server
            let (media_path, cache_path) = prepare_directories();

            // Spawn ANTP server in background thread
            std::thread::spawn(move || {
                println!(
                    "ANTTP starting. Media: {}, Cache: {}",
                    media_path, cache_path
                );

                /*

                let peers: Vec<Multiaddr> = [
                    "/ip4/206.189.96.49/udp/49841/quic-v1/p2p/12D3KooWQp3XJ6SRVLvLhezJQ7QgTQWFwDDVvwrXZQrFL4NfebWX",
                    "/ip4/142.93.37.4/udp/40184/quic-v1/p2p/12D3KooWPC8q7QGZsmuTtCYxZ2s3FPXPZcS8LVKkayXkVFkqDEQB",
                    "/ip4/157.245.40.2/udp/33698/quic-v1/p2p/12D3KooWNyNNTGfwGf6fYyvrk4zp5EHxPhNDVNB25ZzEt2NXbCq2",
                    "/ip4/157.245.40.2/udp/33991/quic-v1/p2p/12D3KooWHPyZVAHqp2ebzKyxxsYzJYS7sNysfcLg2s1JLtbo6vhC",
                ]
                .iter()
                .map(|s| s.parse().expect("Invalid multiaddr"))
                .collect();


                let config = AntTpConfig {
                    listen_address: "127.0.0.1:18888".parse::<SocketAddr>().unwrap(),
                    static_file_directory: media_path,
                    wallet_private_key: "".to_string(),
                    download_threads: 4, // pick something reasonable
                    app_private_key: "".to_string(),
                    bookmarks: vec![], // assuming it's a Vec<String> or similar
                    uploads_disabled: false,
                    cached_mutable_ttl: 60, // seconds
                    peers,
                    map_cache_directory: cache_path,
                    evm_network: "".to_string(), // or "local" / "arbitrumOne"
                    immutable_disk_cache_size: 512, // in MB
                    immutable_memory_cache_size: 64, // in MB
                };

                */

                let app_config = AntTpConfig::read_args();

                if let Err(e) = tauri::async_runtime::block_on(anttp::run_server(app_config)) {
                    eprintln!("ANTTP server failed: {}", e);
                } else {
                    println!("ANTTP server exited cleanly.");
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
