'use strict'; // 启用严格模式，帮助捕获常见错误

// 🟡 初始化用户数据（从本地存储读取）
let users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener('DOMContentLoaded', function() {
    // 🟡 功能1: 切换密码显示状态
    function togglePasswordVisibility(button) {
        const passwordInput = button.previousElementSibling;
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        button.textContent = passwordInput.type === 'password' ? '显示' : '隐藏';
    }

    // 给所有显示按钮绑定点击事件
    document.querySelectorAll('.show-btn').forEach(button => {
        button.addEventListener('click', () => togglePasswordVisibility(button));
    });

    // 🟡 功能2: 处理登录表单
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单默认提交
            
            // 获取输入值
            const username = document.getElementById('loginUser').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // 验证用户是否存在
            const foundUser = users.find(user => user.username === username);
            if (!foundUser) {
                alert('❌ 用户名不存在！');
                return;
            }
            
            // 验证密码是否正确
            if (foundUser.password !== password) {
                alert('❌ 密码错误！');
                return;
            }
            
            // 处理提交状态
            handleFormSubmit(this, '登录中...', 'taobao-main.html');
        });
    }

    // 🟡 功能3: 处理注册表单
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取输入值
            const username = document.getElementById('regUser').value.trim();
            const password = document.getElementById('regPwd').value.trim();
            const confirmPwd = document.getElementById('confirmPwd').value.trim();
            
            // 验证密码一致性
            if (password !== confirmPwd) {
                alert('❌ 两次输入的密码不一致！');
                return;
            }
            
            // 检查用户名是否已存在
            if (users.some(user => user.username === username)) {
                alert('❌ 该用户名已被注册！');
                return;
            }
            
            // 保存新用户（实际应加密存储）
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            // 处理提交状态
            handleFormSubmit(this, '注册中...', 'taobao-in.html');
        });
    }

    // 🟡 通用表单处理函数
    function handleFormSubmit(form, loadingText, redirectPage) {
        const submitButton = form.querySelector('.btn');
        
        // 显示加载状态
        submitButton.disabled = true;
        submitButton.textContent = loadingText;
        
        // 模拟网络请求延迟
        setTimeout(() => {
            // 恢复按钮状态
            submitButton.disabled = false;
            submitButton.textContent = form.id === 'registerForm' ? '立即注册' : '登录';
            
            // 提示并跳转
            alert(form.id === 'registerForm' ? '🎉 注册成功！' : '🎉 登录成功！');
            window.location.href = redirectPage;
        }, 1500);
    }
});