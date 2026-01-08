Art of War — Text Preprocessing Notes 
## Source of the text

Source: Public-domain version of The Art of War (Project Gutenberg)

Format used: Plain text (.txt)

Language: English translation

The text is used locally and unchanged in meaning.

## Goal of preprocessing

Prepare the book text so that:

Each section is semantically clear

Chapters are preserved

Retrieval is precise

Non-book content does not pollute answers

No summarization or rewriting is performed.

## Content that was removed

The following sections were completely removed:

Project Gutenberg license text

Editor’s notes

Translator’s commentary

Footnotes

Prefaces and introductions

Table of contents

Copyright notices

Page numbers and headers

Reason: These sections introduce noise and are not part of the core book content.

## Content that was kept

The following content was explicitly preserved:

Chapter titles

Chapter numbering

Original paragraph structure

Aphorisms and short statements

Ordering of chapters

This preserves traceability for citations.

## Chapter structure

Each chapter follows this structure:

Chapter <number>: <title>

<chapter text>

Examples:

Chapter I. Laying Plans

Chapter III. Attack by Stratagem

Chapter titles are required for citation in agent answers.

## Text normalization rules

The following normalizations were applied:

Removed excessive blank lines

Normalized line breaks within paragraphs

Converted smart quotes to standard quotes

Removed inconsistent indentation

Preserved sentence boundaries

No spelling or wording changes were made.

## Chunking strategy (for retrieval)

Chunks are created using these rules:

Chunk size: ~**300**–**500** tokens

Chunks do not cross chapter boundaries

Aphorisms are kept intact

Paragraphs are not split mid-thought

Each chunk represents one coherent idea.

## Metadata attached to each chunk

Each chunk must include:

chapter_number

chapter_title

chunk_index

source_file: art_of_war.txt

This metadata is required for accurate citations.

## What is intentionally NOT done

The preprocessing step does not:

Summarize content

Interpret meaning

Reorder sections

Add headings

Add explanations

All intelligence is deferred to the agent logic.

## Validation checklist

Preprocessing is considered correct if:

Every answerable question can be traced to a chapter

No answer comes from license or commentary text

Chunks make sense in isolation

Chapter titles appear in agent citations

## Rationale

Strict preprocessing:

Reduces hallucinations

Improves retrieval accuracy

Makes agent behavior predictable

Simplifies evaluation

This document exists to make preprocessing explicit and reproducible.

## Status

Preprocessing is complete when:

data/art_of_war.txt contains only book content

Chapters are clearly labeled

No external text remains