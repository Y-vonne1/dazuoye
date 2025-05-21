// 登录页tab切换
document.addEventListener('DOMContentLoaded', function () {
    const tabPassword = document.getElementById('tab-password');
    const tabSMS = document.getElementById('tab-sms');
    const passwordContent = document.getElementById('tab-content-password');
    const smsContent = document.getElementById('tab-content-sms');

    tabPassword.addEventListener('click', function () {
        tabPassword.classList.add('tab-active');
        tabSMS.classList.remove('tab-active');
        passwordContent.style.display = 'block';
        smsContent.style.display = 'none';
    });

    tabSMS.addEventListener('click', function () {
        tabSMS.classList.add('tab-active');
        tabPassword.classList.remove('tab-active');
        smsContent.style.display = 'block';
        passwordContent.style.display = 'none';
    });
});