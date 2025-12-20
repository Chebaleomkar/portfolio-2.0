---
title: "Your First n8n Workflow - A Beginner's Guide"
description: "Learn how to create your first n8n workflow with this step-by-step beginner's guide. We'll build a simple automation that fetches jokes from an API."
date: "2025-12-20"
tags: ["n8n", "Automation", "Workflow", "Tutorial", "Beginner"]
---

# Your First n8n Workflow - A Beginner's Guide

n8n is a powerful **open-source workflow automation tool** that lets you connect different apps and automate tasks without writing much code. Think of it as a visual programming tool for automation!

## What is n8n?

n8n (pronounced "n-eight-n") allows you to:

- Connect **400+ apps** together
- Automate repetitive tasks
- Build complex workflows visually
- Self-host for complete data privacy

---

## Let's Build Your First Workflow

We'll create a simple workflow that:
1. Triggers manually
2. Fetches a random joke from an API
3. Displays the joke

### Step 1: Start n8n

If you haven't installed n8n yet, the quickest way is:

```bash
npx n8n
```

This will start n8n at `http://localhost:5678`

### Step 2: Create a New Workflow

1. Click on **"New Workflow"** in the top right
2. Give it a name like "My First Workflow"

### Step 3: Add the Manual Trigger

1. Click the **"+"** button
2. Search for **"Manual Trigger"**
3. Click to add it

This node lets you run the workflow manually with a button click.

### Step 4: Add an HTTP Request Node

1. Click the **"+"** after the trigger
2. Search for **"HTTP Request"**
3. Configure it:
   - **Method**: GET
   - **URL**: `https://official-joke-api.appspot.com/random_joke`

### Step 5: Test Your Workflow

1. Click **"Execute Workflow"** at the bottom
2. Watch the data flow through your nodes!
3. Click on the HTTP Request node to see the joke

---

## Understanding the Output

The API returns JSON like this:

```json
{
  "type": "general",
  "setup": "Why don't scientists trust atoms?",
  "punchline": "Because they make up everything!",
  "id": 1
}
```

---

## Key Concepts You Just Learned

| Concept | Description |
|---------|-------------|
| **Nodes** | Building blocks of workflows |
| **Trigger** | What starts your workflow |
| **HTTP Request** | Fetches data from APIs |
| **Execution** | Running your workflow |

---

## What's Next?

Now that you've built your first workflow, try these:

1. **Add more nodes** - Chain multiple actions together
2. **Use different triggers** - Schedule, Webhook, Email
3. **Explore integrations** - Slack, Google Sheets, Discord
4. **Add conditions** - IF nodes for branching logic

---

## Pro Tips for Beginners

- **Always test nodes individually** before connecting them
- **Use the "Execute Node" button** to test one node at a time
- **Check the documentation** - n8n has excellent docs
- **Start simple** - Build complexity gradually

---

## Conclusion

Congratulations! 🎉 You've just built your first n8n workflow. This simple example demonstrates the core concepts that power even the most complex automations.

The beauty of n8n is that once you understand these basics, you can build almost anything - from simple notifications to complex business processes.

---

*Happy automating!*