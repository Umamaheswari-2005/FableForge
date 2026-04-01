# FableForge

FableForge is an AI-powered storytelling platform that generates rich fables, extracts their moral core, and evaluates the result with an NLP pipeline. The project combines a React frontend, a Node/Express API, and a FastAPI service powered by Groq-hosted LLMs plus linguistic analysis tools such as NLTK, spaCy, TextBlob, and VADER.

## Highlights

- Generate long-form fables from a simple prompt
- Choose between multiple Groq LLM models
- Extract keywords, entities, and character names from the generated story
- Score each story for engagement, coherence, sentiment, and moral clarity
- Persist stories and user feedback in MongoDB
- Browse recent stories through the frontend experience

## Architecture

FableForge is split into three parts:

1. `front-end`
React + Vite client for prompt input, story display, analytics badges, and recent fables.

2. `back-end`
Node.js + Express API that validates requests, proxies generation calls to the Python service, and stores stories in MongoDB.

3. `python-service`
FastAPI service that runs the LLM agent pipeline and NLP evaluation workflow.

## Tech Stack

- Frontend: React, Vite, Axios
- Backend: Node.js, Express, Mongoose, Axios, CORS, Morgan
- Python service: FastAPI, Uvicorn, LangChain Groq, spaCy, NLTK, TextBlob
- Database: MongoDB
- LLM provider: Groq

## Project Structure

```text
FableForge/
|- front-end/
|- back-end/
|- python-service/
|- package.json
|- package-lock.json
`- README.md
```

## How It Works

1. The user enters a story prompt in the frontend.
2. The Node/Express backend receives the request at `/api/fable/forge`.
3. The backend forwards the request to the FastAPI service.
4. The Python service:
   - generates a story
   - derives the moral theme
   - refines the ending
   - runs NLP analysis and scoring
5. The backend stores the final result in MongoDB.
6. The frontend displays the generated fable, moral, and evaluation metrics.

## Environment Variables

### `back-end/.env`

```env
MONGO_URI=mongodb://localhost:27017/FableForge
PORT=5000
CLIENT_URL=http://localhost:5173
PYTHON_SERVICE_URL=http://localhost:8000
```

### `python-service/.env`

```env
GROQ_API_KEY=your_groq_api_key_here
```

An example file is already included at `python-service/.env.example`.

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally or an accessible MongoDB URI
- A valid Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/Umamaheswari-2005/FableForge.git
cd FableForge
```

### 2. Install frontend and backend dependencies

```bash
npm install
cd front-end && npm install
cd ../back-end && npm install
cd ..
```

### 3. Install Python dependencies

```bash
cd python-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

Note: the Python service auto-downloads missing NLTK resources and attempts to install the `en_core_web_sm` spaCy model if it is not already available.

### 4. Configure environment files

Create these files locally:

- `back-end/.env`
- `python-service/.env`

Then add your MongoDB connection and Groq API key.

## Running the Application

Start the services in this order using separate terminals.

### Terminal 1: Python service

```bash
cd python-service
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 2: Node/Express backend

```bash
cd back-end
npm run dev
```

### Terminal 3: Frontend

```bash
cd front-end
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

Python health check: `http://localhost:8000/health`

## API Overview

### Backend routes

- `POST /api/fable/forge`  
  Generates a full story, moral, NLP summary, and evaluation scores.

- `POST /api/fable/keywords`  
  Extracts keywords and entity hints from input text.

- `GET /api/stories`  
  Returns recent saved stories with pagination.

- `GET /api/stories/:id`  
  Returns one story by id.

- `POST /api/stories/:id/feedback`  
  Saves `positive` or `negative` feedback for a story.

- `DELETE /api/stories/:id`  
  Deletes a saved story.

### Python routes

- `GET /health`
- `GET /models`
- `POST /forge`
- `POST /nlp`

## Output Data

Each generated story can include:

- Full story text
- Moral sentence
- Selected model metadata
- Extracted keywords
- Named entities and character names
- Sentiment, readability, coherence, richness, and engagement scores
- User feedback status

## Security Notes

- Never commit real API keys or `.env` files
- `node_modules`, build artifacts, and local environment files are ignored by Git
- Use `python-service/.env.example` as the safe template for shared setup

## Future Improvements

- Add authentication and user-specific story libraries
- Add deployment configuration for cloud hosting
- Add automated tests across all three services
- Improve observability and error reporting
- Support more model providers and prompt templates

## License

This project currently does not declare a license. Add one before public reuse or distribution if needed.
