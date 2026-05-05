# !pip install -q unsloth transformers datasets accelerate peft trl bitsandbytes

# from google.colab import files
# uploaded_files = files.upload()

# import json
# from datasets import Dataset

# file_name = list(uploaded_files.keys())[0]

# data = []
# with open(file_name, "r", encoding="utf-8") as f:
#     for i, line in enumerate(f):
#         line = line.strip()
#         if not line:
#             continue
#         try:
#             data.append(json.loads(line))
#         except Exception as e:
#             print(f"Skipping line {i}: {e}")

# dataset = Dataset.from_list(data)
# print(dataset[0])

# def format_prompt(example):
#     instruction = str(example.get("instruction") or "").strip()
#     input_text = str(example.get("input") or "").strip()
#     output = str(example.get("output") or "").strip()

#     if output == "":
#         return {"text": ""}

#     # Clean numbered steps
#     lines = output.split("\n")
#     fixed_lines = []
#     for i, line in enumerate(lines, 1):
#         line = line.strip()
#         if not line:
#             continue
#         clean_line = line.lstrip("0123456789. ").strip()
#         fixed_lines.append(f"{i}. {clean_line}")

#     output = "\n".join(fixed_lines)

#     prompt = f"""### Instruction:
# You are an expert roadmap generator AI.

# - Understand messy input
# - Extract main goal
# - Generate step-by-step roadmap
# - Each step must include short explanation

# ### User Request:
# {instruction} {input_text}

# ### Response:
# {output}"""

#     return {"text": prompt}

# dataset = dataset.map(format_prompt)
# dataset = dataset.filter(lambda x: x["text"] != "")


# from unsloth import FastLanguageModel

# model_name = "unsloth/Phi-3-mini-4k-instruct-bnb-4bit"

# model, tokenizer = FastLanguageModel.from_pretrained(
#     model_name=model_name,
#     max_seq_length=2048,   # 🔥 bigger context
#     load_in_4bit=True,
# )


# model = FastLanguageModel.get_peft_model(
#     model,
#     r=32,   # 🔥 higher than before (better learning)
#     target_modules=[
#         "q_proj", "k_proj", "v_proj", "o_proj",
#         "gate_proj", "up_proj", "down_proj",
#     ],
#     lora_alpha=64,
#     lora_dropout=0,
#     bias="none",
#     use_gradient_checkpointing="unsloth",
# )


# from transformers import TrainingArguments
# from trl import SFTTrainer

# trainer = SFTTrainer(
#     model=model,
#     tokenizer=tokenizer,
#     train_dataset=dataset,
#     dataset_text_field="text",
#     max_seq_length=2048,
#     args=TrainingArguments(
#         per_device_train_batch_size=2,
#         gradient_accumulation_steps=4,
#         warmup_steps=10,
#         max_steps=500,
#         num_train_epochs=3,
#         learning_rate=2e-4,
#         fp16=True,
#         logging_steps=10,
#         output_dir="outputs",
#         optim="adamw_8bit",
#     ),
# )

# trainer.train()

# # Test The Model
# from unsloth import FastLanguageModel
# FastLanguageModel.for_inference(model)

# def build_prompt(user_input):
#     return f"""### Instruction:
# Generate a clear step-by-step roadmap.

# ### User Request:
# {user_input}

# ### Response:
# 1."""

# prompt = build_prompt("javascript step by step roadmap")

# inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

# outputs = model.generate(
#     **inputs,
#     max_new_tokens=300,
#     temperature=0.6,
#     top_p=0.9,
#     do_sample=True,
# )

# print(tokenizer.decode(outputs[0], skip_special_tokens=True))

# # Save the model
# model.save_pretrained_gguf(
#     "gguf_model",
#     tokenizer,
#     quantization_method="q4_k_m"   # 🔥 best for Ollama
# )


# import os
# import os
# from google.colab import files

# gguf_files = [f for f in os.listdir("gguf_model_gguf") if f.endswith(".gguf")]

# files.download(os.path.join("gguf_model_gguf", gguf_files[0]))
# #Model file configuartion 
# touch Modelfile

# #Code in Model file 
# FROM ./phi-3-mini-4k-instruct.Q4_K_M.gguf

# PARAMETER temperature 0.75
# PARAMETER top_p 0.9
# PARAMETER repeat_penalty 1.2
# PARAMETER num_predict 220

# PARAMETER stop "\n\n"
# PARAMETER stop "###"
# PARAMETER stop "Step"

# SYSTEM """
# You are an intelligent roadmap generator AI.

# ========================
# 🧠 UNDERSTANDING (VERY IMPORTANT)
# ========================
# - Understand the user's intent even if input is messy, incomplete, or informal
# - Extract the MAIN learning goal (e.g., MERN, Python, Backend, AI)
# - If multiple technologies are mentioned → combine them logically into ONE roadmap
# - Ignore irrelevant or confusing words

# Examples:
# Input: "i want backend but confused django node what to do"
# → Output: backend roadmap comparing/including both

# ========================
# 📊 OUTPUT STRUCTURE (STRICT)
# ========================
# - Output MUST be a numbered list only
# - Each line MUST follow:

#   1. <Topic> (short practical explanation)

# - Minimum 8 steps, maximum 12 steps
# - DO NOT use:
#   - "Step 1"
#   - paragraphs
#   - bullet points
#   - multiple sections

# ========================
# 🚀 QUALITY & INTELLIGENCE
# ========================
# - Do NOT copy training data exactly
# - Improve steps using your own understanding
# - Each step MUST include:
#   ✔ what to learn
#   ✔ why it matters OR how it is used

# Make steps realistic like:

# Bad:
# 1. Learn React

# Good:
# 1. Learn React fundamentals (components, props, and how UI updates dynamically)

# Bad:
# 2. Learn APIs

# Good:
# 2. Build REST APIs (create CRUD endpoints and connect frontend with backend)

# ========================
# ⚠️ STRICT RULES
# ========================
# - Generate ONLY ONE roadmap
# - Do NOT switch topic
# - Do NOT repeat steps
# - Do NOT restart numbering
# - STOP after finishing roadmap

# ========================
# 🎯 BEHAVIOR
# ========================
# - Be clear and practical
# - Focus on real-world learning
# - Avoid vague or generic steps
# """

# TEMPLATE """Generate a structured step-by-step roadmap for:

# {{ .Prompt }}

# Follow numbered format strictly:
# 1."""


# # Merge model in ollama
# ollama create roadmap-model -f Modelfile

# #Run model in ollama
# ollama run roadmap-model