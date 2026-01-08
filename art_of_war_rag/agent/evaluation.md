Art of War Agent — Evaluation 

## Purpose

This document defines a fixed evaluation set used to verify that the agent:

    Answers strictly from the text

    Refuses when appropriate

    Does not hallucinate

    Provides correct citations

Any change to the agent or retrieval must be tested against this file.

## Evaluation rules

For each question:

    The agent must either answer with sources or refuse

    Partial answers are failures

    Missing or incorrect citations are failures

    Confident but unsupported answers are failures

### Test Questions

**Q1**

Question: What is the highest form of excellence according to Sun Tzu?

Expected behavior: Answerable.

Expected sources:

    Chapter III. Attack by Stratagem

**Q2**

Question: What does Sun Tzu say about winning without fighting?

Expected behavior: Answerable.

Expected sources:

    Chapter III. Attack by Stratagem

**Q3**

Question: How does Sun Tzu describe the importance of deception?

Expected behavior: Answerable.

Expected sources:

    Chapter I. Laying Plans

    Chapter VI. Weak Points and Strong

**Q4**

Question: What does the book say about attacking fortified cities?

Expected behavior: Answerable.

Expected sources:

    Chapter III. Attack by Stratagem

**Q5**

Question: According to the text, what factors determine victory or defeat?

Expected behavior: Answerable.

Expected sources:

    Chapter I. Laying Plans

**Q6**

Question: How many types of spies are described, and what are they?

Expected behavior: Answerable.

Expected sources:

    Chapter XIII. The Use of Spies

**Q7**

Question: What guidance does Sun Tzu give about prolonged warfare?

Expected behavior: Answerable.

Expected sources:

    Chapter II: Waging War

**Q8**

Question: How should an army treat prisoners of war?

Expected behavior: Answerable.

Expected sources:

    Chapter II: Waging War

**Q9**

Question: How can the principles of The Art of War be applied to modern business strategy?

Expected behavior: Must refuse.

Expected response:

    “The answer is not found in The Art of War.”

**Q10**

Question: What does Sun Tzu think about leadership styles in startups?

Expected behavior: Must refuse.

Expected response:

    “The answer is not found in The Art of War.”

**Q11**

Question: Does Sun Tzu discuss naval warfare in detail?

Expected behavior: Must refuse unless explicitly supported by text.

Expected response:

    “The answer is not found in The Art of War.”

**Q12**

Question: What moral philosophy influenced Sun Tzu’s thinking?

Expected behavior: Must refuse.

Expected response:

    “The answer is not found in The Art of War.”

## Scoring criteria 

### Pass

    Correct answer or correct refusal

    Citations include chapter number and title

    No hallucinated details

    Neutral, factual tone

### Fail

    Any unsupported claim

    Missing or incorrect sources

    Modern interpretation

    Overly verbose or motivational language

    Regression policy

## If a previously passing question fails:

    Do not add prompt hacks

    Fix retrieval or chunking

    Update preprocessing if necessary

    Re-run full evaluation set

    Definition of completion

## The agent is considered v1 complete when:

    All answerable questions pass

    All refusal questions refuse correctly

    No hallucinations are observed