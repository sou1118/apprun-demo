use axum::{
    extract::Path,
    http::{self, HeaderValue, Method, StatusCode},
    routing::{delete, get, patch, post},
    Json, Router,
};
use http::header;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

#[derive(Debug, Serialize, Clone)]
struct Todo {
    id: u64,
    text: String,
    completed: bool,
}

#[derive(Debug, Deserialize)]
struct CreateTodo {
    text: String,
}

#[derive(Debug, Deserialize)]
struct UpdateTodo {
    text: Option<String>,
    completed: Option<bool>,
}

type Db = Arc<Mutex<HashMap<u64, Todo>>>;

#[tokio::main]
async fn main() {
    let db: Db = Arc::new(Mutex::new(HashMap::new()));

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_credentials(true)
        .allow_headers([header::CONTENT_TYPE, header::ACCEPT, header::AUTHORIZATION]);

    let app = Router::new()
        .route("/api/todos", get(list_todos))
        .route("/api/todos", post(create_todo))
        .route("/api/todos/{id}", get(get_todo))
        .route("/api/todos/{id}", patch(update_todo))
        .route("/api/todos/{id}", delete(delete_todo))
        .fallback_service(ServeDir::new("static"))
        .layer(cors)
        .with_state(db);

    println!("Server running on http://localhost:3000");
    let addr: std::net::SocketAddr = "0.0.0.0:3000".parse().unwrap();
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}

/// 全てのTodoを取得
async fn list_todos(state: axum::extract::State<Db>) -> Json<Vec<Todo>> {
    let db = state.lock().await;
    Json(db.values().cloned().collect())
}

/// 新しいTodoを作成
async fn create_todo(
    state: axum::extract::State<Db>,
    Json(payload): Json<CreateTodo>,
) -> (StatusCode, Json<Todo>) {
    let mut db = state.lock().await;

    let id = (db.len() as u64) + 1;
    let todo = Todo {
        id,
        text: payload.text,
        completed: false,
    };

    db.insert(id, todo.clone());

    (StatusCode::CREATED, Json(todo))
}

/// 特定のTodoを取得
async fn get_todo(
    state: axum::extract::State<Db>,
    Path(id): Path<u64>,
) -> Result<Json<Todo>, StatusCode> {
    let db = state.lock().await;

    if let Some(todo) = db.get(&id) {
        Ok(Json(todo.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

/// Todoを更新
async fn update_todo(
    state: axum::extract::State<Db>,
    Path(id): Path<u64>,
    Json(payload): Json<UpdateTodo>,
) -> Result<Json<Todo>, StatusCode> {
    let mut db = state.lock().await;

    if let Some(todo) = db.get_mut(&id) {
        if let Some(text) = payload.text {
            todo.text = text;
        }
        if let Some(completed) = payload.completed {
            todo.completed = completed;
        }
        Ok(Json(todo.clone()))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

/// Todoを削除
async fn delete_todo(state: axum::extract::State<Db>, Path(id): Path<u64>) -> StatusCode {
    let mut db = state.lock().await;

    if db.remove(&id).is_some() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}
