import{i as e,r as t,s as n}from"./app-OSiZ_quI.js";import{t as r}from"./plugin-vue_export-helper-CDQIAITX.js";var i=JSON.parse(`{"path":"/posts/DevOps/3.%E6%95%85%E9%9A%9C%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D%E4%B8%8E%E6%A0%B9%E5%9B%A0%E5%88%86%E6%9E%90.html","title":"3.故障快速定位与根因分析","lang":"zh-CN","frontmatter":{"title":"3.故障快速定位与根因分析","icon":"server","date":"2026-03-05T00:00:00.000Z","category":["运维"],"description":"核心架构设计 数据层：Prometheus 采集 130-135 节点数据，时间戳已通过 chronyc 实现全集群同步。 逻辑层：136 堡垒机运行 Python 中间件（Flask），对接阿里云百炼应用 d701ef1c1f6749b491476265097f0ddc。 知识层：通过百炼知识库（RAG）注入了 Cisco 网络拓扑、K8s 集群架构...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"3.故障快速定位与根因分析\\",\\"image\\":[\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717539232-57b14674-2085-478d-9a6a-2aa577d6b1a7.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717592115-d5b8dee9-0759-45e1-bbf6-211607dcb416.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717625939-c34a8548-8ea5-4b77-b108-4ee9d7b56e2e.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717861039-2b1536d7-9334-48b1-8b47-f1c5e477b823.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717703734-57d7d146-f51e-4ee8-9c3b-9ccafd284d8f.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717210303-00a08535-db7c-4d63-83ae-e8dc9374bb6f.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717415268-c89ad38d-2b91-42c2-96b9-9d278b0a73dd.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717338217-25d01bbb-8a2d-4db5-913c-d3bc02e4d248.png\\"],\\"datePublished\\":\\"2026-03-05T00:00:00.000Z\\",\\"dateModified\\":\\"2026-04-29T07:36:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"王梓涵\\",\\"url\\":\\"https://mister-hope.com\\"}]}"],["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/DevOps/3.%E6%95%85%E9%9A%9C%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D%E4%B8%8E%E6%A0%B9%E5%9B%A0%E5%88%86%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"王梓涵"}],["meta",{"property":"og:title","content":"3.故障快速定位与根因分析"}],["meta",{"property":"og:description","content":"核心架构设计 数据层：Prometheus 采集 130-135 节点数据，时间戳已通过 chronyc 实现全集群同步。 逻辑层：136 堡垒机运行 Python 中间件（Flask），对接阿里云百炼应用 d701ef1c1f6749b491476265097f0ddc。 知识层：通过百炼知识库（RAG）注入了 Cisco 网络拓扑、K8s 集群架构..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717539232-57b14674-2085-478d-9a6a-2aa577d6b1a7.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-04-29T07:36:03.000Z"}],["meta",{"property":"article:published_time","content":"2026-03-05T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-04-29T07:36:03.000Z"}]]},"git":{"createdTime":1777448163000,"updatedTime":1777448163000,"contributors":[{"name":"王梓涵","username":"","email":"914132612@qq.com","commits":1}]},"readingTime":{"minutes":6.28,"words":1885},"filePathRelative":"posts/DevOps/3.故障快速定位与根因分析.md","excerpt":"<h2>核心架构设计</h2>\\n<ul>\\n<li><strong>数据层</strong>：Prometheus 采集 130-135 节点数据，时间戳已通过 chronyc 实现全集群同步。</li>\\n<li><strong>逻辑层</strong>：136 堡垒机运行 Python 中间件（Flask），对接阿里云百炼应用 d701ef1c1f6749b491476265097f0ddc。</li>\\n<li><strong>知识层</strong>：通过百炼知识库（RAG）注入了 Cisco 网络拓扑、K8s 集群架构及历史故障复盘文档。</li>\\n<li><strong>通知层</strong>：AI 生成诊断报告后，通过 163 邮件服务器投递至 QQ 邮箱。</li>\\n</ul>","autoDesc":true}`),a={name:`3.故障快速定位与根因分析.md`};function o(r,i,a,o,s,c){return n(),t(`div`,null,[...i[0]||=[e(`<h2 id="核心架构设计" tabindex="-1"><a class="header-anchor" href="#核心架构设计"><span>核心架构设计</span></a></h2><ul><li><strong>数据层</strong>：Prometheus 采集 130-135 节点数据，时间戳已通过 chronyc 实现全集群同步。</li><li><strong>逻辑层</strong>：136 堡垒机运行 Python 中间件（Flask），对接阿里云百炼应用 d701ef1c1f6749b491476265097f0ddc。</li><li><strong>知识层</strong>：通过百炼知识库（RAG）注入了 Cisco 网络拓扑、K8s 集群架构及历史故障复盘文档。</li><li><strong>通知层</strong>：AI 生成诊断报告后，通过 163 邮件服务器投递至 QQ 邮箱。</li></ul><h2 id="rag知识库" tabindex="-1"><a class="header-anchor" href="#rag知识库"><span>RAG知识库</span></a></h2><h3 id="使用阿里云百炼创建知识库" tabindex="-1"><a class="header-anchor" href="#使用阿里云百炼创建知识库"><span>使用阿里云百炼创建知识库</span></a></h3><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717539232-57b14674-2085-478d-9a6a-2aa577d6b1a7.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="上传数据" tabindex="-1"><a class="header-anchor" href="#上传数据"><span>上传数据</span></a></h4><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717592115-d5b8dee9-0759-45e1-bbf6-211607dcb416.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="创建一个智能体应用" tabindex="-1"><a class="header-anchor" href="#创建一个智能体应用"><span>创建一个智能体应用</span></a></h3><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717625939-c34a8548-8ea5-4b77-b108-4ee9d7b56e2e.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="选择你创建好的知识库并设置提示词" tabindex="-1"><a class="header-anchor" href="#选择你创建好的知识库并设置提示词"><span>选择你创建好的知识库并设置提示词</span></a></h4><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717861039-2b1536d7-9334-48b1-8b47-f1c5e477b823.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h4 id="复制应用id" tabindex="-1"><a class="header-anchor" href="#复制应用id"><span>复制应用id</span></a></h4><h3 id="创建api-key" tabindex="-1"><a class="header-anchor" href="#创建api-key"><span>创建API-KEY</span></a></h3><h4 id="点击密钥管理创建一个api" tabindex="-1"><a class="header-anchor" href="#点击密钥管理创建一个api"><span>点击密钥管理创建一个API</span></a></h4><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717703734-57d7d146-f51e-4ee8-9c3b-9ccafd284d8f.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="调用api-key和智能体应用" tabindex="-1"><a class="header-anchor" href="#调用api-key和智能体应用"><span>调用API-KEY和智能体应用</span></a></h3><h4 id="基础调用格式-python-sdk" tabindex="-1"><a class="header-anchor" href="#基础调用格式-python-sdk"><span>基础调用格式 (Python SDK)</span></a></h4><p>这是最简洁的标准格式，适用于你的 ai_diagnose.py 核心逻辑：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import dashscope</span></span>
<span class="line"><span>from dashscope import Application</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 1. 配置你的 API-KEY</span></span>
<span class="line"><span>dashscope.api_key = &quot;你的有效API-KEY&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def call_agent_app(prompt_text):</span></span>
<span class="line"><span>    # 2. 调用智能体应用</span></span>
<span class="line"><span>    # app_id: 你在百炼控制台创建的应用 ID</span></span>
<span class="line"><span>    response = Application.call(</span></span>
<span class="line"><span>        app_id=&#39;d701ef1c1f6749b491476265097f0ddc&#39;,</span></span>
<span class="line"><span>        prompt=prompt_text,</span></span>
<span class="line"><span>        # 如果需要流式输出，设为 True，Webhook 建议设为 False</span></span>
<span class="line"><span>        incremental_output=False </span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 3. 标准结果处理</span></span>
<span class="line"><span>    if response.status_code == 200:</span></span>
<span class="line"><span>        # 成功：返回 AI 生成的内容</span></span>
<span class="line"><span>        return response.output.text</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        # 失败：记录错误码和信息</span></span>
<span class="line"><span>        return f&quot;错误码: {response.code}, 错误信息: {response.message}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="" tabindex="-1"><a class="header-anchor" href="#"><span></span></a></h3><h4 id="生产环境标准格式-带-context-与-session" tabindex="-1"><a class="header-anchor" href="#生产环境标准格式-带-context-与-session"><span>生产环境标准格式 (带 Context 与 Session)</span></a></h4><p>对于运维中间件，建议使用这种格式，它可以保持对话的连贯性（Session）并处理更复杂的请求：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import dashscope</span></span>
<span class="line"><span>from dashscope import Application</span></span>
<span class="line"><span>import logging</span></span>
<span class="line"><span></span></span>
<span class="line"><span>logger = logging.getLogger(&quot;AI-App&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def get_ai_diagnosis(alert_info):</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        response = Application.call(</span></span>
<span class="line"><span>            app_id=&#39;d701ef1c1f6749b491476265097f0ddc&#39;,</span></span>
<span class="line"><span>            prompt=alert_info,</span></span>
<span class="line"><span>            # 选填：如果你想让 AI 记住上一次告警的上下文，可以传入 session_id</span></span>
<span class="line"><span>            # session_id=&#39;zh_kinger_session_001&#39;, </span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            # 选填：控制模型生成的随机性，运维场景建议设低（如 0.2）以保证确定性</span></span>
<span class="line"><span>            parameters={</span></span>
<span class="line"><span>                &#39;temperature&#39;: 0.2,</span></span>
<span class="line"><span>                &#39;top_p&#39;: 0.8</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if response.status_code == 200:</span></span>
<span class="line"><span>            # 提取具体的 text 内容</span></span>
<span class="line"><span>            return response.output.text</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            logger.error(f&quot;调用百炼失败 | RequestID: {response.request_id} | Message: {response.message}&quot;)</span></span>
<span class="line"><span>            return None</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        logger.exception(f&quot;调用接口发生异常: {str(e)}&quot;)</span></span>
<span class="line"><span>        return None</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr id="ETUvE" class="ne-hr"> ## 中间件 <p>该中间件是一个基于 <strong>Python Flask</strong> 的轻量级 Webhook 服务。它作为 <strong>Alertmanager（告警源）</strong> 与 <strong>阿里云百炼（AI 大脑）</strong> 之间的桥梁，实现了告警数据的“智能化加工”。</p><h3 id="编写中间件" tabindex="-1"><a class="header-anchor" href="#编写中间件"><span>编写中间件</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import logging</span></span>
<span class="line"><span>from logging.handlers import RotatingFileHandler</span></span>
<span class="line"><span>import dashscope</span></span>
<span class="line"><span>from dashscope import Application</span></span>
<span class="line"><span>from flask import Flask, request</span></span>
<span class="line"><span>import smtplib</span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>import random</span></span>
<span class="line"><span>from email.mime.text import MIMEText</span></span>
<span class="line"><span>from email.header import Header</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 1. 日志系统配置 ---</span></span>
<span class="line"><span>logging.basicConfig(level=logging.INFO)</span></span>
<span class="line"><span>logger = logging.getLogger(&quot;AI-Diagnose&quot;)</span></span>
<span class="line"><span>file_handler = RotatingFileHandler(&#39;/llm/ai_running.log&#39;, maxBytes=5*1024*1024, backupCount=3)</span></span>
<span class="line"><span>formatter = logging.Formatter(&#39;%(asctime)s - %(levelname)s - %(message)s&#39;)</span></span>
<span class="line"><span>file_handler.setFormatter(formatter)</span></span>
<span class="line"><span>logger.addHandler(file_handler)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app = Flask(__name__)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 2. 核心参数配置 ---</span></span>
<span class="line"><span>dashscope.api_key = &quot;sk-f536bad499d74dbeaa6bd2a5a18686d5&quot;</span></span>
<span class="line"><span>APP_ID = &quot;d701ef1c1f6749b491476265097f0ddc&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SMTP_SERVER = &quot;smtp.163.com&quot;</span></span>
<span class="line"><span>SMTP_PORT = 465</span></span>
<span class="line"><span>MAIL_USER = &quot;www914132612@163.com&quot;</span></span>
<span class="line"><span>MAIL_PASS = &quot;JEjkEYBCWm7n9tqa&quot;</span></span>
<span class="line"><span>RECEIVER = &quot;914132612@qq.com&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def send_email(subject, content):</span></span>
<span class="line"><span>    &quot;&quot;&quot;发送邮件并记录日志&quot;&quot;&quot;</span></span>
<span class="line"><span>    message = MIMEText(content, &#39;plain&#39;, &#39;utf-8&#39;)</span></span>
<span class="line"><span>    message[&#39;From&#39;] = MAIL_USER</span></span>
<span class="line"><span>    message[&#39;To&#39;] = RECEIVER</span></span>
<span class="line"><span>    message[&#39;Subject&#39;] = Header(subject, &#39;utf-8&#39;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        smtp_obj = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)</span></span>
<span class="line"><span>        smtp_obj.login(MAIL_USER, MAIL_PASS)</span></span>
<span class="line"><span>        smtp_obj.sendmail(MAIL_USER, [RECEIVER], message.as_string())</span></span>
<span class="line"><span>        smtp_obj.quit()</span></span>
<span class="line"><span>        logger.info(f&quot;邮件成功发送至 {RECEIVER}&quot;)</span></span>
<span class="line"><span>        return True</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        logger.error(f&quot;邮件发送异常: {str(e)}&quot;)</span></span>
<span class="line"><span>        return False</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.route(&#39;/webhook&#39;, methods=[&#39;POST&#39;])</span></span>
<span class="line"><span>def webhook():</span></span>
<span class="line"><span>    data = request.json</span></span>
<span class="line"><span>    alerts = data.get(&#39;alerts&#39;, [])</span></span>
<span class="line"><span>    logger.info(f&quot;收到 Webhook 信号，包含 {len(alerts)} 条告警&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    for alert in alerts:</span></span>
<span class="line"><span>        instance = alert[&#39;labels&#39;].get(&#39;instance&#39;, &#39;192.168.31.x&#39;)</span></span>
<span class="line"><span>        alert_name = alert[&#39;labels&#39;].get(&#39;alertname&#39;, &#39;未知告警&#39;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 1. 生成唯一 Session ID (IP 隔离)</span></span>
<span class="line"><span>        current_session_id = f&quot;session_{instance.replace(&#39;.&#39;, &#39;_&#39;)}&quot;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 2. 构造动态干扰因子 (强制打破 AI 复读缓存)</span></span>
<span class="line"><span>        random_mark = random.randint(1000, 9999)</span></span>
<span class="line"><span>        timestamp = time.strftime(&quot;%H:%M:%S&quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        logger.info(f&quot;开始诊断节点 {instance} (Session: {current_session_id} | Mark: {random_mark})...&quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            # 3. 调用百炼智能体 (强制阶梯逻辑)</span></span>
<span class="line"><span>            response = Application.call(</span></span>
<span class="line"><span>                app_id=APP_ID, </span></span>
<span class="line"><span>                prompt=(</span></span>
<span class="line"><span>                    f&quot;【诊断编号：{random_mark} | 时间：{timestamp}】\\n&quot;</span></span>
<span class="line"><span>                    f&quot;节点 {instance} 再次触发告警：{alert_name}。\\n\\n&quot;</span></span>
<span class="line"><span>                    f&quot;请务必核对该 Session ({current_session_id}) 的历史对话记录：\\n&quot;</span></span>
<span class="line"><span>                    f&quot;1. 禁止重复回复 612 字符左右的固定模版内容。\\n&quot;</span></span>
<span class="line"><span>                    f&quot;2. 如果历史记录显示该问题近期已出现过，必须判定为故障恶化，&quot;</span></span>
<span class="line"><span>                    f&quot;给出比上次更深入、更专业的内核或链路级分析建议。\\n&quot;</span></span>
<span class="line"><span>                    f&quot;3. 即使知识库有匹配内容，也请结合当前‘连续发生’的语境重新组织语言。&quot;</span></span>
<span class="line"><span>                ),</span></span>
<span class="line"><span>                session_id=current_session_id,</span></span>
<span class="line"><span>                parameters={</span></span>
<span class="line"><span>                    &#39;temperature&#39;: 0.8,</span></span>
<span class="line"><span>                    &#39;top_p&#39;: 0.95</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if response.status_code == 200:</span></span>
<span class="line"><span>                ai_report = response.output.text</span></span>
<span class="line"><span>                logger.info(f&quot;AI 诊断成功 (RequestID: {response.request_id})&quot;)</span></span>
<span class="line"><span>                logger.info(f&quot;报告实时长度: {len(ai_report)} 字符&quot;)</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                # 4. 构造邮件内容</span></span>
<span class="line"><span>                subject = f&quot;【ZH-Kinger 深度诊断】{alert_name} @ {instance} (#{random_mark})&quot;</span></span>
<span class="line"><span>                content = (</span></span>
<span class="line"><span>                    f&quot;告警节点: {instance}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;告警项目: {alert_name}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;诊断序列: {random_mark} (Session 激活)\\n\\n&quot;</span></span>
<span class="line"><span>                    f&quot;AI 专家差异化建议:\\n{ai_report}&quot;</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>                send_email(subject, content)</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                logger.error(f&quot;百炼 API 异常: {response.message} (Code: {response.code})&quot;)</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            logger.error(f&quot;处理告警逻辑时发生崩溃: {str(e)}&quot;)</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>    return &quot;OK&quot;, 200</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    logger.info(&quot;ZH-Kinger AI 诊断系统 V2.1 上线 (已强化动态抗复读逻辑)&quot;)</span></span>
<span class="line"><span>    app.run(host=&#39;0.0.0.0&#39;, port=5000)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="下载依赖包" tabindex="-1"><a class="header-anchor" href="#下载依赖包"><span>下载依赖包</span></a></h3><p>需要提前准备好python环境</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>pip3 install dashscope flask requests -i https://pypi.tuna.tsinghua.edu.cn/simple</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="服务持久化-使用systemd管理" tabindex="-1"><a class="header-anchor" href="#服务持久化-使用systemd管理"><span>服务持久化（使用systemd管理）</span></a></h3><p>在vi /etc/systemd/system/ai_diagnose.service添加以下内容：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=ZH-Kinger AI Diagnose Middleware</span></span>
<span class="line"><span>After=network.target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=simple</span></span>
<span class="line"><span>User=root</span></span>
<span class="line"><span># 确保这里没有任何前后空格（/llm你的脚本存放目录）</span></span>
<span class="line"><span>WorkingDirectory=/llm</span></span>
<span class="line"><span># 建议写全 python3 的绝对路径</span></span>
<span class="line"><span>ExecStart=/usr/bin/python3 /llm/ai_diagnose.py</span></span>
<span class="line"><span>Restart=always</span></span>
<span class="line"><span>RestartSec=5</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动服务</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>systemctl daemon-reload</span></span>
<span class="line"><span>systemctl start ai_diagnose</span></span>
<span class="line"><span>systemctl enable ai_diagnose</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717210303-00a08535-db7c-4d63-83ae-e8dc9374bb6f.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="测试中间件运行状态" tabindex="-1"><a class="header-anchor" href="#测试中间件运行状态"><span>测试中间件运行状态</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>curl -X POST http://127.0.0.1:5000/webhook \\</span></span>
<span class="line"><span>-H &quot;Content-Type: application/json&quot; \\</span></span>
<span class="line"><span>-d &#39;{</span></span>
<span class="line"><span>  &quot;alerts&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;labels&quot;: {</span></span>
<span class="line"><span>        &quot;alertname&quot;: &quot;Manual_Test_AI&quot;,</span></span>
<span class="line"><span>        &quot;instance&quot;: &quot;192.168.31.131&quot;,</span></span>
<span class="line"><span>        &quot;severity&quot;: &quot;critical&quot;</span></span>
<span class="line"><span>      },</span></span>
<span class="line"><span>      &quot;annotations&quot;: {</span></span>
<span class="line"><span>        &quot;summary&quot;: &quot;手动测试：验证百炼 RAG 知识库是否关联成功&quot;</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="如果正常运行你将会收到如下邮件" tabindex="-1"><a class="header-anchor" href="#如果正常运行你将会收到如下邮件"><span>如果正常运行你将会收到如下邮件</span></a></h4><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717415268-c89ad38d-2b91-42c2-96b9-9d278b0a73dd.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="观察-运行日记-logging" tabindex="-1"><a class="header-anchor" href="#观察-运行日记-logging"><span>观察“运行日记” (Logging)</span></a></h3><p>查看日志文件。这是判断脚本是否“脑死亡”的关键。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 实时滚动查看日志</span></span>
<span class="line"><span>tail -f /llm/ai_running.log</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="会看到如下输出" tabindex="-1"><a class="header-anchor" href="#会看到如下输出"><span>会看到如下输出</span></a></h4><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772717338217-25d01bbb-8a2d-4db5-913c-d3bc02e4d248.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="启用-grafana-ml-动态阈值" tabindex="-1"><a class="header-anchor" href="#启用-grafana-ml-动态阈值"><span>启用 Grafana ML（动态阈值）</span></a></h2><p>针对 Web 访问量和 CPU 负载开启训练，自动生成置信区间（阴影带）。偏离阴影带即视为异常，能有效识别隐蔽的内存泄漏。</p><h3 id="_1-持久化-保命-数据同步" tabindex="-1"><a class="header-anchor" href="#_1-持久化-保命-数据同步"><span>1.持久化“保命” (数据同步)</span></a></h3><p>确保当前容器里的看板和数据源已经安全拷贝到宿主机。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 1. 创建宿主机持久化目录（如果还没创建）</span></span>
<span class="line"><span>mkdir -p /var/lib/grafana_backup</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 确保权限正确，防止容器内用户无法写入</span></span>
<span class="line"><span>chmod -R 777 /var/lib/grafana_backup</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3. 将运行中容器的数据完整同步出来</span></span>
<span class="line"><span>docker cp grafana:/var/lib/grafana/. /var/lib/grafana_backup/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-清理旧环境" tabindex="-1"><a class="header-anchor" href="#_1-清理旧环境"><span>1.清理旧环境</span></a></h3><p>删除没有挂载卷的“临时”容器。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 停止并删除旧容器</span></span>
<span class="line"><span>docker stop grafana</span></span>
<span class="line"><span>docker rm grafana</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-带持久化与-ml-环境变量-重生" tabindex="-1"><a class="header-anchor" href="#_2-带持久化与-ml-环境变量-重生"><span>2.带持久化与 ML 环境变量“重生”</span></a></h3><p>使用 docker run 命令一次性完成端口映射、路径挂载和功能开关开启。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>docker run -d \\</span></span>
<span class="line"><span>  --name=grafana \\</span></span>
<span class="line"><span>  -p 3000:3000 \\</span></span>
<span class="line"><span>  --restart=always \\</span></span>
<span class="line"><span>  -v /var/lib/grafana_backup:/var/lib/grafana \\</span></span>
<span class="line"><span>  -e &quot;GF_FEATURE_TOGGLES_ENABLE=machineLearning&quot; \\</span></span>
<span class="line"><span>  grafana/grafana:latest</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-修改配置-双重保险" tabindex="-1"><a class="header-anchor" href="#_4-修改配置-双重保险"><span>4.修改配置 (双重保险)</span></a></h3><p>虽然注入了环境变量，但在最新的 12.4 版本中，修改 grafana.ini 依然是最稳妥的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 1. 进入新容器内部</span></span>
<span class="line"><span>docker exec -it -u root grafana /bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 在容器内直接修改配置文件</span></span>
<span class="line"><span># 找到 [feature_toggles] 下的 enable 项，改为 enable = machineLearning</span></span>
<span class="line"><span>vi /etc/grafana/grafana.ini</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3. 退出并重启容器让配置彻底生效</span></span>
<span class="line"><span>exit</span></span>
<span class="line"><span>docker restart grafana</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验收环节" tabindex="-1"><a class="header-anchor" href="#验收环节"><span>验收环节</span></a></h3><p>等待 10 秒后，执行以下验证指令：</p><p><strong>检查配置加载状态</strong>：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>docker exec grafana env | grep GF_FEATURE_TOGGLES_ENABLE</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><em>看到 <strong>machineLearning = true</strong> 就算大功告成。</em></p><ul><li><p><strong>进入网页端 (</strong><a href="http://192.168.31.136:3000" target="_blank" rel="noopener noreferrer"><strong>http://192.168.31.136:3000</strong></a><strong>)</strong>：</p></li><li><p><strong>确认看板</strong>：检查之前的 Prometheus 数据源和面板是否还在（证明持久化成功）。</p></li><li><p><strong>确认功能</strong>：点击左侧 <strong>Alerting</strong>，寻找 <strong>Machine Learning</strong> 入口。</p></li></ul><h2 id="-1" tabindex="-1"><a class="header-anchor" href="#-1"><span></span></a></h2>`,67)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};