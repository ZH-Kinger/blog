---
title: 完整app代码后续将会封装
icon: code
date: 2026-04-29
category:
  - 开发
---

```
import os
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import FileChatMessageHistory
from config.settings import settings

# 1. 环境配置：禁用联网检查，指定模型路径
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["SENTENCE_TRANSFORMERS_HOME"] = "./models/model_cache"

# 2. 确保存放记忆文件的目录存在
SESSION_DIR = "./sessions"
if not os.path.exists(SESSION_DIR):
    os.makedirs(SESSION_DIR)

# 3. 加载本地 Embedding
embeddings = HuggingFaceEmbeddings(
    model_name="shibing624/text2vec-base-chinese",
    cache_folder="./models/model_cache"
)

# 4. 加载向量数据库
vectorstore = Chroma(persist_directory="./vector_db", embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# 5. 初始化 Qwen (LLM)
llm = ChatOpenAI(
    model=settings.MODEL_NAME,
    api_key=settings.API_KEY,
    base_url=settings.BASE_URL,
    temperature=settings.TEMPERATURE,
)

# 6. 【关键修改】定义带有 {chat_history} 的 Prompt 模板
template = """你是一个 AIOps 专家。请结合对话历史和提供的上下文回答问题。
如果上下文中没有相关信息，请结合你的专业知识回答，并说明该信息不在知识库中。

[对话历史]:
{chat_history}

[相关上下文]:
{context}

[当前问题]: {input}
回答:"""
prompt = ChatPromptTemplate.from_template(template)


# 7. 格式化文档函数
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# 8. 【重构】构建 LCEL 表达式
# 使用 lambda 显式解包，完全绕过 RunnablePassthrough 可能导致的类型错误
# 8. 【修复 Retriever 接口】构建 LCEL 表达式
rag_chain = (
    {
        # 这里把 .get_relevant_documents 换成 .invoke
        "context": lambda x: format_docs(retriever.invoke(x["input"])),
        "input": lambda x: x["input"],
        "chat_history": lambda x: x.get("chat_history", "")
    }
    | prompt| llm| StrOutputParser()
)


# 9. 定义获取历史记录的函数
def get_session_history(session_id: str):
    file_path = os.path.join(SESSION_DIR, f"{session_id}.json")
    return FileChatMessageHistory(file_path)


# 10. 使用包装器（注意：这里不指定 input_messages_key，让它接收整个字典）
with_message_history = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_message="input",
    # 这一行非常关键：告诉它历史记录填到 prompt 的哪个坑位
    history_messages_key="chat_history",
)


# 11. 交互函数
def chat():
    print("🤖 AIOps 助手已上线！(持久化记忆修复版)")
    session_config = {"configurable": {"session_id": "zh_kinger_ops_001"}}

    while True:
        user_input = input("\n运维问题 >> ").strip()
        if not user_input: continue
        if user_input.lower() == "exit": break

        print("\n💡 建议方案：", end="", flush=True)

        try:
            # 【核心修改】直接传字典给 with_message_history
            input_dict = {"input": user_input}

            for chunk in with_message_history.stream(input_dict, config=session_config):
                print(chunk, end="", flush=True)
        except Exception as e:
            print(f"\n❌ 出错了: {e}")
            # 如果还报错，取消注释下面这行来查看详细堆栈
            # import traceback; traceback.print_exc()

        print("\n" + "-" * 30)


if __name__ == "__main__":
    chat()
```