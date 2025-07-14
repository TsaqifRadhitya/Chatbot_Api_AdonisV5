---

# 📘 Chatbot API Documentation

## 🔹 Deskripsi

Chatbot API adalah layanan RESTful yang dibangun menggunakan **AdonisJS v5** dan **PostgreSQL**. API ini menerima pesan dari pengguna, meneruskannya ke **API publik eksternal**, serta menyimpan percakapan ke dalam database.

---

## 🔸 Endpoints

### 📨 POST `/api/questions`

Mengirim pesan ke chatbot dan mendapatkan respons dari API eksternal.

#### Request Body

```json
{
  "message": "halo",
  "session_id": "1309c142-3535-45b2-acdf-8bfbe59c3b9a"
}
````

| Field       | Tipe   | Deskripsi                        | Optional |
| ----------- | ------ | -------------------------------- | -------- |
| message     | string | Pesan yang dikirim oleh pengguna | ❌        |
| session\_id | UUID   | ID sesi untuk melacak percakapan | ✅        |

#### Response (200 OK)

```json
{
  "status": 200,
  "message": "success",
  "session_id": "1309c142-3535-45b2-acdf-8bfbe59c3b9a",
  "data": [
    {
      "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these                       services. Could you please clarify your inquiry? 😊",
      "properties": {
      "source": {
          "id": "OpenAIModel-b1JlZ",
          "display_name": "OpenAI",
          "source": "gpt-4o-mini"
      },
      "icon": "OpenAI",
      "allow_markdown": false,
      "state": "complete",
      "text_color": "",
      "background_color": ""
    },
      "category": "message",
      "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
      "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
      "suggest_links": []
    }
  ]
}
```

### Error Response

#### `400 Bad Request`

Permintaan tidak valid, biasanya karena field wajib tidak dikirim.

```json
{
  "status": 400,
  "message": "Validation failure",
  "errors": [
    {
      "rule": "required",
      "field": "message",
      "message": "required validation failed"
    }
  ]
}
```

#### `404 Not Found`

Data tidak ditemukan, misalnya ketika `session_id` tidak cocok dengan percakapan manapun.

```json
{
  "status": 404,
  "message": "Not found",
  "error": "Conversation with your session_id is not found"
}
```

---

### 📄 GET `/api/conversation`

Mengambil daftar percakapan yang tersimpan beserta isi pesannya. Endpoint ini mendukung pagination.

#### Query Parameters

| Field | Tipe   | Deskripsi                      | Optional |
| ----- | ------ | ------------------------------ | -------- |
| page  | number | Halaman yang ingin ditampilkan | ✅        |
| limit | number | Jumlah data per halaman        | ✅        |

#### Contoh Request

```
GET /api/conversation?page=1&limit=10
```

#### Response (200 OK)

```json

