// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::{copy, Cursor, Write, Read}};

use anyhow::{Result};

use rusqlite::{Connection};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct Post {
    id: i32,
    content : String
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn download(url: String, tags: String, path: String) -> () {
    println!("Writing {url} to {path}");
    download_and_save_file(url.as_str(), tags.as_str(), path.as_str()).await.expect("error while downloading file");
}

#[tauri::command]
async fn fetch(url : String) -> String {
    reqwest::get(url).await.expect("something went wrong").text().await.expect("Something went wrong")
}

async fn download_and_save_file(url: &str, tags: &str, path: &str) -> Result<()> {
    println!("{url} \n {tags} \n {path}");
    let response = reqwest::get(url).await?;

    let mut file = File::create(path)?;

    let mut content = Cursor::new(response.bytes().await?);
    copy(&mut content, &mut file)?;

    Ok(())
}

#[tauri::command]
fn get_configurations() -> String {
    let mut file = File::open("configurations.json").expect("Unable to open file");
    let mut contents = String::new();
    file.read_to_string(&mut contents).expect("Unable to read file");
    contents
}

#[tauri::command]
fn save_configurations(configurations: String) -> () {
    let mut file = File::create("configurations.json").expect("Unable to create file");
    file.write_all(configurations.as_bytes()).expect("Unable to write file");
}

#[tauri::command]
fn save_post(content : String) -> bool {
    let conn = Connection::open("test.db").expect("Unable to open database");

    println!("Saving post: {}", content);

    match conn.execute(
        "INSERT INTO posts (content) 
            VALUES (?1)
            ON CONFLICT (content) DO UPDATE SET content = ?1    
        ",
        [content],
    ) {
        Ok(_) => true,
        Err(err) => {
            println!("Error: {}", err);
            false
        }
    }
}

#[tauri::command]
fn get_posts() -> String {
    let conn = Connection::open("test.db").expect("Unable to open database");

    let mut statement = conn.prepare("SELECT id, content FROM posts").expect("Unable to prepare statement");
    let posts_iter = statement.query_map([], |row|{
        Ok(
            Post {
            id: row.get(0)?,
            content: row.get(1)?
        }
    )
    }).expect("Unable to query map");

    let mut res = Vec::new();
    for post in posts_iter {
        res.push(post.unwrap());
    }

    serde_json::to_string(res.as_slice()).expect("Unable to serialize")
}



#[tokio::main]
async fn main() {
    let conn = Connection::open("test.db").expect("Unable to open database");
    
    conn.execute(
        "CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL UNIQUE
        )",
        [],
    ).expect("Unable to create table");


    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, download, get_configurations, save_configurations, save_post, get_posts, fetch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
