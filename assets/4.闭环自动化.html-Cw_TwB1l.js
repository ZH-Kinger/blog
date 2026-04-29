import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,d as e,o as i}from"./app-2JOjse27.js";const l={};function p(r,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<h2 id="核心流程设计" tabindex="-1"><a class="header-anchor" href="#核心流程设计"><span>核心流程设计</span></a></h2><p>当告警发生时，不再仅仅是发邮件给 AI，而是先尝试执行自愈逻辑：</p><ul><li><strong>识别标签</strong>：Webhook 收到告警，判断 alertname 或 severity。</li><li><strong>执行指令</strong>：匹配到 service_down 时，调用系统命令运行 ansible-playbook。</li><li><strong>二次检查</strong>：重启后调用 Prometheus API 确认指标是否恢复。</li><li><strong>最终通知</strong>：将“自愈结果”反馈到你的手机。</li></ul><h2 id="编写-ansible-自愈剧本-restart-service-yml" tabindex="-1"><a class="header-anchor" href="#编写-ansible-自愈剧本-restart-service-yml"><span>编写 Ansible 自愈剧本 (restart_service.yml)</span></a></h2><p>路径/ansible/self_healing.yml</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>---</span></span>
<span class="line"><span>- name: ZH-Kinger 故障自愈任务</span></span>
<span class="line"><span>  hosts: &quot;{{ target_host }}&quot;</span></span>
<span class="line"><span>  become: yes</span></span>
<span class="line"><span>  tasks:</span></span>
<span class="line"><span>    - name: 强制重启目标服务</span></span>
<span class="line"><span>      systemd:</span></span>
<span class="line"><span>        name: &quot;{{ target_service }}&quot;</span></span>
<span class="line"><span>        state: restarted</span></span>
<span class="line"><span>      register: restart_res</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    - name: 验证服务状态</span></span>
<span class="line"><span>      shell: &quot;systemctl is-active {{ target_service }}&quot;</span></span>
<span class="line"><span>      register: service_check</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    - name: 输出自愈状态</span></span>
<span class="line"><span>      debug:</span></span>
<span class="line"><span>        msg: &quot;服务 {{ target_service }} 现在的状态是: {{ service_check.stdout }}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="升级中间件脚本" tabindex="-1"><a class="header-anchor" href="#升级中间件脚本"><span>升级中间件脚本</span></a></h2><h3 id="v3-0-核心升级简述" tabindex="-1"><a class="header-anchor" href="#v3-0-核心升级简述"><span>V3.0 核心升级简述</span></a></h3><ul><li><strong>实现故障自愈 (Self-Healing)</strong> 不再停留在“发现问题”，而是直接通过 <strong>Ansible</strong> 介入。当 131/132 节点服务宕机时，系统会自动尝试重启修复，实现了运维的<strong>闭环自动化</strong>。</li><li><strong>AI 诊断具备“上下文意识”</strong> 你将“自愈结果”喂给了百炼 AI。AI 现在知道服务是否已经重启成功，并能根据结果给出<strong>差异化建议</strong>（成功则分析诱因，失败则给出人工抢修步骤）。</li><li><strong>数据清洗与精准投放</strong> 新增了 IP 自动提取逻辑，能自动剔除 Prometheus 标签中的端口号（如 :9100），确保自愈指令能准确送达目标主机 IP。</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>import logging</span></span>
<span class="line"><span>from logging.handlers import RotatingFileHandler</span></span>
<span class="line"><span>import dashscope</span></span>
<span class="line"><span>from dashscope import Application</span></span>
<span class="line"><span>from flask import Flask, request</span></span>
<span class="line"><span>import smtplib</span></span>
<span class="line"><span>import time</span></span>
<span class="line"><span>import random</span></span>
<span class="line"><span>import subprocess  # 新增：用于调用系统Ansible命令</span></span>
<span class="line"><span>from email.mime.text import MIMEText</span></span>
<span class="line"><span>from email.header import Header</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 1. 日志系统配置 ---</span></span>
<span class="line"><span>logging.basicConfig(level=logging.INFO)</span></span>
<span class="line"><span>logger = logging.getLogger(&quot;AI-SelfHealing&quot;)</span></span>
<span class="line"><span>file_handler = RotatingFileHandler(&#39;/llm/ai_running.log&#39;, maxBytes=5*1024*1024, backupCount=3)</span></span>
<span class="line"><span>formatter = logging.Formatter(&#39;%(asctime)s - %(levelname)s - %(message)s&#39;)</span></span>
<span class="line"><span>file_handler.setFormatter(formatter)</span></span>
<span class="line"><span>logger.addHandler(file_handler)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app = Flask(__name__)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 2. 核心参数配置 ---</span></span>
<span class="line"><span>dashscope.api_key = &quot;你的API-KEY&quot;</span></span>
<span class="line"><span>APP_ID = &quot;你的应用id&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SMTP_SERVER = &quot;smtp.163.com&quot;</span></span>
<span class="line"><span>SMTP_PORT = 465</span></span>
<span class="line"><span>MAIL_USER = &quot;www914132612@163.com&quot;</span></span>
<span class="line"><span>MAIL_PASS = &quot;你的邮箱授权码&quot;</span></span>
<span class="line"><span>RECEIVER = &quot;914132612@qq.com&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 3. 自愈逻辑函数 (第四阶段核心) ---</span></span>
<span class="line"><span>def run_self_healing(instance_ip, alert_name):</span></span>
<span class="line"><span>    &quot;&quot;&quot;匹配告警并执行Ansible自愈脚本&quot;&quot;&quot;</span></span>
<span class="line"><span>    # 告警名与系统服务的映射表</span></span>
<span class="line"><span>    service_map = {</span></span>
<span class="line"><span>        &quot;KubeletDown&quot;: &quot;kubelet&quot;,</span></span>
<span class="line"><span>        &quot;DockerDown&quot;: &quot;docker&quot;,</span></span>
<span class="line"><span>        &quot;NginxDown&quot;: &quot;nginx&quot;,</span></span>
<span class="line"><span>        &quot;ServiceDown&quot;: &quot;docker&quot; # 默认策略</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 匹配服务名</span></span>
<span class="line"><span>    target_svc = None</span></span>
<span class="line"><span>    for key in service_map:</span></span>
<span class="line"><span>        if key in alert_name:</span></span>
<span class="line"><span>            target_svc = service_map[key]</span></span>
<span class="line"><span>            break</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>    if not target_svc:</span></span>
<span class="line"><span>        return &quot;⚠️ 未匹配到预设自愈方案，跳过自动修复。&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    logger.info(f&quot;🛠️ 触发自愈：尝试重启 {instance_ip} 上的 {target_svc} 服务...&quot;)</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # 构造Ansible指令 (指向你指定的路径)</span></span>
<span class="line"><span>    ansible_cmd = [</span></span>
<span class="line"><span>        &quot;ansible-playbook&quot;,</span></span>
<span class="line"><span>        &quot;/ansible/self_healing.yml&quot;,</span></span>
<span class="line"><span>        &quot;-e&quot;, f&quot;target_host={instance_ip} target_service={target_svc}&quot;</span></span>
<span class="line"><span>    ]</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    try:</span></span>
<span class="line"><span>        # 执行命令，超时45秒</span></span>
<span class="line"><span>        result = subprocess.run(ansible_cmd, capture_output=True, text=True, timeout=45)</span></span>
<span class="line"><span>        if result.returncode == 0:</span></span>
<span class="line"><span>            logger.info(f&quot;✅ 节点 {instance_ip} 自愈指令执行成功&quot;)</span></span>
<span class="line"><span>            return f&quot;✅ 自愈动作已执行：已下发 {target_svc} 重启指令。&quot;</span></span>
<span class="line"><span>        else:</span></span>
<span class="line"><span>            logger.error(f&quot;❌ Ansible自愈失败: {result.stderr}&quot;)</span></span>
<span class="line"><span>            return f&quot;❌ 自愈动作失败：Ansible执行异常，请人工介入。&quot;</span></span>
<span class="line"><span>    except Exception as e:</span></span>
<span class="line"><span>        logger.error(f&quot;🚨 自愈模块崩溃: {str(e)}&quot;)</span></span>
<span class="line"><span>        return f&quot;🚨 自愈系统故障: {str(e)}&quot;</span></span>
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
<span class="line"><span>        # 提取干净的 IP (去掉 :9100 等端口号)</span></span>
<span class="line"><span>        raw_instance = alert[&#39;labels&#39;].get(&#39;instance&#39;, &#39;192.168.31.x&#39;)</span></span>
<span class="line"><span>        instance = raw_instance.split(&#39;:&#39;)[0] </span></span>
<span class="line"><span>        alert_name = alert[&#39;labels&#39;].get(&#39;alertname&#39;, &#39;未知告警&#39;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # --- A. 执行自愈流程 ---</span></span>
<span class="line"><span>        healing_result = run_self_healing(instance, alert_name)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        # --- B. 准备 AI 诊断 ---</span></span>
<span class="line"><span>        current_session_id = f&quot;session_{instance.replace(&#39;.&#39;, &#39;_&#39;)}&quot;</span></span>
<span class="line"><span>        random_mark = random.randint(1000, 9999)</span></span>
<span class="line"><span>        timestamp = time.strftime(&quot;%H:%M:%S&quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        logger.info(f&quot;开始诊断节点 {instance} (Mark: {random_mark})...&quot;)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            # 将自愈结果直接喂给 AI 增加上下文</span></span>
<span class="line"><span>            response = Application.call(</span></span>
<span class="line"><span>                app_id=APP_ID, </span></span>
<span class="line"><span>                prompt=(</span></span>
<span class="line"><span>                    f&quot;【ZH-Kinger 自动化报告 - 编号：{random_mark}】\\n&quot;</span></span>
<span class="line"><span>                    f&quot;1. 节点信息：{instance}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;2. 告警事件：{alert_name}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;3. 自动修复结果：{healing_result}\\n\\n&quot;</span></span>
<span class="line"><span>                    f&quot;请作为 SRE 专家：\\n&quot;</span></span>
<span class="line"><span>                    f&quot;- 如果修复成功，分析该服务为何会崩溃（根因追溯）。\\n&quot;</span></span>
<span class="line"><span>                    f&quot;- 如果修复失败，给出最急迫的人工介入指令。&quot;</span></span>
<span class="line"><span>                ),</span></span>
<span class="line"><span>                session_id=current_session_id,</span></span>
<span class="line"><span>                parameters={&#39;temperature&#39;: 0.8, &#39;top_p&#39;: 0.95}</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>            if response.status_code == 200:</span></span>
<span class="line"><span>                ai_report = response.output.text</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>                # 4. 构造邮件内容 (包含自愈详情)</span></span>
<span class="line"><span>                subject = f&quot;【ZH-Kinger 自愈&amp;诊断】{alert_name} @ {instance} (#{random_mark})&quot;</span></span>
<span class="line"><span>                content = (</span></span>
<span class="line"><span>                    f&quot;告警节点: {instance}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;告警项目: {alert_name}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;自愈尝试: {healing_result}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;诊断序列: {random_mark}\\n&quot;</span></span>
<span class="line"><span>                    f&quot;-------------------------------------------\\n&quot;</span></span>
<span class="line"><span>                    f&quot;AI 专家深度分析:\\n{ai_report}&quot;</span></span>
<span class="line"><span>                )</span></span>
<span class="line"><span>                send_email(subject, content)</span></span>
<span class="line"><span>            else:</span></span>
<span class="line"><span>                logger.error(f&quot;百炼 API 异常: {response.message}&quot;)</span></span>
<span class="line"><span>                </span></span>
<span class="line"><span>        except Exception as e:</span></span>
<span class="line"><span>            logger.error(f&quot;处理告警逻辑时发生崩溃: {str(e)}&quot;)</span></span>
<span class="line"><span>            </span></span>
<span class="line"><span>    return &quot;OK&quot;, 200</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if __name__ == &#39;__main__&#39;:</span></span>
<span class="line"><span>    logger.info(&quot;ZH-Kinger AI 闭环系统 V3.0 上线 (已集成Ansible自愈模块)&quot;)</span></span>
<span class="line"><span>    app.run(host=&#39;0.0.0.0&#39;, port=5000)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10)])])}const d=n(l,[["render",p]]),v=JSON.parse('{"path":"/posts/DevOps/4.%E9%97%AD%E7%8E%AF%E8%87%AA%E5%8A%A8%E5%8C%96.html","title":"4.闭环自动化","lang":"zh-CN","frontmatter":{"title":"4.闭环自动化","icon":"server","date":"2026-03-05T00:00:00.000Z","category":["运维"],"description":"核心流程设计 当告警发生时，不再仅仅是发邮件给 AI，而是先尝试执行自愈逻辑： 识别标签：Webhook 收到告警，判断 alertname 或 severity。 执行指令：匹配到 service_down 时，调用系统命令运行 ansible-playbook。 二次检查：重启后调用 Prometheus API 确认指标是否恢复。 最终通知：将“...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"4.闭环自动化\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2026-03-05T00:00:00.000Z\\",\\"dateModified\\":\\"2026-04-29T07:36:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"王梓涵\\",\\"url\\":\\"https://mister-hope.com\\"}]}"],["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/DevOps/4.%E9%97%AD%E7%8E%AF%E8%87%AA%E5%8A%A8%E5%8C%96.html"}],["meta",{"property":"og:site_name","content":"王梓涵"}],["meta",{"property":"og:title","content":"4.闭环自动化"}],["meta",{"property":"og:description","content":"核心流程设计 当告警发生时，不再仅仅是发邮件给 AI，而是先尝试执行自愈逻辑： 识别标签：Webhook 收到告警，判断 alertname 或 severity。 执行指令：匹配到 service_down 时，调用系统命令运行 ansible-playbook。 二次检查：重启后调用 Prometheus API 确认指标是否恢复。 最终通知：将“..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-04-29T07:36:03.000Z"}],["meta",{"property":"article:published_time","content":"2026-03-05T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-04-29T07:36:03.000Z"}]]},"git":{"createdTime":1777448163000,"updatedTime":1777448163000,"contributors":[{"name":"王梓涵","username":"","email":"914132612@qq.com","commits":1}]},"readingTime":{"minutes":3.85,"words":1155},"filePathRelative":"posts/DevOps/4.闭环自动化.md","excerpt":"<h2>核心流程设计</h2>\\n<p>当告警发生时，不再仅仅是发邮件给 AI，而是先尝试执行自愈逻辑：</p>\\n<ul>\\n<li><strong>识别标签</strong>：Webhook 收到告警，判断 alertname 或 severity。</li>\\n<li><strong>执行指令</strong>：匹配到 service_down 时，调用系统命令运行 ansible-playbook。</li>\\n<li><strong>二次检查</strong>：重启后调用 Prometheus API 确认指标是否恢复。</li>\\n<li><strong>最终通知</strong>：将“自愈结果”反馈到你的手机。</li>\\n</ul>","autoDesc":true}');export{d as comp,v as data};
