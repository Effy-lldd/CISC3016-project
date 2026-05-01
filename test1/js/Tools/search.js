/**
 * 路径：js/Tools/search.js
 * 功能：集成金融单词拼写检查与词典查询 (Requirement 5)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取 HTML 中的搜索输入框[cite: 4, 11]
    const searchInput = document.querySelector('.search-input');

    if (!searchInput) {
        console.error("未找到 class 为 'search-input' 的输入框，请检查 index.html 结构。");
        return;
    }

    console.log("词典搜索脚本已就绪...");

    // 2. 监听键盘事件
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();

            if (word === "") return;

            // 执行拼写检查逻辑
            await performSpellCheck(word, searchInput);
        }
    });
});

/**
 * 调用后端 API 进行单词校验
 */
async function performSpellCheck(word, inputElement) {
    const originalPlaceholder = inputElement.placeholder;
    
    try {
        // 视觉反馈
        inputElement.placeholder = "Searching dictionary...";
        inputElement.value = ""; 

        // 3. 发送请求到后端
        // 改用 127.0.0.1 避开部分浏览器的 localhost 解析限制
        const apiUrl = `http://127.0.0.1:54844/api/spell-check?word=${encodeURIComponent(word)}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors', // 显式声明跨域请求
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 4. 处理返回结果
        if (data.isValid) {
            // 拼写正确：弹出定义
            alert(`✅ Correct!\n\nWord: ${word.toUpperCase()}\nDefinition: ${data.definition}`);
        } else {
            // 拼写错误或未找到
            alert(`❌ Spelling Hint: ${data.message}`);
        }

    } catch (error) {
        console.error("Dictionary API Error:", error);
        // 如果报错，通常是由于浏览器拦截了私有网络请求
        alert("连接失败！请确保：\n1. Flask 后端已启动\n2. 浏览器未拦截本地请求 (检查 F12 控制台)");
    } finally {
        inputElement.placeholder = originalPlaceholder;
    }
}
