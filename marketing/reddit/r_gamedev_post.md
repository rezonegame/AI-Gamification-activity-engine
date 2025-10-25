
**Title**: I built a tool to analyze player behavior using Activity Theory (the stuff Vygotsky was into).

**Body**:

Hey r/gamedev,

As game developers, we're masters of engagement, but sometimes it's hard to step back and analyze our own systems structurally. I built a tool for this, using a lens you might not expect: Activity Theory.

It's a framework from psychology (Vygotsky, Leont'ev) that views any human activity—including playing a game—as a complete "system" of a **Subject** (player), **Object** (goal), **Tools** (controls/UI), **Community** (other players), **Rules** (game mechanics), and **Division of Labor** (roles).

I created the **Activity Theory Design Engine**, a free web tool where you describe a game mechanic or loop, and an AI guides you through an analysis to find the "contradictions" in your design.
-   Why does this fun mechanic feel pointless? (Maybe the **Tool** conflicts with the **Object**).
-   Why won't players engage with my social feature? (Maybe the **Rules** of the game discourage interacting with the **Community**).

It helps formalize the gut feelings we have about our designs and pinpoint the *systemic* reason something isn't working. It's less about "gamifying" and more about deep design analysis.

**How it works:** It uses a series of very specific "meta-prompts" to guide the Gemini API. Each meta-prompt makes the AI act like an expert in one area, so the output is focused and high-quality.

I'm looking for feedback to make it better. Is this kind of systemic analysis useful for your design process? Are there other frameworks you'd like to see? All thoughts are welcome.

You can try it out here: [Link to your live application]

Thanks for checking it out!