{
  "status": 200,
  "message": "success",
  "meta": {
    "total": 20,
    "perPage": 10,
    "currentPage": 1,
    "lastPage": 2,
    "nextPageUrl": "/api/conversation?page=2&limit=10",
    "prevPageUrl": null
  },
  "data": [
    {
      "id": 1,
      "session_id": "1309c142-3535-45b2-acdf-8bfbe59c3b9a",
      "last_messages": "halo",
      "messages": [
        {
          "sender_type": "question",
          "message": "halo"
        },
        {
      "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these                       services. Could you please clarify your inquiry? 😊",
      "properties": {
      "source": {
          "id": "OpenAIModel-b1JlZ",
          "display_name": "OpenAI",
          "source": "gpt-4o-mini"
      },
      "icon": "OpenAI",
      "allow_markdown": false,
      "state": "complete",
      "text_color": "",
      "background_color": ""
    },
      "category": "message",
      "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
      "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
      "suggest_links": []
    }
      ]
    }
  ]
}
```

---

## 📦 Metadata Pagination

| Field       | Tipe   | Deskripsi                                    |
| ----------- | ------ | -------------------------------------------- |
| total       | number | Total seluruh data yang tersedia             |
| perPage     | number | Jumlah data per halaman                      |
| currentPage | number | Halaman yang sedang diakses                  |
| lastPage    | number | Halaman terakhir berdasarkan total dan limit |
| nextPageUrl | string | URL ke halaman berikutnya (jika ada)         |
| prevPageUrl | string | URL ke halaman sebelumnya (jika ada)         |

---

### 📨 GET `/api/conversation/:id`

Mengambil detail percakapan berdasarkan `id`, termasuk seluruh pesan di dalamnya.

#### URL Parameter

| Field | Tipe   | Deskripsi                 | Optional |
|-------|--------|----------------------------|----------|
| id    | number | ID percakapan yang dicari  | ❌       |

#### Contoh Request

```
GET /api/conversation/1
```
#### Response (200 OK)
```json
{
    "status": 200,
    "message": "success",
    "data": {
        "id": 1,
        "session_id": "1309c142-3535-45b2-acdf-8bfbe59c3b9a",
        "lastMessages": {
            "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these services. Could you please clarify your inquiry? 😊",
            "properties": {
                "source": {
                    "id": "OpenAIModel-b1JlZ",
                    "display_name": "OpenAI",
                    "source": "gpt-4o-mini"
                },
                "icon": "OpenAI",
                "allow_markdown": false,
                "state": "complete",
                "text_color": "",
                "background_color": ""
            },
            "category": "message",
            "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
            "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
            "suggest_links": []
        },
        "messages": [
            {
                "id": 16,
                "sender_type": "answer",
                "message": {
                    "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these services. Could you please clarify your inquiry? 😊",
                    "properties": {
                        "source": {
                            "id": "OpenAIModel-b1JlZ",
                            "display_name": "OpenAI",
                            "source": "gpt-4o-mini"
                        },
                        "icon": "OpenAI",
                        "allow_markdown": false,
                        "state": "complete",
                        "text_color": "",
                        "background_color": ""
                    },
                    "category": "message",
                    "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
                    "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
                    "suggest_links": []
                },
                "createdAt": "2025-07-14T05:13:36.351+00:00",
                "updatedAt": "2025-07-14T05:13:36.352+00:00",
                "conversationId": 5
            }
        ]
    }
}
```

### Error Response

#### `404 Bad Request`

Data tidak ditemukan, misalnya ketika conversation dengan id tersebut tidak ditemukan.
```json
{
    "status": 404,
    "message": "not found",
    "error": "data not found"
}
```
---

### 📨 DELETE `/api/conversation/:id`
Menghapus conversation berdasarkan `id`, pada suatu conversation.
#### Contoh Request

```
DELETE /api/conversation/1
```
#### Response (200 OK)
```json
{
    "status": 200,
    "message": "success",
    "data": {
        "id": 1,
        "session_id": "1309c142-3535-45b2-acdf-8bfbe59c3b9a",
        "last_messages": {
            "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these services. Could you please clarify your inquiry? 😊",
            "properties": {
                "source": {
                    "id": "OpenAIModel-b1JlZ",
                    "display_name": "OpenAI",
                    "source": "gpt-4o-mini"
                },
                "icon": "OpenAI",
                "allow_markdown": false,
                "state": "complete",
                "text_color": "",
                "background_color": ""
            },
            "category": "message",
            "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
            "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
            "suggest_links": []
        },
        "createdAt": "2025-07-14T05:13:36.312+00:00",
        "updatedAt": "2025-07-14T05:13:36.333+00:00"
    }
}
```

### Error Response
#### `404 Bad Request`
Data tidak ditemukan, misalnya ketika message dengan id tersebut tidak ditemukan.
```json
{
    "status": 404,
    "message": "not found",
    "error": "data not found"
}
```
---

### 📨 DELETE `/api/conversation/message/:id`
Menghapus message berdasarkan `id`, pada suatu conversation.

#### Contoh Request

```
DELETE /api/conversation/message/1
```

#### Response (200 OK)
```json
{
    "status": 200,
    "message": "success",
    "data": {
        "id": 16,
        "sender_type": "answer",
        "message": {
            "text": "I'm here to assist you with inquiries related to the Public Information Disclosure website and the Online Aspirations and Complaints Service in East Java. However, it seems your message doesn't contain a specific question or topic related to these services. Could you please clarify your inquiry? 😊",
            "properties": {
                "source": {
                    "id": "OpenAIModel-b1JlZ",
                    "display_name": "OpenAI",
                    "source": "gpt-4o-mini"
                },
                "icon": "OpenAI",
                "allow_markdown": false,
                "state": "complete",
                "text_color": "",
                "background_color": ""
            },
            "category": "message",
            "id": "803966c8-c95c-4a6a-99af-1e9ef2bcda01",
            "flow_id": "52776abd-422d-40f0-a44a-dd074ecf6c40",
            "suggest_links": []
        },
        "created_at": "2025-07-14T05:13:36.351+00:00",
        "updated_at": "2025-07-14T05:13:36.352+00:00",
        "conversation_id": 5
    }
}
```

### Error Response

#### `404 Bad Request`
Data tidak ditemukan, misalnya ketika message dengan id tersebut tidak ditemukan.
```json
{
    "status": 404,
    "message": "not found",
    "error": "data not found"
}
```
