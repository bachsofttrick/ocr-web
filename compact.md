# How /compact Works

## In Claude Code

When you run `/compact`, Claude Code:

1. **Takes the conversation history** up to that point
2. **Uses Claude to create a summary** - Extracts key information like:
   - What tasks were completed
   - Important decisions made
   - File changes and their purposes
   - Context needed for future work
   - Any open questions or TODOs
3. **Replaces the full history** with this condensed summary in the context window
4. **Continues the session** - Future messages reference the summary instead of the full history

The summary is typically much shorter than the original conversation (maybe 10-20% of the original tokens), which frees up space for continued work.

## Equivalent Approach for ChatGPT or Other Models

Since other models don't have a built-in `/compact` command, you'd manually prompt them:

### Example Prompt:

```
Please create a comprehensive summary of our conversation so far. Include:

1. All tasks completed and files modified (with specific paths and changes)
2. Important technical decisions and their rationale
3. Current state of the project
4. Any open issues, TODOs, or next steps
5. Key context needed to continue working effectively

Format this as a concise but complete summary that could replace our conversation history. After providing the summary, I'll start a new chat and paste it to continue our work.
```

### Workflow:

1. **Prompt for summary** (using above prompt)
2. **Copy the summary** the model provides
3. **Start a new chat** in ChatGPT
4. **Paste the summary** as context: "Here's what we've done so far: [summary]. Let's continue..."
5. **Continue working** with fresh token space

### Better Alternative - Custom Instructions:

If you use ChatGPT regularly for coding, you could add to your custom instructions:

```
When I say "COMPACT", create a detailed summary of our conversation including all completed tasks, file changes, decisions made, and context needed to continue. Format it so I can paste it into a new chat to continue our work.
```

Then just type "COMPACT" when needed.

## Key Difference

- **Claude Code /compact**: Automatic, seamless, stays in same session
- **Manual approach**: Requires copy-paste to new chat, but achieves similar result

## When to Use /compact

Use `/compact` when:
- The conversation is getting long (approaching context limits)
- You want to continue working but free up token space
- You've completed several tasks and want to condense the history
- You want to maintain session continuity without starting fresh

## Three Scenarios Compared

1. **Continue without /compact**: I remember everything we discussed, but eventually run out of context space
2. **Use /compact**: I remember the important parts in summarized form, freeing up space to continue
3. **Exit entirely**: New session starts fresh - I only know what's in the files (like CLAUDE.md, code, git history)

Think of /compact like compressing a file - the information is still there, just takes up less space. Exiting is like closing the program entirely.

## Manual Approach for Any AI

The manual approach is how people have been doing "conversation memory management" with AI coding assistants before built-in commands like /compact existed. It works with any AI model:

1. Ask for a summary at any point
2. Copy it
3. Start a new chat with the summary as context
4. Continue working with fresh token budget

This technique is especially useful when working on long coding sessions with ChatGPT, Claude (web), Gemini, or any other AI assistant that doesn't have automatic conversation compression.
