import requests
import random  # 新增：用于生成随机评论
from flask import jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
from CISC3016 import app

CORS(app)

# 配置信息
API_KEY = "fae9189d3ba595ded7992d66"
BASE_URL = f"https://v6.exchangerate-api.com/v6/{API_KEY}/latest/"

# 1. 修改类名为 Web (符合项目要求第 1 点)
class Web:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }

    # --- 逻辑 1: 获取实时汇率并转换 ---
    def get_exchange_rate(self, from_code, to_code):
        try:
            response = requests.get(f"{BASE_URL}{from_code.upper()}", timeout=5)
            data = response.json()
            if data.get("result") == "success":
                rates = data.get("conversion_rates", {})
                rate = rates.get(to_code.upper())
                return rate
            return None
        except Exception as e:
            print(f"API Error: {e}")
            return None

  # --- 逻辑 2: 抓取新闻 (基于 URL 去重) ---
    def fetch_news(self):
        news_list = []
        seen_urls = set()  # 改用 URL 去重，因为 URL 是唯一的身份证
        target_url = "https://www.ig.com/uk/news-and-trade-ideas"
        
        try:
            res = requests.get(target_url, headers=self.headers, timeout=5)
            soup = BeautifulSoup(res.text, 'html.parser')
            
            for item in soup.find_all('h3', limit=20):
                a_tag = item.find('a', href=True)
                if a_tag:
                    # 1. 提取并补全 URL
                    link = a_tag['href']
                    full_url = link if link.startswith('http') else f"https://www.ig.com{link}"
                    
                    # 2. 提取并清洗标题
                    raw_title = a_tag.get_text(strip=True).replace('\u200b', '')
                    
                    # 3. 核心判断：如果这个 URL 没见过，才添加
                    if full_url not in seen_urls and len(raw_title) > 25:
                        news_list.append({
                            "title": raw_title,
                            "source": "IG Markets",
                            "url": full_url
                        })
                        seen_urls.add(full_url) # 标记此 URL 已存在
                
                if len(news_list) >= 7: break
                
        except Exception as e:
            print(f"Scraping Error: {e}")
            return [{"title": "Market news syncing...", "source": "System"}]
            
        return news_list

    # --- 新增逻辑 3: 随机相关评论 (符合项目要求第 3 点) ---
    def get_random_comment(self, rate):
        comments = [
            f"The current rate is {rate}. Market volatility is expected.",
            f"Trading at {rate} shows a significant trend in the currency pair.",
            f"Analysis: The level of {rate} remains a key point for investors.",
            f"With the rate at {rate}, it might be an interesting time for currency exchange."
        ]
        return random.choice(comments)

    # --- 新增逻辑 4: 拼写检查/在线词典 (符合项目要求第 5 点) ---
    def verify_spelling(self, word):
        try:
            # 集成 Free Dictionary API 作为后端验证源
            dict_url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower()}"
            res = requests.get(dict_url, timeout=5)
            # 如果状态码是 200，说明单词存在（拼写正确）
            return res.status_code == 200
        except:
            return False

# 实例化为 web_engine
web_engine = Web()

# --- API 路由 ---

@app.route('/api/convert')
def convert():
    from_curr = request.args.get('from', 'USD').upper()
    to_curr = request.args.get('to', 'GBP').upper()
    rate = web_engine.get_exchange_rate(from_curr, to_curr)
    
    if rate:
        # 获取随机评论
        comment = web_engine.get_random_comment(rate)
        return jsonify({
            "status": "success",
            "base": from_curr,
            "target": to_curr,
            "rate": rate,
            "result_text": f"1 {from_curr} = {rate} {to_curr}",
            "random_comment": comment  # 返回随机评论给前端
        })
    else:
        return jsonify({"status": "error", "message": "Could not fetch rate"}), 400

@app.route('/api/spellcheck')
def spell_check():
    """拼写检查接口 """
    word = request.args.get('word', '')
    if not word:
        return jsonify({"is_valid": False, "message": "Please enter a word"})
    
    is_valid = web_engine.verify_spelling(word)
    return jsonify({
        "word": word,
        "is_valid": is_valid,
        "message": "Correct spelling!" if is_valid else "Word not found in dictionary."
    })

@app.route('/api/news')
def api_news():
    return jsonify(web_engine.fetch_news())

@app.route('/api/supported_codes')
def get_codes():
    codes = ["USD", "EUR", "GBP", "JPY", "CNY", "HKD", "AUD", "CAD"]#后面还有的，这里只列出部分
    return jsonify(codes)

@app.route('/')
def index():
    return "<h1>Forex API Service is Ready (Web Class Implementation)</h1>"