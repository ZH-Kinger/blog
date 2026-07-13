import{i as e,r as t,s as n}from"./app-BGGt1IWt.js";import{t as r}from"./plugin-vue_export-helper-CDQIAITX.js";var i=JSON.parse(`{"path":"/posts/DevOps/Ansible%E9%85%8D%E7%BD%AE.html","title":"Ansible配置","lang":"zh-CN","frontmatter":{"title":"Ansible配置","icon":"server","date":"2026-03-04T00:00:00.000Z","category":["运维"],"description":"修改主配置文件 主配置文件 在文件末尾添加以下内容（将你的 Web 节点和 LB 节点分组）： 注：虽然现在为了实验方便使用了明文密码，但在真实生产环境中，建议使用 SSH 密钥对（先跑起来后面会修改）。 ** 修改 vi /etc/ansible/ansible.cfg 由于我们暂时使用明文密码登录我们需要禁用ssh指纹验证（需要安装sshpass）...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Ansible配置\\",\\"image\\":[\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772614541440-48ef7577-6a98-46b8-b36a-2459b2b1c457.png\\",\\"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772616025124-585e1044-80d6-4393-ba7f-6a8b5dfc9cb5.png\\"],\\"datePublished\\":\\"2026-03-04T00:00:00.000Z\\",\\"dateModified\\":\\"2026-04-29T07:36:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Kinger\\",\\"url\\":\\"https://www.yuque.com/kinger-wwnro\\"}]}"],["meta",{"property":"og:url","content":"https://kinger.example.com/blog/posts/DevOps/Ansible%E9%85%8D%E7%BD%AE.html"}],["meta",{"property":"og:site_name","content":"王梓涵"}],["meta",{"property":"og:title","content":"Ansible配置"}],["meta",{"property":"og:description","content":"修改主配置文件 主配置文件 在文件末尾添加以下内容（将你的 Web 节点和 LB 节点分组）： 注：虽然现在为了实验方便使用了明文密码，但在真实生产环境中，建议使用 SSH 密钥对（先跑起来后面会修改）。 ** 修改 vi /etc/ansible/ansible.cfg 由于我们暂时使用明文密码登录我们需要禁用ssh指纹验证（需要安装sshpass）..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.nlark.com/yuque/0/2026/png/62301513/1772614541440-48ef7577-6a98-46b8-b36a-2459b2b1c457.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-04-29T07:36:03.000Z"}],["meta",{"property":"article:published_time","content":"2026-03-04T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-04-29T07:36:03.000Z"}]]},"git":{"createdTime":1777448163000,"updatedTime":1777448163000,"contributors":[{"name":"王梓涵","username":"","email":"914132612@qq.com","commits":1}]},"readingTime":{"minutes":4.04,"words":1212},"filePathRelative":"posts/DevOps/Ansible配置.md","excerpt":"<h2>修改主配置文件</h2>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>vi /etc/ansible/hosts</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`),a={name:`Ansible配置.md`};function o(r,i,a,o,s,c){return n(),t(`div`,null,[...i[0]||=[e(`<h2 id="修改主配置文件" tabindex="-1"><a class="header-anchor" href="#修改主配置文件"><span>修改主配置文件</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi /etc/ansible/hosts</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="主配置文件" tabindex="-1"><a class="header-anchor" href="#主配置文件"><span>主配置文件</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># This is the default ansible &#39;hosts&#39; file.</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># It should live in /etc/ansible/hosts</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span>#   - Comments begin with the &#39;#&#39; character</span></span>
<span class="line"><span>#   - Blank lines are ignored</span></span>
<span class="line"><span>#   - Groups of hosts are delimited by [header] elements</span></span>
<span class="line"><span>#   - You can enter hostnames or ip addresses</span></span>
<span class="line"><span>#   - A hostname/ip can be a member of multiple groups</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Ex 1: Ungrouped hosts, specify before any group headers:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## green.example.com</span></span>
<span class="line"><span>## blue.example.com</span></span>
<span class="line"><span>## 192.168.100.1</span></span>
<span class="line"><span>## 192.168.100.10</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Ex 2: A collection of hosts belonging to the &#39;webservers&#39; group:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## [webservers]</span></span>
<span class="line"><span>## alpha.example.org</span></span>
<span class="line"><span>## beta.example.org</span></span>
<span class="line"><span>## 192.168.1.100</span></span>
<span class="line"><span>## 192.168.1.110</span></span>
<span class="line"><span></span></span>
<span class="line"><span># If you have multiple hosts following a pattern, you can specify</span></span>
<span class="line"><span># them like this:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## www[001:006].example.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span># You can also use ranges for multiple hosts: </span></span>
<span class="line"><span></span></span>
<span class="line"><span>## db-[99:101]-node.example.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Ex 3: A collection of database servers in the &#39;dbservers&#39; group:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## [dbservers]</span></span>
<span class="line"><span>##</span></span>
<span class="line"><span>## db01.intranet.mydomain.net</span></span>
<span class="line"><span>## db02.intranet.mydomain.net</span></span>
<span class="line"><span>## 10.25.1.56</span></span>
<span class="line"><span>## 10.25.1.57</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span># Ex4: Multiple hosts arranged into groups such as &#39;Debian&#39; and &#39;openSUSE&#39;:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## [Debian]</span></span>
<span class="line"><span>## alpha.example.org</span></span>
<span class="line"><span>## beta.example.org</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## [openSUSE]</span></span>
<span class="line"><span>## green.example.com</span></span>
<span class="line"><span>## blue.example.com</span></span>
<span class="line"><span>[dmz_cluster]</span></span>
<span class="line"><span>192.168.31.130</span></span>
<span class="line"><span>192.168.31.131</span></span>
<span class="line"><span>192.168.31.132</span></span>
<span class="line"><span>192.168.31.133</span></span>
<span class="line"><span>192.168.31.135</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[dmz_cluster:vars]</span></span>
<span class="line"><span>ansible_user=root</span></span>
<span class="line"><span>ansible_ssh_pass=123456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在文件末尾添加以下内容-将你的-web-节点和-lb-节点分组" tabindex="-1"><a class="header-anchor" href="#在文件末尾添加以下内容-将你的-web-节点和-lb-节点分组"><span>在文件末尾添加以下内容（将你的 Web 节点和 LB 节点分组）：</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[dmz_cluster]</span></span>
<span class="line"><span>192.168.31.130</span></span>
<span class="line"><span>192.168.31.131</span></span>
<span class="line"><span>192.168.31.132</span></span>
<span class="line"><span>192.168.31.133</span></span>
<span class="line"><span>192.168.31.135</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[dmz_cluster:vars]</span></span>
<span class="line"><span>ansible_user=root</span></span>
<span class="line"><span>ansible_ssh_pass=123456</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em>注：虽然现在为了实验方便使用了明文密码，但在真实生产环境中，建议使用 SSH 密钥对（先跑起来后面会修改）。</em></p><p>**</p><h3 id="修改-vi-etc-ansible-ansible-cfg" tabindex="-1"><a class="header-anchor" href="#修改-vi-etc-ansible-ansible-cfg"><span>修改 vi /etc/ansible/ansible.cfg</span></a></h3><p><strong>由于我们暂时使用明文密码登录我们需要禁用ssh指纹验证（需要安装sshpass）</strong></p><p>在文件末尾添加一下内容</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[defaults]</span></span>
<span class="line"><span>host_key_checking = False</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="ansible-cfg配置文件" tabindex="-1"><a class="header-anchor" href="#ansible-cfg配置文件"><span>ansible.cfg配置文件</span></a></h4><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span># Since Ansible 2.12 (core):</span></span>
<span class="line"><span># To generate an example config file (a &quot;disabled&quot; one with all default settings, commented out):</span></span>
<span class="line"><span>#               $ ansible-config init --disabled &gt; ansible.cfg</span></span>
<span class="line"><span>#</span></span>
<span class="line"><span># Also you can now have a more complete file by including existing plugins:</span></span>
<span class="line"><span># ansible-config init --disabled -t all &gt; ansible.cfg</span></span>
<span class="line"><span></span></span>
<span class="line"><span># For previous versions of Ansible you can check for examples in the &#39;stable&#39; branches of each version</span></span>
<span class="line"><span># Note that this file was always incomplete  and lagging changes to configuration settings</span></span>
<span class="line"><span></span></span>
<span class="line"><span># for example, for 2.9: https://github.com/ansible/ansible/blob/stable-2.9/examples/ansible.cfg</span></span>
<span class="line"><span>[defaults]</span></span>
<span class="line"><span>host_key_checking = False</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="为什么要修改" tabindex="-1"><a class="header-anchor" href="#为什么要修改"><span>为什么要修改？</span></a></h4><p>简单来说，host_key_checking = False 的作用就是：<strong>取消 SSH 首次连接时的“身份确认”提问。</strong></p><h5 id="_1-关掉它之前-默认状态" tabindex="-1"><a class="header-anchor" href="#_1-关掉它之前-默认状态"><span>1. 关掉它之前（默认状态）</span></a></h5><p>当你第一次 SSH 连接一台新机器（比如 131）时，系统会停下来问你：</p><p><em>&quot;我不认识这台机器，你确定要连接吗？(yes/no)&quot;</em></p><p>这时候，自动化工具（Ansible/sshpass）会因为没人帮它敲 yes 而直接<strong>卡死或报错</strong>。</p><h5 id="_2-关掉它之后-设置成-false" tabindex="-1"><a class="header-anchor" href="#_2-关掉它之后-设置成-false"><span>2. 关掉它之后（设置成 False）</span></a></h5><p>Ansible 会直接略过这个提问，<strong>闭着眼睛直接连</strong>。</p><ul><li><strong>好处</strong>：你的自动化脚本可以一次性顺畅地跑完 100 台机器，不再需要人工干预。</li><li><strong>代价</strong>：安全性略微降低（无法防范极罕见的“中间人攻击”），但在你的内网实验环境下，这是<strong>必须</strong>的操作。</li></ul><hr id="IFxfK" class="ne-hr"> **一句话总结：这是为了让你的 Ansible 能够“自动”跑起来，而不被 SSH 的安全询问拦在门外。** <h3 id="连接测试-ping" tabindex="-1"><a class="header-anchor" href="#连接测试-ping"><span>连接测试 (Ping)</span></a></h3><p><em>保存退出后，运行以下命令测试 Ansible 是否能穿透防火墙控制所有机器：</em></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>ansible dmz_cluster -m ping</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>你会看到类似这样的输出：</strong></p><ul><li><strong>绿色 (SUCCESS)</strong>：表示连接成功。</li><li><strong>红色 (UNREACHABLE)</strong>：如果报错，通常是因为 SSH 首次连接需要手动确认指纹（可以通过修改 ansible.cfg 跳过，或者先手动 SSH 连一次）。</li></ul><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772614541440-48ef7577-6a98-46b8-b36a-2459b2b1c457.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="一键检查所有机器的防火墙" tabindex="-1"><a class="header-anchor" href="#一键检查所有机器的防火墙"><span>一键检查所有机器的防火墙</span></a></h3><p>既然你刚才手动设置了防火墙，现在可以用 Ansible 一行命令检查所有机器的状态，确保 80 端口都开着：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>ansible dmz_cluster -a &quot;firewall-cmd --list-all&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="ssh-密钥对登录" tabindex="-1"><a class="header-anchor" href="#ssh-密钥对登录"><span>SSH 密钥对登录</span></a></h2><p>在企业级 AIOps 环境中，<strong>SSH 密钥对登录</strong>比明文密码安全得多，因为它能有效抵御暴力破解，同时也是 Ansible 实现真·自动化（不需要 sshpass 和明文密码文件）的前提。</p><h3 id="在jumpserver服务器上生成密钥对" tabindex="-1"><a class="header-anchor" href="#在jumpserver服务器上生成密钥对"><span>在jumpserver服务器上生成密钥对</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>ssh-keygen -t rsa -b 4096 -N &quot;&quot; -f ~/.ssh/id_rsa</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://cdn.nlark.com/yuque/0/2026/png/62301513/1772616025124-585e1044-80d6-4393-ba7f-6a8b5dfc9cb5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="利用-ansible-批量分发公钥" tabindex="-1"><a class="header-anchor" href="#利用-ansible-批量分发公钥"><span>利用 Ansible 批量分发公钥</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>ansible dmz_cluster -m authorized_key -a &quot;user=root key=&#39;{{ lookup(&#39;file&#39;, &#39;~/.ssh/id_rsa.pub&#39;) }}&#39;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="修改主机清单-移除明文密码" tabindex="-1"><a class="header-anchor" href="#修改主机清单-移除明文密码"><span>修改主机清单，移除明文密码</span></a></h3><p>一旦分发成功，你就不再需要 /etc/ansible/hosts 里的密码了。</p><ul><li>编辑文件：vi /etc/ansible/hosts</li></ul><p>将内容修改为：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>[dmz_cluster]</span></span>
<span class="line"><span>192.168.31.130</span></span>
<span class="line"><span>192.168.31.131</span></span>
<span class="line"><span>192.168.31.132</span></span>
<span class="line"><span>192.168.31.133</span></span>
<span class="line"><span>192.168.31.135</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[dmz_cluster:vars]</span></span>
<span class="line"><span>ansible_user=root</span></span>
<span class="line"><span># 删掉 ansible_ssh_pass 这一行</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试连接" tabindex="-1"><a class="header-anchor" href="#测试连接"><span>测试连接</span></a></h3><h4 id="测试脚本" tabindex="-1"><a class="header-anchor" href="#测试脚本"><span>测试脚本</span></a></h4><h5 id="_1-编写脚本" tabindex="-1"><a class="header-anchor" href="#_1-编写脚本"><span>1. 编写脚本</span></a></h5><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>vi test_nodes.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>将以下内容粘贴进去：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>#!/bin/bash</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 定义待测试的 DMZ 节点 IP 列表</span></span>
<span class="line"><span>NODES=(</span></span>
<span class="line"><span>    &quot;192.168.31.130&quot;</span></span>
<span class="line"><span>    &quot;192.168.31.131&quot;</span></span>
<span class="line"><span>    &quot;192.168.31.132&quot;</span></span>
<span class="line"><span>    &quot;192.168.31.133&quot;</span></span>
<span class="line"><span>    &quot;192.168.31.135&quot;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;---------------------------------------&quot;</span></span>
<span class="line"><span>echo &quot;开始集群连通性扫描 (2026-03-04)&quot;</span></span>
<span class="line"><span>echo &quot;---------------------------------------&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for ip in &quot;\${NODES[@]}&quot;</span></span>
<span class="line"><span>do</span></span>
<span class="line"><span>    # 使用 ping 命令测试网络层，-c 1 表示发 1 个包，-W 1 表示超时 1 秒</span></span>
<span class="line"><span>    ping -c 1 -W 1 $ip &gt; /dev/null 2&gt;&amp;1</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if [ $? -eq 0 ]; then</span></span>
<span class="line"><span>        # 如果 Ping 通了，接着尝试 SSH 登录并执行命令（验证免密是否生效）</span></span>
<span class="line"><span>        # -o ConnectTimeout=1 防止死等</span></span>
<span class="line"><span>        status=$(ssh -o ConnectTimeout=1 -o BatchMode=yes root@$ip &quot;echo &#39;OK&#39;&quot; 2&gt;/dev/null)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        if [ &quot;$status&quot; == &quot;OK&quot; ]; then</span></span>
<span class="line"><span>            echo -e &quot;[\\e[32m  UP  \\e[0m] $ip - 网络正常 &amp; SSH免密成功&quot;</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>            echo -e &quot;[\\e[33m WARN \\e[0m] $ip - 网络通，但 SSH 免密失败&quot;</span></span>
<span class="line"><span>        fi</span></span>
<span class="line"><span>    else</span></span>
<span class="line"><span>        echo -e &quot;[\\e[31m DOWN \\e[0m] $ip - 网络不通 (机器可能未开启)&quot;</span></span>
<span class="line"><span>    fi</span></span>
<span class="line"><span>done</span></span>
<span class="line"><span></span></span>
<span class="line"><span>echo &quot;---------------------------------------&quot;</span></span>
<span class="line"><span>echo &quot;扫描完毕！&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr id="gpihZ" class="ne-hr"> ##### 2. 赋予执行权限并运行 <div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>chmod +x test_nodes.sh</span></span>
<span class="line"><span>./test_nodes.sh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div>`,55)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};