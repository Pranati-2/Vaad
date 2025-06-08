def generate_debate_prompt(topic, styles_1, styles_2, name1=None, name2=None):
    debater1 = name1 if name1 else "Debater 1"
    debater2 = name2 if name2 else "Debater 2"

    return f"""
Simulate a philosophical debate on the topic: "{topic}"

{debater1} follows these styles: {', '.join(styles_1)}
{debater2} follows these styles: {', '.join(styles_2)}

Style meanings:
- Vāda: Honest search for truth
- Jalpa: Competitive argument
- Vitandā: Destructive refutation
- Katha: Narrative storytelling
- Tarka: Logical reasoning
- Sambhāṣā: Mutual dialogue
- Charchā: Analytical discussion
- Parisamvāda: Investigative inquiry
- Shastrārtha: Scriptural debate
- Prashna-Uttara: Question-answer exchange

Instructions:
- Alternate turns.
- Stay within the styles.
- Label each turn clearly.
- Use one or many styles while formulating a response

- {debater1}:
- {debater2}:
- {debater1}:
- {debater2}:
"""
