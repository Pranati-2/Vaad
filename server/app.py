# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# from prompt_builder import generate_debate_prompt

# app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend

# GROQ_API_KEY = "API_KEY"
# GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# @app.route('/api/debate', methods=['POST'])
# def get_debate():
#     data = request.json
#     topic = data['topic']
#     styles_1 = data['styles_1']
#     styles_2 = data['styles_2']
#     name1 = data.get('name1')
#     name2 = data.get('name2')

#     prompt = generate_debate_prompt(topic, styles_1, styles_2, name1, name2)

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": "llama3-70b-8192",
#         "messages": [{"role": "user", "content": prompt}],
#         "temperature": 0.7
#     }

#     response = requests.post(GROQ_URL, headers=headers, json=payload)
#     result = response.json()
#     return jsonify({"response": result["choices"][0]["message"]["content"]})


from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS
import requests
from prompt_builder import generate_debate_prompt

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = "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"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.route('/api/debate', methods=['POST'])
def get_debate():
    data = request.json
    topic = data['topic']
    styles_1 = data['styles_1']
    styles_2 = data['styles_2']
    name1 = data.get('name1') or "Debater 1"
    name2 = data.get('name2') or "Debater 2"
    messages = data.get('messages', [])

    if not messages:
        # Initialize with custom prompt
        system_prompt = generate_debate_prompt(topic, styles_1, styles_2, name1, name2)
        messages = [{"role": "system", "content": system_prompt}]
    
    payload = {
        "model": "llama3-70b-8192",
        "messages": messages,
        "temperature": 0.7
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(GROQ_URL, headers=headers, json=payload)
    result = response.json()
    reply = result["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})

    return jsonify({"response": reply, "messages": messages})



if __name__ == '__main__':
    app.run(debug=True, port=5000)
