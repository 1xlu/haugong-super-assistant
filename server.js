const http = require('http');

// 后端“数据库”，每次重启都会清空，让你从零开始测试
let todos = [];    
let expenses = []; 
let messages = []; 

// 生成绝对不会重复的短字符串 ID
const generateId = () => Math.random().toString(36).substring(2, 9);

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        let parsedBody = {};
        if (body) {
            try { parsedBody = JSON.parse(body); } catch (e) {}
        }

        res.setHeader('Content-Type', 'application/json');

        // 获取所有数据
        if (req.url === '/api/data' && req.method === 'GET') {
            const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
            res.end(JSON.stringify({ todos, expenses, messages, totalExpense }));
        }
        
        // --- 待办事项接口 ---
        else if (req.url === '/api/todos' && req.method === 'POST') {
            todos.push({ id: generateId(), text: parsedBody.text, done: false, date: parsedBody.date });
            res.end(JSON.stringify({ success: true }));
        }
        else if (req.url === '/api/todos/toggle' && req.method === 'POST') {
            const todo = todos.find(t => String(t.id) === String(parsedBody.id));
            if (todo) todo.done = !todo.done;
            res.end(JSON.stringify({ success: true }));
        }
        else if (req.url === '/api/todos/delete' && req.method === 'POST') {
            todos = todos.filter(t => String(t.id) !== String(parsedBody.id));
            res.end(JSON.stringify({ success: true }));
        }

        // --- 记账接口 ---
        else if (req.url === '/api/expenses' && req.method === 'POST') {
            expenses.push({ id: generateId(), name: parsedBody.name, amount: Number(parsedBody.amount), date: parsedBody.date });
            res.end(JSON.stringify({ success: true }));
        }
        else if (req.url === '/api/expenses/delete' && req.method === 'POST') {
            expenses = expenses.filter(e => String(e.id) !== String(parsedBody.id));
            res.end(JSON.stringify({ success: true }));
        }

        // --- 留言接口 ---
        else if (req.url === '/api/messages' && req.method === 'POST') {
            messages.push({ id: generateId(), text: parsedBody.text, emoji: parsedBody.emoji, time: new Date().toLocaleString() });
            res.end(JSON.stringify({ success: true }));
        }
        
        else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });
});

server.listen(3000, () => {
    console.log('✅ 终极版后端已启动！端口 3000');
});``