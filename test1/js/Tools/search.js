/**
 * 路径：js/Tools/search.js
 * 功能：集成在线词典拼写检查 (Requirement 5)[cite: 7]
 */
document.addEventListener('DOMContentLoaded', () => {
    // 准确定位 HTML 中的搜索输入框[cite: 6]
    const searchInput = document.querySelector('.search-input');

    if (!searchInput) return;

    searchInput.addEventListener('keypress', async (e) => {
        // 仅在按下回车键时触发查询[cite: 4]
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();
            if (!word) return;

            // 视觉反馈：在搜索时改变占位符[cite: 4]
            const originalPlaceholder = searchInput.placeholder;
            searchInput.placeholder = "Querying Online Dictionary...";
            searchInput.value = "";

            try {
                // 向后端 Python API 发起请求，注意端口需与 views_3.py 一致 (54844)[cite: 5, 8]
                const response = await fetch(`http://127.0.0.1:54844/api/spell-check?word=${encodeURIComponent(word)}`);
                const data = await response.json();

                if (data.isValid) {
                    // 若拼写正确且找到定义，则弹出详细信息 (Requirement 5)[cite: 7]
                    alert(`✅ Valid Term!\n\nWord: ${word.toUpperCase()}\nDefinition: ${data.definition}`);
                } else {
                    // 若后端返回拼写错误或未找到，则显示提示信息
                    alert(`❌ Result: ${data.message}`);
                }
            } catch (error) {
                // 异常处理：后端未启动或连接超时[cite: 4]
                alert("Connection failed! Please ensure the Flask backend (views_3.py) is running on port 54844.");
            } finally {
                // 无论结果如何，恢复输入框状态
                searchInput.placeholder = originalPlaceholder;
            }
        }
    });
});
