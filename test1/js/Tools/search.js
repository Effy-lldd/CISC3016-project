/**
 * 路径：js/Tools/search.js
 * 功能：通过后端调用在线词典实现拼写检查[cite: 7]
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');[cite: 4, 6]

    if (!searchInput) return;

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const word = searchInput.value.trim();
            if (!word) return;

            // 视觉反馈：提示正在搜索[cite: 4]
            const originalPlaceholder = searchInput.placeholder;
            searchInput.placeholder = "Searching online dictionary...";
            searchInput.value = "";

            try {
                // 向后端发起请求
                const response = await fetch(`http://127.0.0.1:54844/api/spell-check?word=${encodeURIComponent(word)}`);[cite: 4, 5]
                const data = await response.json();

                if (data.isValid) {
                    // 弹出在线词典提供的定义 (满足 Requirement 5)[cite: 7]
                    alert(`✅ Correct Spelling!\n\nWord: ${word.toUpperCase()}\nDefinition: ${data.definition}`);
                } else {
                    // 拼写错误提示
                    alert(`❌ ${data.message}`);
                }
            } catch (error) {
                alert("Connection failed! Please ensure the Flask backend is running.");[cite: 4]
            } finally {
                searchInput.placeholder = originalPlaceholder;
            }
        }
    });
});
