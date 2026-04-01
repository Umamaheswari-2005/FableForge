"""
FableForge Python Service - FastAPI
Handles NLP pipeline + LLM agent calls.
Consumed by the Node/Express server.
"""

from __future__ import annotations

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from agents import MODELS, agent_story, agent_moral, agent_refinement
from nlp_pipeline import (
    run_nlp_pipeline,
    detect_moral_sentence,
    jaccard_moral_clarity,
    agent_evaluator,
)

load_dotenv(dotenv_path=Path(__file__).with_name(".env"))

app = FastAPI(title="FableForge NLP Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ForgeRequest(BaseModel):
    prompt: str
    model: str = "llama-3.3-70b-versatile"
    keywords: list[str] = []


class ForgeResponse(BaseModel):
    story: str
    moral: str
    nlp: dict
    evaluation: dict
    keywords: list[str]


class NLPRequest(BaseModel):
    text: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "fableforge-python"}


@app.post("/forge", response_model=ForgeResponse)
def forge(req: ForgeRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        raw_story = agent_story(req.model, req.prompt, req.keywords)

        nlp_raw = run_nlp_pipeline(raw_story)
        moral_hint = detect_moral_sentence(raw_story)

        moral_theme = agent_moral(req.model, raw_story, moral_hint)

        refined_story, moral_sentence = agent_refinement(
            req.model, raw_story, moral_theme, nlp_raw["char_names"]
        )

        nlp_final = run_nlp_pipeline(refined_story)
        mc_score = jaccard_moral_clarity(moral_sentence, refined_story)
        evaluation = agent_evaluator(nlp_final, mc_score)

        return ForgeResponse(
            story=refined_story,
            moral=moral_sentence,
            nlp=nlp_final,
            evaluation=evaluation,
            keywords=nlp_final["keywords"],
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/nlp")
def nlp_only(req: NLPRequest):
    return run_nlp_pipeline(req.text)


@app.get("/models")
def list_models():
    return {
        "models": [
            {"id": model_id, "label": label}
            for model_id, label in MODELS.items()
        ]
    }
