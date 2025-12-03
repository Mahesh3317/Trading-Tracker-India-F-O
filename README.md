# Trading Tracker India F&O

A comprehensive platform for Indian F&O traders to log, analyze, and improve their performance.

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, ShadCN UI
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (Production) / SQLite (Dev)
- **AI**: Integration with LLMs for trade summaries and coaching

## Getting Started

### Prerequisites

- Node.js
- Python 3.8+

### Setup

1.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

2.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

## Features

- Trade Journaling
- Advanced Analytics
- Real-time Option Chain
- AI Coach & Summaries
