import{i as e,r as t,s as n}from"./app-B3WM_BJp.js";import{t as r}from"./plugin-vue_export-helper-CDQIAITX.js";var i=JSON.parse(`{"path":"/posts/AI_LLM/LangChain/%E6%A0%87%E5%87%86skill.html","title":"标准skill","lang":"zh-CN","frontmatter":{"title":"标准skill","icon":"robot","date":"2026-04-29T00:00:00.000Z","category":["AI大模型"],"description":"标准化skill 在 Prometheus 生态中，Python 脚本的核心逻辑其实就是：构造 PromQL 查询语句 -&gt; 发送 HTTP 请求给 Prometheus API -&gt; 用 Pandas 解析返回的 JSON 结果。 下面我为你手写一个工业级标准的结构化 Skill，直接针对你的 Web 集群监控。 第一步：核心 Pytho...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"标准skill\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2026-04-29T00:00:00.000Z\\",\\"dateModified\\":\\"2026-04-29T07:36:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Kinger\\",\\"url\\":\\"https://www.yuque.com/kinger-wwnro\\"}]}"],["meta",{"property":"og:url","content":"https://kinger.example.com/blog/posts/AI_LLM/LangChain/%E6%A0%87%E5%87%86skill.html"}],["meta",{"property":"og:site_name","content":"王梓涵"}],["meta",{"property":"og:title","content":"标准skill"}],["meta",{"property":"og:description","content":"标准化skill 在 Prometheus 生态中，Python 脚本的核心逻辑其实就是：构造 PromQL 查询语句 -&gt; 发送 HTTP 请求给 Prometheus API -&gt; 用 Pandas 解析返回的 JSON 结果。 下面我为你手写一个工业级标准的结构化 Skill，直接针对你的 Web 集群监控。 第一步：核心 Pytho..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-04-29T07:36:03.000Z"}],["meta",{"property":"article:published_time","content":"2026-04-29T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-04-29T07:36:03.000Z"}]]},"git":{"createdTime":1777448163000,"updatedTime":1777448163000,"contributors":[{"name":"王梓涵","username":"","email":"914132612@qq.com","commits":1}]},"readingTime":{"minutes":2.81,"words":842},"filePathRelative":"posts/AI_LLM/LangChain/标准skill.md","excerpt":"\\n<p>在 Prometheus 生态中，Python 脚本的核心逻辑其实就是：<strong>构造 PromQL 查询语句 -&gt; 发送 HTTP 请求给 Prometheus API -&gt; 用 Pandas 解析返回的 JSON 结果。</strong></p>\\n<p>下面我为你手写一个<strong>工业级标准</strong>的结构化 Skill，直接针对你的 Web 集群监控。</p>\\n<hr>\\n<h2>第一步：核心 Python 监控脚本 (逻辑层)</h2>\\n<p>这是最底层、不带任何 AI 痕迹的纯 Python 逻辑。我们需要用到 <code>requests</code> 和 <code>pandas</code>。</p>","autoDesc":true}`),a={name:`标准skill.md`};function o(r,i,a,o,s,c){return n(),t(`div`,null,[...i[0]||=[e(`<h1 id="标准化skill" tabindex="-1"><a class="header-anchor" href="#标准化skill"><span>标准化skill</span></a></h1><p>在 Prometheus 生态中，Python 脚本的核心逻辑其实就是：<strong>构造 PromQL 查询语句 -&gt; 发送 HTTP 请求给 Prometheus API -&gt; 用 Pandas 解析返回的 JSON 结果。</strong></p><p>下面我为你手写一个<strong>工业级标准</strong>的结构化 Skill，直接针对你的 Web 集群监控。</p><hr><h2 id="第一步-核心-python-监控脚本-逻辑层" tabindex="-1"><a class="header-anchor" href="#第一步-核心-python-监控脚本-逻辑层"><span>第一步：核心 Python 监控脚本 (逻辑层)</span></a></h2><p>这是最底层、不带任何 AI 痕迹的纯 Python 逻辑。我们需要用到 <code>requests</code> 和 <code>pandas</code>。</p><p>Python</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import requests</span></span>
<span class="line"><span>import pandas as pd</span></span>
<span class="line"><span>from datetime import datetime</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def fetch_prometheus_metric(prometheus_url, promql_query):</span></span>
<span class="line"><span>    &quot;&quot;&quot;底层函数：负责与 Prometheus API 通讯&quot;&quot;&quot;</span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        response = requests.get(</span></span>
<span class="line"><span>            f&quot;{prometheus_url}/api/v1/query&quot;,</span></span>
<span class="line"><span>            params={&#39;query&#39;: promql_query}</span></span>
<span class="line"><span>        )</span></span>
<span class="line"><span>        data = response.json()</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if data[&#39;status&#39;] != &#39;success&#39; or not data[&#39;data&#39;][&#39;result&#39;]:</span></span>
<span class="line"><span>            return None</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>        # 将结果转换为简洁的列表</span></span>
<span class="line"><span>        results = []</span></span>
<span class="line"><span>        for item in data[&#39;data&#39;][&#39;result&#39;]:</span></span>
<span class="line"><span>            results.append({</span></span>
<span class="line"><span>                &quot;node&quot;: item[&#39;metric&#39;].get(&#39;instance&#39;, &#39;unknown&#39;),</span></span>
<span class="line"><span>                &quot;value&quot;: float(item[&#39;value&#39;][1])</span></span>
<span class="line"><span>            })</span></span>
<span class="line"><span>        return results</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        return f&quot;连接失败: {str(e)}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="第二步-封装成结构化-skill-agent-接口层" tabindex="-1"><a class="header-anchor" href="#第二步-封装成结构化-skill-agent-接口层"><span>第二步：封装成结构化 Skill (Agent 接口层)</span></a></h2><p>现在我们用 <strong>Pydantic</strong> 给这个脚本套上“说明书”，让 Agent 知道怎么传参。</p><p>Python</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>from langchain.pydantic_v1 import BaseModel, Field</span></span>
<span class="line"><span>from langchain.tools import StructuredTool</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 1. 定义参数模型</span></span>
<span class="line"><span>class WebClusterMonitorSchema(BaseModel):</span></span>
<span class="line"><span>    metric_type: str = Field(</span></span>
<span class="line"><span>        description=&quot;监控指标类型，可选：&#39;cpu&#39; (利用率), &#39;mem&#39; (内存占用), &#39;disk&#39; (磁盘使用)&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    cluster_name: str = Field(</span></span>
<span class="line"><span>        default=&quot;web-cluster&quot;, </span></span>
<span class="line"><span>        description=&quot;集群名称，用于在 PromQL 中过滤，例如 &#39;web-prod&#39;&quot;</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2. 编写 Agent 调用的业务逻辑</span></span>
<span class="line"><span>def monitor_web_cluster(metric_type: str, cluster_name: str):</span></span>
<span class="line"><span>    # 配置你的 Prometheus 地址</span></span>
<span class="line"><span>    PROMETHEUS_URL = &quot;http://localhost:9090&quot; </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 根据参数动态生成 PromQL (针对 Node Exporter)</span></span>
<span class="line"><span>    queries = {</span></span>
<span class="line"><span>        &quot;cpu&quot;: f&#39;100 - (avg by (instance) (irate(node_cpu_seconds_total{{mode=&quot;idle&quot;, cluster=&quot;{cluster_name}&quot;}}[5m])) * 100)&#39;,</span></span>
<span class="line"><span>        &quot;mem&quot;: f&#39;100 * (1 - (node_memory_MemAvailable_bytes{{cluster=&quot;{cluster_name}&quot;}} / node_memory_MemTotal_bytes{{cluster=&quot;{cluster_name}&quot;}}))&#39;,</span></span>
<span class="line"><span>        &quot;disk&quot;: f&#39;100 * (1 - node_filesystem_avail_bytes{{mountpoint=&quot;/&quot;, cluster=&quot;{cluster_name}&quot;}} / node_filesystem_size_bytes{{mountpoint=&quot;/&quot;, cluster=&quot;{cluster_name}&quot;}})&#39;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    query = queries.get(metric_type)</span></span>
<span class="line"><span>    if not query:</span></span>
<span class="line"><span>        return &quot;不支持的指标类型，请选择 cpu/mem/disk。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 执行底层查询</span></span>
<span class="line"><span>    raw_data = fetch_prometheus_metric(PROMETHEUS_URL, query)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if not raw_data:</span></span>
<span class="line"><span>        return f&quot;未查询到集群 {cluster_name} 的相关数据，请检查集群名称或 Node Exporter 状态。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 使用 Pandas 进行简单的降维处理，只给 Agent 返回核心结论</span></span>
<span class="line"><span>    df = pd.DataFrame(raw_data)</span></span>
<span class="line"><span>    summary = df.to_string(index=False)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    return f&quot;--- {cluster_name} 集群 {metric_type} 监控报表 ---\\n{summary}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3. 最终导出工具</span></span>
<span class="line"><span>web_monitor_tool = StructuredTool.from_function(</span></span>
<span class="line"><span>    func=monitor_web_cluster,</span></span>
<span class="line"><span>    name=&quot;get_web_cluster_status&quot;,</span></span>
<span class="line"><span>    description=&quot;专门用于实时监控 Web 集群各节点的 CPU、内存、磁盘健康状况。&quot;,</span></span>
<span class="line"><span>    args_schema=WebClusterMonitorSchema</span></span>
<span class="line"><span>)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="为什么这个脚本在-aiops-中很专业" tabindex="-1"><a class="header-anchor" href="#为什么这个脚本在-aiops-中很专业"><span>为什么这个脚本在 AIOps 中很专业？</span></a></h2><ol><li><strong>动态 PromQL 生成</strong>：你没有写死一个查询，而是让 Agent 根据用户的意图（想看 CPU 还是内存）动态选择语句。</li><li><strong>数据过滤与清洗</strong>：你没有把 Prometheus 返回的原始复杂 JSON 扔给 Agent（那会耗尽 Token），而是用 <strong>Pandas</strong> 提取了关键的 <code>instance</code> 和 <code>value</code>，整理成了易读的表格。</li><li><strong>结构化约束</strong>：通过 <code>args_schema</code>，Agent 永远不会传出 <code>metric_type=&quot;weather&quot;</code> 这种离谱的参数。</li></ol><hr><h2 id="接下来你可以这么玩" tabindex="-1"><a class="header-anchor" href="#接下来你可以这么玩"><span>接下来你可以这么玩：</span></a></h2><ol><li><strong>把这个工具加到你的 <code>agent.py</code> 的 <code>tools</code> 列表里。</strong></li><li><strong>在 CLI 里试着问：</strong> “帮我检查一下 <code>web-prod</code> 集群的内存，看看有没有哪个节点快爆了？”</li><li><strong>Agent 会自动完成：</strong> 解析出 <code>cluster_name=&quot;web-prod&quot;</code> -&gt; 调用工具生成 PromQL -&gt; 拿到表格 -&gt; 分析表格数据 -&gt; 告诉你“节点 A 内存 95%，需要注意”。</li></ol><p><strong>这就是你简历里提到的“全流程告警闭环”的起点！</strong> <strong>你想不想再加一个 Skill：当发现 CPU 过高时，让 Agent 自动去查该节点上负载最高的进程名？</strong>（这需要用到 SSH 相关的工具了）</p>`,20)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};