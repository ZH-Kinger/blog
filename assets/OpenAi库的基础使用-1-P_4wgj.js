import{i as e,r as t,s as n}from"./app-BGGt1IWt.js";import{t as r}from"./plugin-vue_export-helper-CDQIAITX.js";var i=JSON.parse(`{"path":"/posts/AI_LLM/OpenAi%E5%BA%93%E7%9A%84%E5%9F%BA%E7%A1%80%E4%BD%BF%E7%94%A8.html","title":"OpenAi库的基础使用","lang":"zh-CN","frontmatter":{"title":"OpenAi库的基础使用","icon":"robot","date":"2026-03-22T00:00:00.000Z","category":["AI大模型"],"description":"学习 openai 库（Python 官方 SDK）是掌握 OpenAI API 核心能力的关键，它能让你轻松调用 GPT 系列模型、实现 Function Calling、构建 ReAct 智能体等。下面我会从基础入门 → 核心功能 → 高级实战 → 最佳实践 逐步讲解，全程用可运行的代码示例，新手也能快速上手。 ## 一、前置准备 1. 环境安装 ...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"OpenAi库的基础使用\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2026-03-22T00:00:00.000Z\\",\\"dateModified\\":\\"2026-04-29T07:36:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Kinger\\",\\"url\\":\\"https://www.yuque.com/kinger-wwnro\\"}]}"],["meta",{"property":"og:url","content":"https://kinger.example.com/blog/posts/AI_LLM/OpenAi%E5%BA%93%E7%9A%84%E5%9F%BA%E7%A1%80%E4%BD%BF%E7%94%A8.html"}],["meta",{"property":"og:site_name","content":"王梓涵"}],["meta",{"property":"og:title","content":"OpenAi库的基础使用"}],["meta",{"property":"og:description","content":"学习 openai 库（Python 官方 SDK）是掌握 OpenAI API 核心能力的关键，它能让你轻松调用 GPT 系列模型、实现 Function Calling、构建 ReAct 智能体等。下面我会从基础入门 → 核心功能 → 高级实战 → 最佳实践 逐步讲解，全程用可运行的代码示例，新手也能快速上手。 ## 一、前置准备 1. 环境安装 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-04-29T07:36:03.000Z"}],["meta",{"property":"article:published_time","content":"2026-03-22T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-04-29T07:36:03.000Z"}]]},"git":{"createdTime":1777448163000,"updatedTime":1777448163000,"contributors":[{"name":"王梓涵","username":"","email":"914132612@qq.com","commits":1}]},"readingTime":{"minutes":6.33,"words":1899},"filePathRelative":"posts/AI_LLM/OpenAi库的基础使用.md","excerpt":"<p>学习 openai 库（Python 官方 SDK）是掌握 OpenAI API 核心能力的关键，它能让你轻松调用 GPT 系列模型、实现 Function Calling、构建 ReAct 智能体等。下面我会从<strong>基础入门 → 核心功能 → 高级实战 → 最佳实践</strong> 逐步讲解，全程用可运行的代码示例，新手也能快速上手。</p>\\n<hr id=\\"JWkcd\\" class=\\"ne-hr\\">\\n## 一、前置准备\\n<h3>1. 环境安装</h3>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span># 安装最新版 openai 库（注意：v1.x 版本和旧版 v0.x 接口差异较大，推荐用 v1+）</span></span>\\n<span class=\\"line\\"><span>pip install openai --upgrade</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`),a={name:`OpenAi库的基础使用.md`};function o(r,i,a,o,s,c){return n(),t(`div`,null,[...i[0]||=[e(`<p>学习 openai 库（Python 官方 SDK）是掌握 OpenAI API 核心能力的关键，它能让你轻松调用 GPT 系列模型、实现 Function Calling、构建 ReAct 智能体等。下面我会从<strong>基础入门 → 核心功能 → 高级实战 → 最佳实践</strong> 逐步讲解，全程用可运行的代码示例，新手也能快速上手。</p><hr id="JWkcd" class="ne-hr"> ## 一、前置准备 <h3 id="_1-环境安装" tabindex="-1"><a class="header-anchor" href="#_1-环境安装"><span>1. 环境安装</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 安装最新版 openai 库（注意：v1.x 版本和旧版 v0.x 接口差异较大，推荐用 v1+）</span></span>
<span class="line"><span>pip install openai --upgrade</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置-api-key" tabindex="-1"><a class="header-anchor" href="#_2-配置-api-key"><span>2. 配置 API Key</span></a></h3><p>有两种方式配置（任选其一）：</p><h4 id="方式1-环境变量-推荐-安全" tabindex="-1"><a class="header-anchor" href="#方式1-环境变量-推荐-安全"><span>方式1：环境变量（推荐，安全）</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># Linux/Mac</span></span>
<span class="line"><span>export OPENAI_API_KEY=&quot;你的sk-xxx密钥&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Windows（cmd）</span></span>
<span class="line"><span>set OPENAI_API_KEY=&quot;你的sk-xxx密钥&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式2-代码中直接配置" tabindex="-1"><a class="header-anchor" href="#方式2-代码中直接配置"><span>方式2：代码中直接配置</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>from openai import OpenAI</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 初始化客户端</span></span>
<span class="line"><span>client = OpenAI(</span></span>
<span class="line"><span>    api_key=&quot;你的sk-xxx密钥&quot;,  # 替换为真实密钥</span></span>
<span class="line"><span>    # 国内访问需配置代理（可选）</span></span>
<span class="line"><span>    # base_url=&quot;https://api.openai-proxy.com/v1&quot;</span></span>
<span class="line"><span>)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr id="Gpdve" class="ne-hr"> ## 二、核心功能：从基础对话到高级能力 <h3 id="_1-基础对话-chat-completions" tabindex="-1"><a class="header-anchor" href="#_1-基础对话-chat-completions"><span>1. 基础对话（Chat Completions）</span></a></h3><p>最核心的功能，调用 GPT 生成对话回复，对应 ChatGPT 核心能力。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 基础对话示例</span></span>
<span class="line"><span>def basic_chat():</span></span>
<span class="line"><span>    # 调用 chat.completions.create 接口</span></span>
<span class="line"><span>    response = client.chat.completions.create(</span></span>
<span class="line"><span>        model=&quot;gpt-3.5-turbo&quot;,  # 模型选择：gpt-3.5-turbo/gpt-4o/gpt-4-turbo</span></span>
<span class="line"><span>        messages=[</span></span>
<span class="line"><span>            {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;你是一个友好的助手，回答简洁明了&quot;},</span></span>
<span class="line"><span>            {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;什么是 Function Calling？&quot;}</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        temperature=0.7,  # 随机性：0（严谨）~2（创意）</span></span>
<span class="line"><span>        max_tokens=500  # 最大生成字符数</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 提取回复内容</span></span>
<span class="line"><span>    answer = response.choices[0].message.content</span></span>
<span class="line"><span>    print(&quot;模型回复：&quot;, answer)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    basic_chat()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>关键参数解释</strong>：</p><ul><li>model：模型版本，新手优先用 gpt-3.5-turbo（性价比高），复杂任务用 gpt-4o。</li><li>messages：对话历史，包含 system（系统指令，定义角色）、user（用户提问）、assistant（模型回复）。</li><li>temperature：控制生成的随机性，数值越小越精准，越大越有创意。</li></ul><h3 id="_2-多轮对话-上下文记忆" tabindex="-1"><a class="header-anchor" href="#_2-多轮对话-上下文记忆"><span>2. 多轮对话（上下文记忆）</span></a></h3><p>通过保留 messages 列表实现多轮对话，让模型记住前文。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>def multi_turn_chat():</span></span>
<span class="line"><span>    # 初始化对话历史</span></span>
<span class="line"><span>    messages = [{&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;你是数学老师，只回答数学问题&quot;}]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 模拟多轮对话</span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        user_input = input(&quot;你：&quot;)</span></span>
<span class="line"><span>        if user_input.lower() in [&quot;退出&quot;, &quot;q&quot;]:</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 添加用户输入到对话历史</span></span>
<span class="line"><span>        messages.append({&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_input})</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 调用模型</span></span>
<span class="line"><span>        response = client.chat.completions.create(</span></span>
<span class="line"><span>            model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>            messages=messages</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 提取模型回复并添加到对话历史</span></span>
<span class="line"><span>        assistant_reply = response.choices[0].message.content</span></span>
<span class="line"><span>        messages.append({&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: assistant_reply})</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        print(&quot;老师：&quot;, assistant_reply)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 运行测试</span></span>
<span class="line"><span>multi_turn_chat()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-核心实战-function-calling-工具调用" tabindex="-1"><a class="header-anchor" href="#_3-核心实战-function-calling-工具调用"><span>3. 核心实战：Function Calling（工具调用）</span></a></h3><p>这是构建 ReAct 智能体的核心，也是 openai 库最有价值的功能之一。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 步骤1：定义工具函数（模拟查天气）</span></span>
<span class="line"><span>def get_weather(city: str) -&gt; str:</span></span>
<span class="line"><span>    &quot;&quot;&quot;模拟获取天气的工具函数&quot;&quot;&quot;</span></span>
<span class="line"><span>    weather_data = {</span></span>
<span class="line"><span>        &quot;北京&quot;: &quot;晴，15-25°C&quot;,</span></span>
<span class="line"><span>        &quot;上海&quot;: &quot;多云，18-28°C&quot;,</span></span>
<span class="line"><span>        &quot;广州&quot;: &quot;小雨，20-30°C&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return weather_data.get(city, &quot;未查询到该城市天气&quot;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 步骤2：定义工具描述（告诉模型有哪些工具可用）</span></span>
<span class="line"><span>tools = [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &quot;type&quot;: &quot;function&quot;,</span></span>
<span class="line"><span>        &quot;function&quot;: {</span></span>
<span class="line"><span>            &quot;name&quot;: &quot;get_weather&quot;,</span></span>
<span class="line"><span>            &quot;description&quot;: &quot;获取指定城市的实时天气信息&quot;,</span></span>
<span class="line"><span>            &quot;parameters&quot;: {</span></span>
<span class="line"><span>                &quot;type&quot;: &quot;object&quot;,</span></span>
<span class="line"><span>                &quot;properties&quot;: {</span></span>
<span class="line"><span>                    &quot;city&quot;: {</span></span>
<span class="line"><span>                        &quot;type&quot;: &quot;string&quot;,</span></span>
<span class="line"><span>                        &quot;description&quot;: &quot;城市名称，如北京、上海&quot;</span></span>
<span class="line"><span>                    }</span></span>
<span class="line"><span>                },</span></span>
<span class="line"><span>                &quot;required&quot;: [&quot;city&quot;]</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 步骤3：调用模型，让其判断是否调用工具</span></span>
<span class="line"><span>def function_calling_demo(user_query: str):</span></span>
<span class="line"><span>    # 第一步：让模型决定是否调用工具</span></span>
<span class="line"><span>    response = client.chat.completions.create(</span></span>
<span class="line"><span>        model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>        messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_query}],</span></span>
<span class="line"><span>        tools=tools,</span></span>
<span class="line"><span>        tool_choice=&quot;auto&quot;  # 让模型自动决定是否调用工具</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    response_message = response.choices[0].message</span></span>
<span class="line"><span>    print(&quot;模型思考结果：&quot;, response_message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 第二步：如果模型选择调用工具，则执行对应的函数</span></span>
<span class="line"><span>    if response_message.tool_calls:</span></span>
<span class="line"><span>        # 提取工具调用信息</span></span>
<span class="line"><span>        tool_call = response_message.tool_calls[0]</span></span>
<span class="line"><span>        function_name = tool_call.function.name</span></span>
<span class="line"><span>        function_args = eval(tool_call.function.arguments)  # 解析参数（推荐用 json.loads）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 执行工具函数</span></span>
<span class="line"><span>        if function_name == &quot;get_weather&quot;:</span></span>
<span class="line"><span>            tool_result = get_weather(city=function_args[&quot;city&quot;])</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            tool_result = &quot;未知工具&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 第三步：将工具结果回传给模型，生成最终回答</span></span>
<span class="line"><span>        final_response = client.chat.completions.create(</span></span>
<span class="line"><span>            model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>            messages=[</span></span>
<span class="line"><span>                {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_query},</span></span>
<span class="line"><span>                response_message,  # 模型之前的工具调用指令</span></span>
<span class="line"><span>                {</span></span>
<span class="line"><span>                    &quot;role&quot;: &quot;tool&quot;,</span></span>
<span class="line"><span>                    &quot;tool_call_id&quot;: tool_call.id,</span></span>
<span class="line"><span>                    &quot;name&quot;: function_name,</span></span>
<span class="line"><span>                    &quot;content&quot;: tool_result</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            ]</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        return final_response.choices[0].message.content</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        # 不需要调用工具，直接返回模型回答</span></span>
<span class="line"><span>        return response_message.content</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 测试</span></span>
<span class="line"><span>print(function_calling_demo(&quot;北京今天的天气怎么样？&quot;))</span></span>
<span class="line"><span># 输出：北京今天的天气为晴，15-25°C。</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-其他常用功能" tabindex="-1"><a class="header-anchor" href="#_4-其他常用功能"><span>4. 其他常用功能</span></a></h3><h4 id="_1-文本嵌入-embeddings" tabindex="-1"><a class="header-anchor" href="#_1-文本嵌入-embeddings"><span>（1）文本嵌入（Embeddings）</span></a></h4><p>将文本转换为向量，用于相似度匹配、RAG 等场景：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>def text_embedding():</span></span>
<span class="line"><span>    # 生成文本嵌入</span></span>
<span class="line"><span>    response = client.embeddings.create(</span></span>
<span class="line"><span>        model=&quot;text-embedding-3-small&quot;,</span></span>
<span class="line"><span>        input=[&quot;今天天气很好&quot;, &quot;我想去公园玩&quot;]</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    # 提取向量</span></span>
<span class="line"><span>    embeddings = [item.embedding for item in response.data]</span></span>
<span class="line"><span>    print(&quot;文本1的向量长度：&quot;, len(embeddings[0]))  # 输出：1536（text-embedding-3-small 维度）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>text_embedding()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-文件处理-比如解析pdf" tabindex="-1"><a class="header-anchor" href="#_2-文件处理-比如解析pdf"><span>（2）文件处理（比如解析PDF）</span></a></h4><p>需结合 openai 的 Files API，适合处理长文本：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># 上传文件（需先安装 openai[files]）</span></span>
<span class="line"><span>def upload_file():</span></span>
<span class="line"><span>    file = client.files.create(</span></span>
<span class="line"><span>        file=open(&quot;文档.pdf&quot;, &quot;rb&quot;),</span></span>
<span class="line"><span>        purpose=&quot;assistants&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    print(&quot;文件ID：&quot;, file.id)</span></span>
<span class="line"><span>    return file.id</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr id="zI86l" class="ne-hr"> ## 三、高级实战：构建 ReAct 智能体 <p>结合 Function Calling 和多轮对话，实现“思考→行动→观察”的 ReAct 闭环：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>def react_agent():</span></span>
<span class="line"><span>    # 定义工具列表</span></span>
<span class="line"><span>    tools = [</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;function&quot;,</span></span>
<span class="line"><span>            &quot;function&quot;: {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;get_weather&quot;,</span></span>
<span class="line"><span>                &quot;description&quot;: &quot;获取指定城市的实时天气&quot;,</span></span>
<span class="line"><span>                &quot;parameters&quot;: {</span></span>
<span class="line"><span>                    &quot;type&quot;: &quot;object&quot;,</span></span>
<span class="line"><span>                    &quot;properties&quot;: {&quot;city&quot;: {&quot;type&quot;: &quot;string&quot;}},</span></span>
<span class="line"><span>                    &quot;required&quot;: [&quot;city&quot;]</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        },</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            &quot;type&quot;: &quot;function&quot;,</span></span>
<span class="line"><span>            &quot;function&quot;: {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;calculate&quot;,</span></span>
<span class="line"><span>                &quot;description&quot;: &quot;计算加减乘除&quot;,</span></span>
<span class="line"><span>                &quot;parameters&quot;: {</span></span>
<span class="line"><span>                    &quot;type&quot;: &quot;object&quot;,</span></span>
<span class="line"><span>                    &quot;properties&quot;: {</span></span>
<span class="line"><span>                        &quot;a&quot;: {&quot;type&quot;: &quot;number&quot;},</span></span>
<span class="line"><span>                        &quot;b&quot;: {&quot;type&quot;: &quot;number&quot;},</span></span>
<span class="line"><span>                        &quot;op&quot;: {&quot;type&quot;: &quot;string&quot;, &quot;enum&quot;: [&quot;+&quot;, &quot;-&quot;, &quot;*&quot;, &quot;/&quot;]}</span></span>
<span class="line"><span>                    },</span></span>
<span class="line"><span>                    &quot;required&quot;: [&quot;a&quot;, &quot;b&quot;, &quot;op&quot;]</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 工具函数映射</span></span>
<span class="line"><span>    tool_functions = {</span></span>
<span class="line"><span>        &quot;get_weather&quot;: get_weather,</span></span>
<span class="line"><span>        &quot;calculate&quot;: lambda a, b, op: eval(f&quot;{a}{op}{b}&quot;)  # 简单计算器</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 对话循环</span></span>
<span class="line"><span>    messages = [{&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;你是ReAct智能体，需要时调用工具解决问题&quot;}]</span></span>
<span class="line"><span>    while True:</span></span>
<span class="line"><span>        user_input = input(&quot;你：&quot;)</span></span>
<span class="line"><span>        if user_input.lower() in [&quot;退出&quot;, &quot;q&quot;]:</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        messages.append({&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_input})</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # 第一步：思考并决定是否调用工具</span></span>
<span class="line"><span>        response = client.chat.completions.create(</span></span>
<span class="line"><span>            model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>            messages=messages,</span></span>
<span class="line"><span>            tools=tools,</span></span>
<span class="line"><span>            tool_choice=&quot;auto&quot;</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        response_message = response.choices[0].message</span></span>
<span class="line"><span>        messages.append(response_message)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        # 第二步：执行工具（如果需要）</span></span>
<span class="line"><span>        if response_message.tool_calls:</span></span>
<span class="line"><span>            for tool_call in response_message.tool_calls:</span></span>
<span class="line"><span>                func_name = tool_call.function.name</span></span>
<span class="line"><span>                func_args = eval(tool_call.function.arguments)</span></span>
<span class="line"><span>                # 执行工具函数</span></span>
<span class="line"><span>                func_result = tool_functions[func_name](**func_args)</span></span>
<span class="line"><span>                # 添加工具结果到对话历史</span></span>
<span class="line"><span>                messages.append({</span></span>
<span class="line"><span>                    &quot;role&quot;: &quot;tool&quot;,</span></span>
<span class="line"><span>                    &quot;tool_call_id&quot;: tool_call.id,</span></span>
<span class="line"><span>                    &quot;name&quot;: func_name,</span></span>
<span class="line"><span>                    &quot;content&quot;: str(func_result)</span></span>
<span class="line"><span>                })</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            # 第三步：基于工具结果生成最终回答</span></span>
<span class="line"><span>            final_response = client.chat.completions.create(</span></span>
<span class="line"><span>                model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>                messages=messages</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>            final_answer = final_response.choices[0].message.content</span></span>
<span class="line"><span>            messages.append({&quot;role&quot;: &quot;assistant&quot;, &quot;content&quot;: final_answer})</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            final_answer = response_message.content</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        print(&quot;智能体：&quot;, final_answer)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 运行ReAct智能体</span></span>
<span class="line"><span>react_agent()</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr id="IhsxE" class="ne-hr"> ## 四、学习要点与最佳实践 <h3 id="_1-版本注意事项" tabindex="-1"><a class="header-anchor" href="#_1-版本注意事项"><span>1. 版本注意事项</span></a></h3><ul><li>openai 库 v1.x 是最新版本，接口和 v0.x 完全不同（比如 client.chat.completions.create 替代旧版 Completion.create）。</li><li>优先参考官方文档的 v1.x 示例，避免版本兼容问题。</li></ul><h3 id="_2-性能与成本优化" tabindex="-1"><a class="header-anchor" href="#_2-性能与成本优化"><span>2. 性能与成本优化</span></a></h3><ul><li>选择合适的模型：gpt-3.5-turbo 适合大部分场景，成本仅为 gpt-4o 的 1/10。</li><li>控制 max_tokens：避免生成过长文本，减少token消耗。</li><li>缓存重复请求：比如相同的嵌入请求、相同的工具调用结果，避免重复计费。</li></ul><h3 id="_3-错误处理" tabindex="-1"><a class="header-anchor" href="#_3-错误处理"><span>3. 错误处理</span></a></h3><p>生产环境中需添加异常捕获：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import time</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def safe_chat(user_input):</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        response = client.chat.completions.create(</span></span>
<span class="line"><span>            model=&quot;gpt-3.5-turbo&quot;,</span></span>
<span class="line"><span>            messages=[{&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: user_input}]</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        return response.choices[0].message.content</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        print(f&quot;调用失败：{e}&quot;)</span></span>
<span class="line"><span>        # 重试逻辑（可选）</span></span>
<span class="line"><span>        time.sleep(1)</span></span>
<span class="line"><span>        return &quot;抱歉，暂时无法回答你的问题&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-学习资源" tabindex="-1"><a class="header-anchor" href="#_4-学习资源"><span>4. 学习资源</span></a></h3><ul><li><strong>官方文档</strong>：<a href="https://platform.openai.com/docs/libraries/python%EF%BC%88%E6%9C%80%E6%9D%83%E5%A8%81%EF%BC%89" target="_blank" rel="noopener noreferrer">https://platform.openai.com/docs/libraries/python（最权威）</a></li><li><strong>官方示例仓库</strong>：<a href="https://github.com/openai/openai-python%EF%BC%88%E5%90%AB%E5%A4%A7%E9%87%8F%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B%EF%BC%89" target="_blank" rel="noopener noreferrer">https://github.com/openai/openai-python（含大量代码示例）</a></li><li><strong>LangChain 文档</strong>：结合 LangChain 可快速封装 openai 为智能体。</li></ul><hr id="okYDq" class="ne-hr"> ## 总结 <ul><li><strong>核心基础</strong>：openai 库的核心是 Chat Completions 接口，通过 messages 控制对话，model 选择不同算力的模型。</li><li><strong>核心价值</strong>：Function Calling 是构建 ReAct 智能体的关键，实现“思考→行动”闭环。</li><li><strong>实战重点</strong>：多轮对话需保留 messages 上下文，生产环境需注意错误处理和成本优化。</li></ul><p>从基础对话入手，先掌握 Function Calling，再结合 ReAct 逻辑构建智能体，是学习 openai 库的最优路径。如果有具体的学习目标（比如做一个智能客服、数据分析助手），可以告诉我，我会针对性给出代码模板。</p>`,50)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};